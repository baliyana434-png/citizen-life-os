import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { DatabaseService } from '@/lib/db';
import { validateRealEmail } from '@/utils/antiFraudValidation';
import { rateLimiter } from '@/lib/rateLimiter';
import { otpStore } from '@/lib/otpStore';
import { EmailService } from '@/services/emailService';

const checkEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email format')
    .min(5, 'Email too short')
    .max(100, 'Email too long'),
  lang: z.enum(['en', 'hi']).optional().default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = checkEmailSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues?.[0]?.message || parseResult.error.message || 'Invalid input';
      return NextResponse.json(
        {
          success: false,
          errorType: 'VALIDATION_ERROR',
          message: firstError,
        },
        { status: 400 }
      );
    }

    const { email: rawEmail, lang } = parseResult.data;

    // 1. Anti-fraud & disposable email check
    const emailValidation = validateRealEmail(rawEmail, lang);
    if (!emailValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'INVALID_EMAIL',
          message: emailValidation.error || (lang === 'hi' ? 'अमान्य ईमेल प्रारूप।' : 'Invalid email format.'),
        },
        { status: 400 }
      );
    }

    const cleanEmail = emailValidation.cleanEmail;

    // 2. Rate Limiting: 10 requests per minute per IP
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const rateKey = `check-email:${ip}`;
    const limit = rateLimiter.consume(rateKey, 10, 60 * 1000, 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'TOO_MANY_REQUESTS',
          message:
            lang === 'hi'
              ? `बहुत अधिक अनुरोध। कृपया ${limit.resetInSeconds} सेकंड बाद पुनः प्रयास करें।`
              : `Too many requests. Please wait ${limit.resetInSeconds} seconds before trying again.`,
          retryAfter: limit.resetInSeconds,
        },
        { status: 429 }
      );
    }

    // 3. Query Database for Existing Citizen Record
    const citizen = await DatabaseService.findCitizen({ email: cleanEmail });

    // Case A: Email DOES NOT exist in database
    if (!citizen) {
      return NextResponse.json({
        success: true,
        exists: false,
        message:
          lang === 'hi'
            ? 'इस ईमेल से कोई खाता नहीं मिला। आइए एक नया खाता बनाएं।'
            : "No account found with this email. Let's create one.",
        email: cleanEmail,
      });
    }

    // Case B: Email exists but is NOT verified
    const isVerified = citizen.status === 'verified' || citizen.isOnboarded === true;
    if (!isVerified) {
      const otp = crypto.randomInt(100000, 999999).toString();
      otpStore.setOtp(`verify-email:${cleanEmail}`, otp, 10 * 60 * 1000); // 10 minutes TTL

      // Dispatch real email OTP in background without blocking API
      EmailService.sendVerificationOtpEmail({
        toEmail: cleanEmail,
        citizenName: citizen.fullName || 'Citizen',
        otp,
        lang,
      }).catch((err) => console.warn('OTP dispatch warning:', err));

      return NextResponse.json({
        success: true,
        exists: true,
        verified: false,
        message:
          lang === 'hi'
            ? `आपका ईमेल अभी सत्यापित नहीं है। हमने ${cleanEmail} पर 6-अंकों का सत्यापन कोड भेजा है।`
            : `Your email is not verified yet. We sent a 6-digit verification code to ${cleanEmail}.`,
        email: cleanEmail,
      });
    }

    // Case C: Email exists and is verified
    const isGoogleLinked = !citizen.passwordHash || !citizen.passwordSalt;

    return NextResponse.json({
      success: true,
      exists: true,
      verified: true,
      isGoogleLinked,
      fullName: citizen.fullName || '',
      email: cleanEmail,
    });
  } catch (error: any) {
    console.error('Check Email API Error:', error);
    return NextResponse.json(
      {
        success: false,
        errorType: 'SERVER_ERROR',
        message: error.message || 'Error processing email check request.',
      },
      { status: 500 }
    );
  }
}
