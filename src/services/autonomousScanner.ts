import { CitizenProfile, Opportunity } from '@/types';

export class AutonomousScanner {
  /**
   * Calculates a precise 0-100% eligibility match score based on authenticated profile
   */
  static calculateMatchScore(profile: CitizenProfile, opp: Opportunity): number {
    let score = 0;

    // 1. Age check (Max 25 points)
    if (opp.targetAges) {
      const [minAge, maxAge] = opp.targetAges;
      if (profile.age >= minAge && profile.age <= maxAge) {
        score += 25;
      } else if (profile.age >= minAge - 1 && profile.age <= maxAge + 1) {
        score += 10;
      }
    } else {
      score += 25;
    }

    // 2. State eligibility (Max 25 points)
    if (opp.stateEligibility.includes('ALL') || opp.stateEligibility.includes(profile.state)) {
      score += 25;
    }

    // 3. Occupation / Life Phase check (Max 25 points)
    if (opp.targetOccupations.includes(profile.lifePhase)) {
      score += 25;
    } else if (opp.targetOccupations.length === 0) {
      score += 25;
    }

    // 4. Income ceiling (Max 25 points)
    if (opp.incomeCeiling) {
      if (profile.familyIncomeAnnual <= opp.incomeCeiling) {
        score += 25;
      }
    } else {
      score += 25;
    }

    return Math.min(score, 100);
  }

  /**
   * Filters and sorts opportunities for a citizen's live view
   */
  static getPersonalizedFeed(
    profile: CitizenProfile,
    opportunities: Opportunity[]
  ): Opportunity[] {
    return opportunities
      .map((opp) => ({
        ...opp,
        matchScore: this.calculateMatchScore(profile, opp),
      }))
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
}
