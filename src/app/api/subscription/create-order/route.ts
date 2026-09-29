import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PaymentSecurityService } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const citizenId = PaymentSecurityService.sanitizeString(body.citizenId);

    if (!citizenId) {
      return NextResponse.json(
        { success: false, message: 'नागरिक पहचान (Citizen ID) आवश्यक है।' },
        { status: 400 }
      );
    }

    // SERVER-LOCKED PRICE: Hacker cannot change 19 to 1 or 0
    const FIXED_AMOUNT = 19;
    const FIXED_CURRENCY = 'INR';

    const orderId = 'ORD-19-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const timestamp = Date.now();

    return NextResponse.json({
      success: true,
      order: {
        orderId,
        amount: FIXED_AMOUNT,
        currency: FIXED_CURRENCY,
        plan: '1_year',
        citizenId,
        timestamp,
      },
    });
  } catch (error: any) {
    console.error('Create order security error:', error);
    return NextResponse.json(
      { success: false, message: 'ऑर्डर बनाने में असमर्थ।' },
      { status: 500 }
    );
  }
}
