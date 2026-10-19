import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { DatabaseService } from '@/lib/db';
import { validateRealEmail } from '@/utils/antiFraudValidation';
import { otpStore } from '@/lib/otpStore';
import { EmailService } from '@/services/emailService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawEmail = String(body.email || '');
    const lang = body.lang === 'hi' ? 'hi' : 'en';

    // 1. Email Format & Anti-Fraud Check
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

    // 2. Verify Account Exists in Database
    const citizen = await DatabaseService.findCitizen({ email: cleanEmail });
    if (!citizen) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'ACCOUNT_NOT_FOUND',
          message:
            lang === 'hi'
              ? `ईमेल "${cleanEmail}" से कोई खाता पंजीकृत नहीं है। कृपया पहले नया खाता बनाएं।`
              : `No account is registered with "${cleanEmail}". Please sign up first.`,
        },
        { status: 404 }
      );
    }

    // 3. Rate Limiting Check (Max 5 requests per 15 mins)
    const rateCheck = otpStore.checkRateLimit(`reset:${cleanEmail}`, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'RATE_LIMITED',
          message:
            lang === 'hi'
              ? `बहुत अधिक रीसेट अनुरोध किए गए हैं। कृपया ${rateCheck.resetInSeconds} सेकंड बाद पुनः प्रयास करें।`
              : `Too many password reset requests. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    // 4. Generate Cryptographically Secure 6-Digit Verification Code and Secret Token
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetToken = crypto.randomBytes(24).toString('hex');

    // 5. Store in persistent OTP store (15 minute validity)
    otpStore.setOtp(`reset:${cleanEmail}`, resetCode, 15 * 60 * 1000);
    otpStore.setOtp(`token:${resetToken}`, cleanEmail, 15 * 60 * 1000);

    // 6. Get Origin URL for direct reset link
    const origin =
      req.headers.get('origin') ||
      req.headers.get('referer')?.split('/').slice(0, 3).join('/') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      '';

    // 7. Dispatch Real Email (Nodemailer SMTP / Firebase sendOobCode / Resend / Brevo)
    const dispatchResult = await EmailService.sendPasswordResetEmail({
      toEmail: cleanEmail,
      citizenName: citizen.fullName || 'Citizen',
      resetCode,
      resetToken,
      origin,
      lang,
    });

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      method: dispatchResult.method,
      devCode: dispatchResult.method === 'FALLBACK' ? resetCode : undefined,
      message:
        lang === 'hi'
          ? `पासवर्ड रीसेट वेरिफिकेशन कोड "${cleanEmail}" पर भेज दिया गया है। कृपया अपना Gmail इनबॉक्स और स्पैम फ़ोल्डर जांचें।`
          : `Password reset verification code has been dispatched to "${cleanEmail}". Please check your inbox and spam folder.`,
    });
  } catch (error: any) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json(
      {
        success: false,
        errorType: 'SERVER_ERROR',
        message: error.message || 'तकनीकी त्रुटि आई। कृपया पुनः प्रयास करें।',
      },
      { status: 500 }
    );
  }
}
