import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, CitizenRecord } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone')?.replace(/\D/g, '').slice(-10);
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!phone && !email) {
      return NextResponse.json(
        { success: false, message: 'फोन नंबर या ईमेल प्रदान करना आवश्यक है।' },
        { status: 400 }
      );
    }

    const matchingCitizen = await DatabaseService.findCitizen({ email, phone });

    if (!matchingCitizen) {
      return NextResponse.json(
        { success: false, message: 'नागरिक प्रोफाइल नहीं मिला।' },
        { status: 404 }
      );
    }

    // Read saved favorites for this citizen
    const key = phone || email || matchingCitizen.id;
    const citizenFavorites = await DatabaseService.getFavorites(key);

    return NextResponse.json({
      success: true,
      citizen: matchingCitizen,
      favorites: citizenFavorites,
    });
  } catch (error: any) {
    console.error('Citizen profile fetch error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'प्रोफाइल लोड करने में त्रुटि।' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const phone = body.phoneNumber ? String(body.phoneNumber).replace(/\D/g, '').slice(-10) : '';
    const email = body.email ? String(body.email).trim().toLowerCase() : '';

    if (!phone && !email && !body.id) {
      return NextResponse.json(
        { success: false, message: 'फोन नंबर या ईमेल अनिवार्य है।' },
        { status: 400 }
      );
    }

    // Check if citizen already exists
    const existing = await DatabaseService.findCitizen({ email, phone, id: body.id });

    const citizenRecord: CitizenRecord = {
      id: existing?.id || body.id || 'cit-' + Date.now(),
      fullName: body.fullName || existing?.fullName || 'Citizen',
      email: email || existing?.email || '',
      phoneNumber: phone || existing?.phoneNumber || '',
      country: body.country || existing?.country || 'IN',
      nationalIdName: body.nationalIdName || existing?.nationalIdName || undefined,
      nationalIdMasked: body.nationalIdMasked || existing?.nationalIdMasked || undefined,
      aadhaarNumberMasked: body.aadhaarNumberMasked || existing?.aadhaarNumberMasked || 'XXXX-XXXX-8921',
      age: Number(body.age) || existing?.age || 21,
      dob: body.dob || existing?.dob || '2003-08-14',
      gender: body.gender || existing?.gender || 'male',
      state: body.state || existing?.state || '',
      administrativeDivision: body.administrativeDivision || existing?.administrativeDivision || undefined,
      district: body.district || existing?.district || '',
      pincode: body.pincode || existing?.pincode || '',
      lifePhase: body.lifePhase || existing?.lifePhase || 'college_student',
      casteCategory: body.casteCategory || existing?.casteCategory || 'General',
      familyIncomeAnnual: Number(body.familyIncomeAnnual) || existing?.familyIncomeAnnual || 0,
      photoURL: body.photoURL || existing?.photoURL || undefined,
      registeredAt: existing?.registeredAt || new Date().toISOString(),
      status: 'verified',
      isOnboarded: body.isOnboarded !== undefined ? Boolean(body.isOnboarded) : (existing?.isOnboarded ?? true),
    };

    const saved = await DatabaseService.saveCitizen(citizenRecord);

    // Save favorites if provided in body
    if (Array.isArray(body.favorites)) {
      const favKey = phone || email || saved.id;
      await DatabaseService.saveFavorites(favKey, body.favorites);
    }

    return NextResponse.json({
      success: true,
      message: 'प्रोफाइल सफलतापूर्वक सुरक्षित हो गई।',
      citizen: saved,
    });
  } catch (error: any) {
    console.error('Citizen profile update error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'प्रोफाइल सुरक्षित करने में विफलता।' },
      { status: 500 }
    );
  }
}
