import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { DatabaseService } from '@/lib/db';

const TOKENS_FILE = path.join(process.cwd(), 'src', 'data', 'push_tokens.json');

interface StoredPushToken {
  token: string;
  email?: string;
  phone?: string;
  citizenId?: string;
  country?: string;
  userAgent?: string;
  registeredAt: string;
  lastActiveAt: string;
}

async function readTokens(): Promise<StoredPushToken[]> {
  try {
    const raw = await fs.readFile(TOKENS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeTokens(tokens: StoredPushToken[]): Promise<void> {
  try {
    await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write push tokens file:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = String(body.token || '').trim();

    if (!token || token.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing device token.' },
        { status: 400 }
      );
    }

    const email = body.email ? String(body.email).trim().toLowerCase() : undefined;
    const phone = body.phone ? String(body.phone).replace(/\D/g, '').slice(-10) : undefined;
    const citizenId = body.citizenId ? String(body.citizenId).trim() : undefined;
    const country = body.country ? String(body.country).trim() : 'IN';
    const userAgent = body.userAgent ? String(body.userAgent).slice(0, 200) : undefined;

    const tokens = await readTokens();
    const now = new Date().toISOString();

    const existingIndex = tokens.findIndex((t) => t.token === token);
    const tokenRecord: StoredPushToken = {
      token,
      email,
      phone,
      citizenId,
      country,
      userAgent,
      registeredAt: existingIndex >= 0 ? tokens[existingIndex].registeredAt : now,
      lastActiveAt: now,
    };

    if (existingIndex >= 0) {
      tokens[existingIndex] = tokenRecord;
    } else {
      tokens.unshift(tokenRecord);
    }

    await writeTokens(tokens);

    // If citizen is identified, enable their webPush flag in database
    if (email || phone || citizenId) {
      try {
        const citizen = await DatabaseService.findCitizen({ email, phone, id: citizenId });
        if (citizen) {
          citizen.notificationsEnabled = {
            ...citizen.notificationsEnabled,
            webPush: true,
          };
          await DatabaseService.saveCitizen(citizen);
        }
      } catch (dbErr) {
        console.warn('Could not update citizen webPush preference:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Device push notification token registered successfully.',
      registeredCount: tokens.length,
    });
  } catch (error: any) {
    console.error('Token registration error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Server error saving push token.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tokens = await readTokens();
    return NextResponse.json({
      success: true,
      count: tokens.length,
      // Mask tokens for privacy
      sampleCount: tokens.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
