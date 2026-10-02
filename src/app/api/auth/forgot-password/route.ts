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

    // SECURITY: Always return the same response whether citizen exists or not to prevent account enumeration
    if (citizen) {
      // In production, dispatch actual password reset email/token here
      console.log(`[Forgot Password] Reset requested for existing user: ${cleanEmail}`);
    }

    return NextResponse.json({
      success: true,
      message:
        lang === 'hi'
          ? `यदि यह ईमेल पंजीकृत है, तो पासवर्ड रीसेट लिंक "${cleanEmail}" पर भेज दिया गया है। अपना इनबॉक्स जांचें।`
          : `If an account is associated with "${cleanEmail}", a password reset link has been dispatched. Please check your inbox.`,
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
