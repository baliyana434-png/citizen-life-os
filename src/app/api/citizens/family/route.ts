import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { validateRealName } from '@/utils/antiFraudValidation';

const FAMILY_FILE = path.join(process.cwd(), 'src', 'data', 'family_store.json');

export interface StoredFamilyMember {
  id: string;
  citizenPhone: string;
  citizenEmail?: string;
  relation: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  lifePhase: string;
  isAadhaarVerified?: boolean;
  createdAt: string;
}

async function readFamily(): Promise<StoredFamilyMember[]> {
  try {
    const raw = await fs.readFile(FAMILY_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

async function writeFamily(members: StoredFamilyMember[]): Promise<void> {
  try {
    await fs.writeFile(FAMILY_FILE, JSON.stringify(members, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write family file:', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone')?.replace(/\D/g, '').slice(-10);
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!phone && !email) {
      return NextResponse.json(
        { success: false, message: 'फोन नंबर या ईमेल आवश्यक है।' },
        { status: 400 }
      );
    }

    const allMembers = await readFamily();
    const citizenFamily = allMembers.filter((m) => {
      if (phone && m.citizenPhone === phone) return true;
      if (email && m.citizenEmail && m.citizenEmail.toLowerCase() === email) return true;
      return false;
    });

    return NextResponse.json({
      success: true,
      familyMembers: citizenFamily,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = String(body.citizenPhone || '').replace(/\D/g, '').slice(-10);
    const email = String(body.citizenEmail || '').trim().toLowerCase();

    if (!phone && !email) {
      return NextResponse.json(
        { success: false, message: 'नागरिक फोन नंबर या ईमेल आवश्यक है।' },
        { status: 400 }
      );
    }

    // Name anti-fraud validation
    const nameCheck = validateRealName(body.name);
    if (!nameCheck.valid) {
      return NextResponse.json(
        { success: false, message: nameCheck.error || 'अमान्य नाम।' },
        { status: 400 }
      );
    }

    const age = Number(body.age);
    if (isNaN(age) || age < 1 || age > 115) {
      return NextResponse.json(
        { success: false, message: 'कृपया 1 से 115 वर्ष के बीच वैध आयु दर्ज करें।' },
        { status: 400 }
      );
    }

    const validRelations = ['father', 'mother', 'spouse', 'son', 'daughter', 'brother', 'sister', 'grandparent', 'other'];
    const relation = validRelations.includes(body.relation) ? body.relation : 'other';

    const allMembers = await readFamily();
    const memberId = body.id || `fam-${Date.now()}`;

    const newMember: StoredFamilyMember = {
      id: memberId,
      citizenPhone: phone,
      citizenEmail: email || undefined,
      relation,
      name: body.name.trim(),
      age,
      gender: body.gender || 'male',
      lifePhase: body.lifePhase || (age < 18 ? 'school_student' : age > 60 ? 'senior_citizen' : 'employed'),
      isAadhaarVerified: Boolean(body.isAadhaarVerified),
      createdAt: new Date().toISOString(),
    };

    const existingIndex = allMembers.findIndex((m) => m.id === memberId);
    if (existingIndex >= 0) {
      allMembers[existingIndex] = newMember;
    } else {
      allMembers.push(newMember);
    }

    await writeFamily(allMembers);

    const updatedCitizenFamily = allMembers.filter((m) => {
      if (phone && m.citizenPhone === phone) return true;
      if (email && m.citizenEmail && m.citizenEmail.toLowerCase() === email) return true;
      return false;
    });

    return NextResponse.json({
      success: true,
      message: 'परिवार का सदस्य सफलतापूर्वक जोड़ दिया गया।',
      member: newMember,
      familyMembers: updatedCitizenFamily,
    });
  } catch (error: any) {
    console.error('Add family member error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'सदस्य जोड़ने में त्रुटि।' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const phone = searchParams.get('phone')?.replace(/\D/g, '').slice(-10);
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!id || (!phone && !email)) {
      return NextResponse.json(
        { success: false, message: 'सदस्य आईडी और फोन नंबर या ईमेल आवश्यक हैं।' },
        { status: 400 }
      );
    }

    const allMembers = await readFamily();
    const filtered = allMembers.filter((m) => {
      if (m.id !== id) return true;
      if (phone && m.citizenPhone === phone) return false;
      if (email && m.citizenEmail && m.citizenEmail.toLowerCase() === email) return false;
      return true;
    });

    await writeFamily(filtered);

    const updatedCitizenFamily = filtered.filter((m) => {
      if (phone && m.citizenPhone === phone) return true;
      if (email && m.citizenEmail && m.citizenEmail.toLowerCase() === email) return true;
      return false;
    });

    return NextResponse.json({
      success: true,
      message: 'परिवार का सदस्य हटा दिया गया।',
      familyMembers: updatedCitizenFamily,
    });
  } catch (error: any) {
    console.error('Delete family member error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'सदस्य हटाने में त्रुटि।' },
      { status: 500 }
    );
  }
}
