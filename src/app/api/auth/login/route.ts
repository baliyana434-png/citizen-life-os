import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, verifyCitizenPassword } from '@/lib/db';
import { SessionSecurityService } from '@/lib/security';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/sessionEdge';
import { validateRealEmail, validateRealName } from '@/utils/antiFraudValidation';
import { rateLimiter } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawName = String(body.fullName || '');
    const rawEmail = String(body.email || '');
    const password = String(body.password || '');
    const lang = body.lang === 'hi' ? 'hi' : 'en';

    // 0. Person's Legal Name Check (Optional for login)
    let cleanName = '';
    if (rawName && rawName.trim()) {
      const nameValidation = validateRealName(rawName, lang);
      if (!nameValidation.valid) {
        return NextResponse.json(
          {
            success: false,
            errorType: 'INVALID_NAME',
            message: nameValidation.error,
          },
          { status: 400 }
        );
      }
      cleanName = nameValidation.cleanName || '';
    }

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

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'MISSING_PASSWORD',
          message: lang === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.',
        },
        { status: 400 }
      );
    }

    const cleanEmail = emailValidation.cleanEmail;

    // Rate Limiting: Max 5 failed attempts per 5 minutes per IP + email
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const rateKey = `login:${ip}:${cleanEmail}`;
    const limit = rateLimiter.consume(rateKey, 5, 5 * 60 * 1000, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'TOO_MANY_ATTEMPTS',
          message:
            lang === 'hi'
              ? `बहुत अधिक असफल प्रयास। सुरक्षा कारणों से यह खाता ${limit.resetInSeconds} सेकंड के लिए अवरोधित है।`
              : `Too many failed attempts. Login locked for ${limit.resetInSeconds} seconds.`,
          retryAfter: limit.resetInSeconds,
        },
        { status: 429 }
      );
    }

    // 2. Query Database for Existing Citizen
    const citizen = await DatabaseService.findCitizen({ email: cleanEmail });

    // Account does not exist in reality
    if (!citizen) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'ACCOUNT_NOT_FOUND',
          message:
            lang === 'hi'
              ? 'यह खाता मौजूद नहीं है! कृपया पहले "खाता बनाएं (Sign Up)" से पंजीकरण करें या सही ईमेल दर्ज करें।'
              : 'This account does not exist! Please register first using "Sign Up" or check your email address.',
        },
        { status: 404 }
      );
    }

    // 3. Password Verification
    // Case A: User previously onboarded with Google and hasn't set a direct password
    if (!citizen.passwordHash || !citizen.passwordSalt) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'GOOGLE_LINKED_ACCOUNT',
          isGoogleLinked: true,
          message:
            lang === 'hi'
              ? 'यह खाता Google द्वारा पंजीकृत है। कृपया नीचे "गूगल से जारी रखें" (Google OAuth) बटन का उपयोग करें।'
              : 'This account was registered via Google. Please use the "Continue with Google" button below.',
        },
        { status: 400 }
      );
    }

    // Case B: Validate Password Hash
    const isPasswordValid = verifyCitizenPassword(password, citizen.passwordHash, citizen.passwordSalt);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          errorType: 'INVALID_PASSWORD',
          message:
            lang === 'hi'
              ? 'अमान्य पासवर्ड! दर्ज किया गया पासवर्ड गलत है। कृपया पुनः प्रयास करें।'
              : 'Invalid password! The password you entered is incorrect. Please try again.',
        },
        { status: 401 }
      );
    }

    // Password is valid and account exists
    rateLimiter.reset(rateKey);

    // Confirm and update citizen's full legal name if modified
    if (cleanName && citizen.fullName !== cleanName) {
      citizen.fullName = cleanName;
      try {
        await DatabaseService.saveCitizen(citizen);
      } catch (saveErr) {
        console.warn('Note: Could not update citizen name in DB:', saveErr);
      }
    }

    // Don't leak hash/salt back to client
    const { passwordHash: _ph, passwordSalt: _ps, ...safeCitizen } = citizen;
    safeCitizen.fullName = cleanName || citizen.fullName;

    const sessionToken = SessionSecurityService.generateSessionToken(citizen.id, citizen.email || '');

    const response = NextResponse.json({
      success: true,
      message: lang === 'hi' ? 'लॉगिन सफल रहा!' : 'Login successful!',
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
    console.error('Auth Login API Error:', error);
    return NextResponse.json(
      {
        success: false,
        errorType: 'SERVER_ERROR',
        message: error.message || 'लॉगिन प्रक्रिया में तकनीकी त्रुटि आई। कृपया पुनः प्रयास करें।',
      },
      { status: 500 }
    );
  }
}
