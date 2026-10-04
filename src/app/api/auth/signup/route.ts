import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, CitizenRecord, hashCitizenPassword } from '@/lib/db';
import { SessionSecurityService } from '@/lib/security';
import {
  validateRealName,
  validateRealEmail,
  validateRealPassword,
  validateRealDob,
  validateRealNationalId,
} from '@/utils/antiFraudValidation';
import { CountryCode } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lang = body.lang === 'hi' ? 'hi' : 'en';

    const fullName = String(body.fullName || '').trim();
    const rawEmail = String(body.email || '').trim();
    const password = String(body.password || '');
    const dob = String(body.dob || '').trim();
    const nationalId = String(body.nationalId || '').trim();
    const country = (body.country || 'IN') as CountryCode;
    const casteCategory = String(body.casteCategory || 'General').trim();
    const gender = (body.gender || 'male') as 'male' | 'female' | 'other';
    const division = String(body.administrativeDivision || body.state || '').trim();
    const lifePhase = String(body.lifePhase || 'college_student');

    // 1. Validate Real Name
    const nameCheck = validateRealName(fullName, lang);
    if (!nameCheck.valid) {
      return NextResponse.json(
        { success: false, errorType: 'INVALID_NAME', message: nameCheck.error },
        { status: 400 }
      );
    }

    // 2. Validate Real Email (Anti-Fake, Anti-Disposable)
    const emailCheck = validateRealEmail(rawEmail, lang);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { success: false, errorType: 'INVALID_EMAIL', message: emailCheck.error },
        { status: 400 }
      );
    }
    const cleanEmail = emailCheck.cleanEmail;
    const isGoogleLinked = Boolean(body.isGoogleLinked);
    let hash = '';
    let salt = '';

    // 3. Validate Real Password (for standard manual registration)
    if (!isGoogleLinked) {
      const passwordCheck = validateRealPassword(password, fullName, cleanEmail, lang);
      if (!passwordCheck.valid) {
        return NextResponse.json(
          { success: false, errorType: 'INVALID_PASSWORD', message: passwordCheck.error },
          { status: 400 }
        );
      }
      const hashed = hashCitizenPassword(password);
      hash = hashed.hash;
      salt = hashed.salt;
    }

    // 4. Validate Real Date of Birth & Age (Optional at basic signup)
    let userAge = 24;
    let userDob = dob || '2002-01-01';
    if (dob) {
      const dobCheck = validateRealDob(dob, lang);
      if (!dobCheck.valid) {
        return NextResponse.json(
          { success: false, errorType: 'INVALID_DOB', message: dobCheck.error },
          { status: 400 }
        );
      }
      userAge = dobCheck.age;
      userDob = dob;
    }

    // 5. Validate National ID Checksum (Optional at basic signup)
    let maskedId = '';
    if (nationalId) {
      const idCheck = validateRealNationalId(nationalId, country, lang);
      if (!idCheck.valid) {
        return NextResponse.json(
          { success: false, errorType: 'INVALID_NATIONAL_ID', message: idCheck.error },
          { status: 400 }
        );
      }
      const cleanDigits = idCheck.cleanId;
      if (country === 'IN' && cleanDigits.length === 12) {
        maskedId = `XXXX-XXXX-${cleanDigits.slice(-4)}`;
      } else if (country === 'US' && cleanDigits.length === 9) {
        maskedId = `XXX-XX-${cleanDigits.slice(-4)}`;
      } else {
        maskedId = `***-${cleanDigits.slice(-4)}`;
      }
    }

    // 6. Check if Account Already Exists
    const existing = await DatabaseService.findCitizen({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'EMAIL_ALREADY_EXISTS',
          message:
            lang === 'hi'
              ? 'यह ईमेल पहले से पंजीकृत है! कृपया लॉगिन करें या दूसरा वैध ईमेल उपयोग करें।'
              : 'This email is already registered! Please log in or use a different email.',
        },
        { status: 409 }
      );
    }

    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const citizenId = `cit-${country}-${Date.now().toString().slice(-6)}-${randomSeq}`;

    const newCitizen: CitizenRecord = {
      id: citizenId,
      fullName,
      email: cleanEmail,
      phoneNumber: '',
      photoURL: String(body.photoURL || ''),
      country,
      nationalIdName: body.nationalIdName || 'National ID',
      nationalIdMasked: maskedId,
      aadhaarNumberMasked: maskedId,
      age: userAge,
      dob: userDob,
      gender,
      state: division || 'General',
      administrativeDivision: division || 'General',
      district: division || 'General',
      pincode: '',
      lifePhase,
      casteCategory,
      familyIncomeAnnual: Number(body.familyIncomeAnnual) || 0,
      registeredAt: new Date().toISOString(),
      status: 'verified',
      isOnboarded: true,
      passwordHash: hash,
      passwordSalt: salt,
    };

    const savedCitizen = await DatabaseService.saveCitizen(newCitizen);

    // Remove security fields before returning
    const { passwordHash: _ph, passwordSalt: _ps, ...safeCitizen } = savedCitizen;

    const sessionToken = SessionSecurityService.generateSessionToken(savedCitizen.id, cleanEmail);

    return NextResponse.json({
      success: true,
      message:
        lang === 'hi'
          ? 'खाता सफलतापूर्वक बन गया! आपका वास्तविक प्रोफाइल सत्यापित हो गया है।'
          : 'Account created successfully! Your verified citizen profile is ready.',
      citizen: safeCitizen,
      sessionToken,
    });
  } catch (error: any) {
    console.error('Auth Sign Up API Error:', error);
    return NextResponse.json(
      {
        success: false,
        errorType: 'SERVER_ERROR',
        message: error.message || 'पंजीकरण प्रक्रिया में तकनीकी त्रुटि आई। कृपया पुनः प्रयास करें।',
      },
      { status: 500 }
    );
  }
}
