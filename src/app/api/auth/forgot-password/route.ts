import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';
import { validateRealEmail } from '@/utils/antiFraudValidation';

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

    // 2. Verify Account Exists in Reality
    const citizen = await DatabaseService.findCitizen({ email: cleanEmail });

    if (!citizen) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'ACCOUNT_NOT_FOUND',
          message:
            lang === 'hi'
              ? 'इस ईमेल से कोई खाता पंजीकृत नहीं है। कृपया सही ईमेल दर्ज करें या नया खाता बनाएं।'
              : 'No account is registered with this email address. Please check your email or create a new account.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        lang === 'hi'
          ? `पासवर्ड रीसेट लिंक आपके पंजीकृत ईमेल "${cleanEmail}" पर भेज दिया गया है। अपना इनबॉक्स जांचें।`
          : `A password reset link has been dispatched to your registered email "${cleanEmail}". Please check your inbox.`,
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
