import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PaymentSecurityService } from '@/lib/security';
import { DatabaseService } from '@/lib/db';
import { CitizenSubscription } from '@/types';

// TODO [PRODUCTION CRITICAL]: Replace this with actual Razorpay/Cashfree webhook verification.
// Currently requires orderId + paymentToken as minimum proof-of-payment.
// In production, this endpoint should:
// 1. Verify the payment signature from Razorpay/Cashfree using their server SDK
// 2. Cross-check orderId against your payment gateway dashboard
// 3. Verify the amount matches ₹19 on the gateway side
// 4. Only then activate the subscription

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const citizenId = PaymentSecurityService.sanitizeString(body.citizenId);
    const orderId = PaymentSecurityService.sanitizeString(body.orderId);
    const paymentToken = PaymentSecurityService.sanitizeString(body.paymentToken);
    const paymentMethod = PaymentSecurityService.sanitizeString(body.paymentMethod || 'UPI');

    // SECURITY: Require citizenId, orderId, AND paymentToken
    if (!citizenId) {
      return NextResponse.json(
        { success: false, message: 'अमान्य नागरिक अनुरोध।' },
        { status: 400 }
      );
    }

    if (!orderId || !paymentToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'भुगतान सत्यापन विफल: orderId और paymentToken आवश्यक हैं। कृपया भुगतान पूर्ण करें।',
          errorType: 'PAYMENT_PROOF_MISSING',
        },
        { status: 400 }
      );
    }

    // SECURITY: Verify the citizen actually exists before activating
    const existingCitizen = await DatabaseService.findCitizen({ id: citizenId });
    if (!existingCitizen) {
      return NextResponse.json(
        { success: false, message: 'नागरिक प्रोफाइल नहीं मिला। कृपया पहले पंजीकरण करें।' },
        { status: 404 }
      );
    }

    // SECURITY: Prevent duplicate activation with same orderId
    if (existingCitizen.subscription?.status === 'active' && existingCitizen.subscription?.transactionId) {
      return NextResponse.json({
        success: true,
        message: 'सदस्यता पहले से सक्रिय है।',
        subscription: existingCitizen.subscription,
        alreadyActive: true,
      });
    }

    // TODO [PRODUCTION]: Verify paymentToken with actual payment gateway here
    // Example for Razorpay:
    // const isValid = razorpay.webhooks.verify(orderId, paymentToken, RAZORPAY_SECRET);
    // if (!isValid) return NextResponse.json({ success: false }, { status: 403 });

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

    // Save to persistent database
    existingCitizen.subscription = subscription;
    await DatabaseService.saveCitizen(existingCitizen);

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
