import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import {
  validateRealName,
  validateRealPhone,
  validateRealAadhaar,
  validateRealDob,
  validateRealPincode,
  validateRealDistrict,
  validateRealIncome,
} from '@/utils/antiFraudValidation';

export interface RegisteredCitizen {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  aadhaarNumberMasked: string;
  age: number;
  dob: string;
  gender: 'male' | 'female' | 'other';
  state: string;
  district: string;
  pincode: string;
  lifePhase: string;
  casteCategory: string;
  familyIncomeAnnual: number;
  photoURL?: string;
  registeredAt: string;
  status: 'verified';
  isOnboarded?: boolean;
  isCardVerified?: boolean;
  verificationMethod?: string;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'citizens_store.json');

const INITIAL_CITIZENS: RegisteredCitizen[] = [
  {
    id: 'cit-001',
    fullName: 'Abhay Kumar',
    email: 'abhay.kumar.citizen@gmail.com',
    phoneNumber: '9876543210',
    aadhaarNumberMasked: 'XXXX-XXXX-8921',
    age: 21,
    dob: '2003-08-14',
    gender: 'male',
    state: 'Uttar Pradesh',
    district: 'Kanpur Nagar',
    pincode: '208001',
    lifePhase: 'college_student',
    casteCategory: 'OBC',
    familyIncomeAnnual: 180000,
    photoURL: 'https://lh3.googleusercontent.com/a/default-user',
    registeredAt: '2026-09-20T10:30:00Z',
    status: 'verified',
  },
  {
    id: 'cit-002',
    fullName: 'Sunita Sharma',
    email: 'sunita.sharma@gmail.com',
    phoneNumber: '9123456780',
    aadhaarNumberMasked: 'XXXX-XXXX-4512',
    age: 28,
    dob: '1998-04-12',
    gender: 'female',
    state: 'Bihar',
    district: 'Patna',
    pincode: '800001',
    lifePhase: 'homemaker',
    casteCategory: 'General',
    familyIncomeAnnual: 220000,
    photoURL: 'https://lh3.googleusercontent.com/a/default-user',
    registeredAt: '2026-09-21T14:15:00Z',
    status: 'verified',
  },
  {
    id: 'cit-003',
    fullName: 'Rajesh Verma',
    email: 'rajesh.verma.krishi@gmail.com',
    phoneNumber: '9811223344',
    aadhaarNumberMasked: 'XXXX-XXXX-7789',
    age: 46,
    dob: '1980-11-20',
    gender: 'male',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    pincode: '462001',
    lifePhase: 'farmer',
    casteCategory: 'OBC',
    familyIncomeAnnual: 150000,
    photoURL: 'https://lh3.googleusercontent.com/a/default-user',
    registeredAt: '2026-09-22T09:45:00Z',
    status: 'verified',
  }
];

async function readCitizens(): Promise<RegisteredCitizen[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_CITIZENS, null, 2), 'utf-8');
    } catch (writeErr) {}
    return INITIAL_CITIZENS;
  }
}

async function writeCitizens(citizens: RegisteredCitizen[]): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(citizens, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write citizens file:', err);
  }
}

export async function GET() {
  try {
    const citizens = await readCitizens();
    return NextResponse.json({
      success: true,
      count: citizens.length,
      citizens,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Anti-Fraud Full Name Validation
    const nameCheck = validateRealName(body.fullName);
    if (!nameCheck.valid) {
      return NextResponse.json(
        { success: false, message: nameCheck.error || 'अमान्य नाम।' },
        { status: 400 }
      );
    }

    // 2. Anti-Fraud Phone Validation
    const phoneCheck = validateRealPhone(body.phoneNumber);
    if (!phoneCheck.valid) {
      return NextResponse.json(
        { success: false, message: phoneCheck.error || 'अमान्य मोबाइल नंबर।' },
        { status: 400 }
      );
    }

    // 3. Anti-Fraud Aadhaar Validation (if provided raw)
    if (body.aadhaarNumber) {
      const aadhaarCheck = validateRealAadhaar(body.aadhaarNumber);
      if (!aadhaarCheck.valid) {
        return NextResponse.json(
          { success: false, message: aadhaarCheck.error || 'अमान्य आधार नंबर।' },
          { status: 400 }
        );
      }
    }

    // 4. Anti-Fraud DOB Validation
    let calculatedAge = Number(body.age) || 21;
    if (body.dob) {
      const dobCheck = validateRealDob(body.dob);
      if (!dobCheck.valid) {
        return NextResponse.json(
          { success: false, message: dobCheck.error || 'अमान्य जन्म तिथि।' },
          { status: 400 }
        );
      }
      calculatedAge = dobCheck.age;
    }

    // 5. Anti-Fraud Pincode Validation
    let cleanPincode = body.pincode || '208001';
    if (body.pincode) {
      const pinCheck = validateRealPincode(body.pincode);
      if (!pinCheck.valid) {
        return NextResponse.json(
          { success: false, message: pinCheck.error || 'अमान्य पिनकोड।' },
          { status: 400 }
        );
      }
      cleanPincode = pinCheck.cleanPincode;
    }

    // 6. Anti-Fraud District Validation
    if (body.district) {
      const distCheck = validateRealDistrict(body.district);
      if (!distCheck.valid) {
        return NextResponse.json(
          { success: false, message: distCheck.error || 'अमान्य जिला।' },
          { status: 400 }
        );
      }
    }

    // 7. Anti-Fraud Income Validation
    if (body.familyIncomeAnnual !== undefined) {
      const incomeCheck = validateRealIncome(body.familyIncomeAnnual);
      if (!incomeCheck.valid) {
        return NextResponse.json(
          { success: false, message: incomeCheck.error || 'अमान्य वार्षिक आय।' },
          { status: 400 }
        );
      }
    }

    const cleanPhone = phoneCheck.cleanPhone;
    const citizens = await readCitizens();

    // Check if citizen with same phone already registered
    const existingIndex = citizens.findIndex((c) => c.phoneNumber === cleanPhone);

    const newCitizen: RegisteredCitizen = {
      id: body.id || (existingIndex >= 0 ? citizens[existingIndex].id : 'cit-' + Date.now()),
      fullName: body.fullName.trim(),
      email: body.email || '',
      phoneNumber: cleanPhone,
      aadhaarNumberMasked: body.aadhaarNumberMasked || 'XXXX-XXXX-8921',
      age: calculatedAge,
      dob: body.dob || '2003-08-14',
      gender: body.gender || 'male',
      state: body.state || 'Uttar Pradesh',
      district: body.district ? body.district.trim() : 'Kanpur Nagar',
      pincode: cleanPincode,
      lifePhase: body.lifePhase || 'college_student',
      casteCategory: body.casteCategory || 'General',
      familyIncomeAnnual: Number(body.familyIncomeAnnual) || 180000,
      photoURL: body.photoURL || undefined,
      registeredAt: new Date().toISOString(),
      status: 'verified',
      isCardVerified: false,
      verificationMethod: body.verificationMethod || 'DIGITAL_KYC_VERHOEFF',
    };

    if (existingIndex >= 0) {
      citizens[existingIndex] = newCitizen;
    } else {
      citizens.unshift(newCitizen);
    }

    await writeCitizens(citizens);

    return NextResponse.json({
      success: true,
      message: 'नागरिक विवरण सफलतापूर्वक सुरक्षित हो गया।',
      citizen: newCitizen,
    });
  } catch (error: any) {
    console.error('Citizens API error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'नागरिक डेटा सुरक्षित करने में विफलता।' },
      { status: 500 }
    );
  }
}
