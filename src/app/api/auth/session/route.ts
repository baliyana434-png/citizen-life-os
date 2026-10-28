import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';
import { SessionSecurityService } from '@/lib/security';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/sessionEdge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const citizenId = String(body.citizenId || '').trim();
    const email = String(body.email || '').trim().toLowerCase();

    if (!citizenId || !email) {
      return NextResponse.json(
        { success: false, message: 'citizenId and email are required' },
        { status: 400 }
      );
    }

    // Verify citizen exists
    const citizen = await DatabaseService.findCitizen({ id: citizenId });
    if (!citizen || (citizen.email && citizen.email.toLowerCase() !== email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid citizen credentials' },
        { status: 404 }
      );
    }

    const { passwordHash: _ph, passwordSalt: _ps, ...safeCitizen } = citizen;
    const sessionToken = SessionSecurityService.generateSessionToken(citizen.id, citizen.email || email);

    const response = NextResponse.json({
      success: true,
      citizen: safeCitizen,
      sessionToken,
    });

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
    return NextResponse.json(
      { success: false, message: error.message || 'Session creation error' },
      { status: 500 }
    );
  }
}
