import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = body.phoneNumber || '';
    const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);
    const cleanOtp = String(body.otp || '').replace(/\D/g, '').trim();
    const lang = body.lang === 'hi' ? 'hi' : 'en';

    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        {
          success: false,
          message: lang === 'hi' ? 'कृपया मान्य 10 अंकों का मोबाइल नंबर प्रदान करें।' : 'Please provide a valid 10-digit mobile number.',
        },
        { status: 400 }
      );
    }

    if (!cleanOtp || cleanOtp.length < 4) {
      return NextResponse.json(
        {
          success: false,
          message: lang === 'hi' ? 'कृपया वैध ओटीपी कोड दर्ज करें।' : 'Please enter a valid OTP code.',
        },
        { status: 400 }
      );
    }

    // SECURITY: No hardcoded bypass OTP codes. All OTPs must be verified against server-stored values.

    // 1. Retrieve Stored OTP Record
    const record = otpStore.getOtpRecord(cleanPhone);
    if (!record) {
      return NextResponse.json(
        {
          success: false,
          message:
            lang === 'hi'
              ? 'ओटीपी की समय सीमा समाप्त हो चुकी है या ओटीपी नहीं भेजा गया। कृपया "ओटीपी पुनः भेजें" पर क्लिक करें।'
              : 'OTP has expired or was not requested. Please click "Resend OTP".',
        },
        { status: 400 }
      );
    }

    // 2. Check Brute-force Attempts
    if (record.attempts >= 3) {
      otpStore.deleteOtp(cleanPhone);
      return NextResponse.json(
        {
          success: false,
          message:
            lang === 'hi'
              ? 'गलत ओटीपी के बहुत अधिक प्रयास। सुरक्षा कारणों से यह ओटीपी रद्द कर दिया गया है। नया ओटीपी भेजें।'
              : 'Too many incorrect attempts. This OTP has been invalidated for security. Please request a new OTP.',
        },
        { status: 400 }
      );
    }

    // 3. Verify Code
    if (record.otp === cleanOtp) {
      otpStore.deleteOtp(cleanPhone);
      return NextResponse.json({
        success: true,
        verified: true,
        phoneNumber: `+91${cleanPhone}`,
        message: lang === 'hi' ? 'मोबाइल नंबर सफलतापूर्वक सत्यापित हो गया।' : 'Mobile number verified successfully.',
      });
    } else {
      const attempts = otpStore.incrementAttempts(cleanPhone);
      const remaining = Math.max(0, 3 - attempts);
      return NextResponse.json(
        {
          success: false,
          message:
            lang === 'hi'
              ? `गलत ओटीपी कोड। कृपया सही कोड दर्ज करें। (शेष प्रयास: ${remaining})`
              : `Incorrect OTP code. Please enter the correct code. (${remaining} attempts remaining)`,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Verification error occurred.' },
      { status: 500 }
    );
  }
}
