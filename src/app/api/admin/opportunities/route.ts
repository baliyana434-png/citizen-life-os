import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_OPPORTUNITIES } from '@/data/opportunities';
import { AdminSecurityService } from '@/lib/security';
import { isOpportunityDeadlinePassed } from '@/lib/dateUtils';

function verifyAdminAuth(req: NextRequest): boolean {
  const adminToken = req.headers.get('x-admin-token');
  if (adminToken && AdminSecurityService.verifyAdminToken(adminToken)) {
    return true;
  }
  const adminKey = req.headers.get('x-admin-key');
  const serverAdminKey = process.env.ADMIN_API_KEY;
  if (serverAdminKey && adminKey && adminKey === serverAdminKey) {
    return true;
  }
  return false;
}

export async function GET(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Admin authorization required.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const query = (searchParams.get('q') || '').toLowerCase().trim();

    const formatted = INITIAL_OPPORTUNITIES.map((opp) => {
      const isExpired = isOpportunityDeadlinePassed(opp.deadline);
      return {
        id: opp.id,
        title: opp.title,
        titleHi: opp.titleHi,
        lifeStage: opp.lifeStage,
        category: opp.category,
        issuingAuthority: opp.gazette?.issuingAuthority || 'Government / Official Authority',
        circularNumber: opp.gazette?.circularNumber || 'Official Notice',
        deadline: opp.deadline,
        isExpired,
        applicationStatus: isExpired ? 'expired' : opp.applicationStatus || 'ongoing',
        isNew: Boolean(opp.isNew),
        is100PercentFree: Boolean(opp.is100PercentFree),
        benefitHeadline: opp.benefitHeadline,
        benefitAmount: opp.benefitAmount || 0,
        officialPortalUrl: opp.gazette?.officialPortalUrl || '#',
        country: opp.country || 'IN',
        lastVerifiedAt: opp.gazette?.lastVerifiedAt || 'Recently Verified',
      };
    });

    let filtered = formatted;

    if (section && section !== 'all') {
      filtered = filtered.filter((o) => o.lifeStage === section);
    }

    if (query) {
      filtered = filtered.filter(
        (o) =>
          o.title.toLowerCase().includes(query) ||
          o.titleHi.includes(query) ||
          o.issuingAuthority.toLowerCase().includes(query) ||
          o.lifeStage.toLowerCase().includes(query)
      );
    }

    // Section Breakdown Statistics
    const sectionStats: Record<string, { count: number; active: number; expired: number }> = {};
    formatted.forEach((o) => {
      if (!sectionStats[o.lifeStage]) {
        sectionStats[o.lifeStage] = { count: 0, active: 0, expired: 0 };
      }
      sectionStats[o.lifeStage].count += 1;
      if (o.isExpired) {
        sectionStats[o.lifeStage].expired += 1;
      } else {
        sectionStats[o.lifeStage].active += 1;
      }
    });

    return NextResponse.json({
      success: true,
      totalCount: formatted.length,
      filteredCount: filtered.length,
      sectionStats,
      opportunities: filtered,
    });
  } catch (error: any) {
    console.error('Admin opportunities fetch error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch opportunities registry.' },
      { status: 500 }
    );
  }
}
