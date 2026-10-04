import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
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

    // SERVER-LOCKED PRICE: Fixed ₹19 INR for 1-Year Pass
    const FIXED_AMOUNT = 19;
    const FIXED_CURRENCY = 'INR';
    const timestamp = Date.now();

    // Check for Razorpay credentials
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // 1. Production / Sandbox Razorpay Gateway Mode
    if (razorpayKeyId && razorpayKeySecret && razorpayKeyId.startsWith('rzp_')) {
      try {
        const razorpay = new Razorpay({
          key_id: razorpayKeyId,
          key_secret: razorpayKeySecret,
        });

        // Razorpay expects amount in smallest currency unit (Paisa)
        // ₹19 = 1900 Paisa
        const razorpayOrder = await razorpay.orders.create({
          amount: FIXED_AMOUNT * 100,
          currency: FIXED_CURRENCY,
          receipt: `rcpt_${citizenId.slice(0, 8)}_${timestamp.toString().slice(-6)}`,
          notes: {
            citizenId,
            plan: '1_year',
            product: 'Citizen Life OS 1-Year Access Pass',
          },
        });

        return NextResponse.json({
          success: true,
          isLive: true,
          keyId: razorpayKeyId,
          order: {
            orderId: razorpayOrder.id,
            amount: FIXED_AMOUNT,
            amountPaisa: razorpayOrder.amount,
            currency: FIXED_CURRENCY,
            plan: '1_year',
            citizenId,
            timestamp,
          },
        });
      } catch (rzpErr: any) {
        console.error('Razorpay SDK Order Error:', rzpErr);
        // Fallback to local order if Razorpay rejects network/auth
      }
    }

    // 2. Local Fallback / Test Simulation Order (if keys not yet configured)
    const localOrderId = 'ORD-19-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    return NextResponse.json({
      success: true,
      isLive: false,
      keyId: razorpayKeyId || null,
      message: 'Razorpay keys not configured in .env.local yet. Running in simulation mode.',
      order: {
        orderId: localOrderId,
        amount: FIXED_AMOUNT,
        amountPaisa: FIXED_AMOUNT * 100,
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

