import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DatabaseService } from '@/lib/db';
import { SessionSecurityService } from '@/lib/security';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/sessionEdge';
import { otpStore } from '@/lib/otpStore';

const verifyEmailOtpSchema = z.object({
  email: z.string().trim().email(),
  otp: z.string().trim().length(6, 'OTP must be 6 digits'),
  lang: z.enum(['en', 'hi']).optional().default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = verifyEmailOtpSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'VALIDATION_ERROR',
          message: parseResult.error.issues?.[0]?.message || parseResult.error.message || 'Invalid input',
        },
        { status: 400 }
      );
    }

    const { email, otp, lang } = parseResult.data;
    const cleanEmail = email.toLowerCase().trim();

    // 1. Check OTP in store
    const key = `verify-email:${cleanEmail}`;
    const record = otpStore.getOtpRecord(key);

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'OTP_EXPIRED',
          message:
            lang === 'hi'
              ? 'सत्यापन कोड समाप्त हो गया है या अमान्य है। कृपया नया कोड प्राप्त करें।'
              : 'Verification code has expired or is invalid. Please request a new one.',
        },
        { status: 400 }
      );
    }

    if (record.otp !== otp) {
      const attempts = otpStore.incrementAttempts(key);
      if (attempts >= 5) {
        otpStore.deleteOtp(key);
        return NextResponse.json(
          {
            success: false,
            errorType: 'TOO_MANY_FAILED_ATTEMPTS',
            message:
              lang === 'hi'
                ? 'बहुत अधिक गलत प्रयास। कृपया नया सत्यापन कोड अनुरोध करें।'
                : 'Too many incorrect attempts. Please request a fresh verification code.',
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          errorType: 'INVALID_OTP',
          message:
            lang === 'hi'
              ? `गलत सत्यापन कोड। आपके पास ${5 - attempts} प्रयास शेष हैं।`
              : `Incorrect code. ${5 - attempts} attempts remaining.`,
        },
        { status: 400 }
      );
    }

    // OTP is valid -> delete it
    otpStore.deleteOtp(key);

    // 2. Fetch citizen and mark verified
    const citizen = await DatabaseService.findCitizen({ email: cleanEmail });
    if (!citizen) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'CITIZEN_NOT_FOUND',
          message: 'Citizen record not found.',
        },
        { status: 404 }
      );
    }

    citizen.status = 'verified';
    citizen.isOnboarded = true;
    await DatabaseService.saveCitizen(citizen);

    const { passwordHash: _ph, passwordSalt: _ps, ...safeCitizen } = citizen;
    const sessionToken = SessionSecurityService.generateSessionToken(citizen.id, cleanEmail);

    const response = NextResponse.json({
      success: true,
      message:
        lang === 'hi'
          ? 'ईमेल सफलतापूर्वक सत्यापित हुआ!'
          : 'Email verified successfully!',
      citizen: safeCitizen,
      sessionToken,
    });

    // Set httpOnly session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error: any) {
    console.error('Verify Email OTP Error:', error);
    return NextResponse.json(
      {
        success: false,
        errorType: 'SERVER_ERROR',
        message: error.message || 'Verification error.',
      },
      { status: 500 }
    );
  }
}
