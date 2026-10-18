import { NextRequest, NextResponse } from 'next/server';
import { PaymentSecurityService } from '@/lib/security';
import { DatabaseService } from '@/lib/db';
import { CitizenSubscription } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const citizenId = PaymentSecurityService.sanitizeString(body.citizenId);
    const subscription = body.subscription as CitizenSubscription;

    if (!citizenId || !subscription) {
      return NextResponse.json(
        { valid: false, reason: 'MISSING_PAYLOAD' },
        { status: 400 }
      );
    }

    // 1. Cryptographic HMAC-SHA256 signature and expiry verification
    const isSignatureValid = PaymentSecurityService.verifySignature(subscription, citizenId);
    if (!isSignatureValid) {
      return NextResponse.json(
        { valid: false, reason: 'CRYPTOGRAPHIC_SIGNATURE_INVALID_OR_EXPIRED' },
        { status: 403 }
      );
    }

    // 2. Server database check if citizen exists
    const citizen = await DatabaseService.findCitizen({ id: citizenId });
    if (citizen && citizen.subscription) {
      // If server has a record, verify transactionId matches
      if (
        citizen.subscription.transactionId &&
        citizen.subscription.transactionId !== subscription.transactionId
      ) {
        return NextResponse.json(
          { valid: false, reason: 'TRANSACTION_ID_MISMATCH' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      valid: true,
      validUntil: subscription.validUntil,
      message: 'नागरिक सदस्यता प्रमाणीकरण सफल।',
    });
  } catch (error: any) {
    console.error('Subscription validation error:', error);
    return NextResponse.json(
      { valid: false, reason: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
