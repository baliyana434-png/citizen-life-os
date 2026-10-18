import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { AdminSecurityService } from '@/lib/security';
import { rateLimiter } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const rateKey = `admin_auth:${ip}`;

    // Anti-brute-force: Max 5 attempts per 15 minutes
    const limit = rateLimiter.consume(rateKey, 5, 15 * 60 * 1000, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'TOO_MANY_ATTEMPTS',
          message: `व्यवस्थापक सत्यापन अवरोधित: अत्यधिक असफल प्रयासों के कारण यह टर्मिनल ${limit.resetInSeconds} सेकंड के लिए लॉक है।`,
          messageEn: `Admin authentication locked: Terminal cooldown active for ${limit.resetInSeconds}s.`,
          retryAfter: limit.resetInSeconds,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const pin = String(body.pin || '').trim();

    if (!pin) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'MISSING_PIN',
          message: 'कृपया व्यवस्थापक सुरक्षा पिन दर्ज करें।',
          messageEn: 'Please enter admin security clearance PIN.',
        },
        { status: 400 }
      );
    }

    const expectedPin = process.env.ADMIN_PIN || '998877';

    // Timing-safe constant-time comparison against side-channel timing attacks
    const pinBuffer = Buffer.from(pin);
    const expectedBuffer = Buffer.from(expectedPin);
    const isValid =
      pinBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(pinBuffer, expectedBuffer);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'INVALID_PIN',
          message: `अमान्य सुरक्षा पिन। शेष प्रयास: ${limit.remaining}`,
          messageEn: `Invalid PIN. Attempts remaining: ${limit.remaining}`,
          remaining: limit.remaining,
        },
        { status: 401 }
      );
    }

    // PIN is authentic: reset rate-limit and generate signed admin session token
    rateLimiter.reset(rateKey);
    const token = AdminSecurityService.generateAdminToken();

    return NextResponse.json({
      success: true,
      token,
      message: 'व्यवस्थापक सुरक्षा क्लीयरेंस स्वीकृत।',
      messageEn: 'Admin security clearance granted.',
    });
  } catch (error: any) {
    console.error('Admin Auth Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'व्यवस्थापक सत्यापन में आंतरिक त्रुटि।',
        messageEn: 'Internal error during admin verification.',
      },
      { status: 500 }
    );
  }
}
