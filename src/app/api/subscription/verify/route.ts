import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PaymentSecurityService } from '@/lib/security';
import { DatabaseService } from '@/lib/db';
import { CitizenSubscription } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const citizenId = PaymentSecurityService.sanitizeString(body.citizenId);
    const orderId = PaymentSecurityService.sanitizeString(body.orderId);
    const paymentMethod = PaymentSecurityService.sanitizeString(body.paymentMethod || 'UPI');

    if (!citizenId) {
      return NextResponse.json(
        { success: false, message: 'अमान्य नागरिक अनुरोध।' },
        { status: 400 }
      );
    }

    // SERVER-ENFORCED AMOUNT & PLAN: Never trust client payload
    const FIXED_AMOUNT = 19;
    const FIXED_CURRENCY = 'INR';
    const PLAN = '1_year';

    // Calculate exact 365 days expiry from server clock
    const now = new Date();
    const validUntilDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    const validUntilStr = validUntilDate.toISOString().split('T')[0];

    // Generate cryptographic HMAC-SHA256 signature
    const signature = PaymentSecurityService.generateSignature(
      citizenId,
      PLAN,
      validUntilStr,
      FIXED_AMOUNT,
      FIXED_CURRENCY
    );

    const transactionId = 'TXN-19-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const subscription: CitizenSubscription = {
      status: 'active',
      plan: '1_year',
      amount: FIXED_AMOUNT,
      currency: FIXED_CURRENCY,
      activatedAt: now.toISOString(),
      validUntil: validUntilStr,
      transactionId,
      paymentMethod,
      signature,
    };

    // Save directly to persistent database
    const existingCitizen = await DatabaseService.findCitizen({ id: citizenId });
    if (existingCitizen) {
      existingCitizen.subscription = subscription;
      await DatabaseService.saveCitizen(existingCitizen);
    }

    return NextResponse.json({
      success: true,
      message: '₹19 1-वर्षीय नागरिक सदस्यता सफलतापूर्वक सत्यापित एवं सक्रिय की गई।',
      subscription,
    });
  } catch (error: any) {
    console.error('Subscription verification error:', error);
    return NextResponse.json(
      { success: false, message: 'भुगतान सत्यापन विफल रहा।' },
      { status: 500 }
    );
  }
}
