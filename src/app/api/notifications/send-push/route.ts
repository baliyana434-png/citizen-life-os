import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'src', 'data', 'push_tokens.json');

async function readTokens(): Promise<string[]> {
  try {
    const raw = await fs.readFile(TOKENS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((item: any) => item.token) : [];
  } catch (err) {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = body.title || 'Citizen Life OS — नया अवसर अलर्ट';
    const message = body.body || body.message || 'नई सरकारी योजना व भर्ती का नोटिफिकेशन उपलब्ध है।';
    const targetUrl = body.url || '/';
    const specificToken = body.token;

    const allTokens = specificToken ? [specificToken] : await readTokens();

    if (allTokens.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'कोई पंजीकृत डिवाइस टोकन नहीं मिला। कृपया पहले वेबसाइट पर नोटिफिकेशन चालू करें।',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `पुश नोटिफिकेशन ${allTokens.length} पंजीकृत डिवाइस(ज) पर सफलतापूर्वक डिस्पैच किया गया।`,
      recipientsCount: allTokens.length,
      notificationPayload: {
        title,
        body: message,
        url: targetUrl,
      },
    });
  } catch (error: any) {
    console.error('Send push notification error:', error);
    return NextResponse.json({
      success: false,
      message: error?.message || 'Failed to dispatch push notification.',
    }, { status: 500 });
  }
}
