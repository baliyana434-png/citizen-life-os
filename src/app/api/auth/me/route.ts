import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';
import { SessionSecurityService } from '@/lib/security';
import { SESSION_COOKIE_NAME } from '@/lib/sessionEdge';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const verification = SessionSecurityService.verifySessionToken(token);
    if (!verification.valid || !verification.citizenId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const citizen = await DatabaseService.findCitizen({ id: verification.citizenId });
    if (!citizen) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { passwordHash: _ph, passwordSalt: _ps, ...safeCitizen } = citizen;
    return NextResponse.json({
      authenticated: true,
      citizen: safeCitizen,
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
