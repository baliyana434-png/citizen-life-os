import { CitizenProfile, Opportunity } from '@/types';

export class AutonomousScanner {
  /**
   * Calculates a precise 0-100% eligibility match score based on authenticated profile
   */
  static calculateMatchScore(profile: CitizenProfile, opp: Opportunity): number {
    let score = 0;

    // 1. Age check (Max 20 points)
    if (opp.targetAges) {
      const [minAge, maxAge] = opp.targetAges;
      if (profile.age >= minAge && profile.age <= maxAge) {
        score += 20;
      } else if (profile.age >= minAge - 1 && profile.age <= maxAge + 1) {
        score += 10;
      }
    } else {
      score += 20;
    }

    // 2. State eligibility (Max 20 points)
    if (opp.stateEligibility.includes('ALL') || opp.stateEligibility.includes(profile.state)) {
      score += 20;
    }

    // 3. Occupation / Life Phase check (Max 20 points)
    if (opp.targetOccupations.includes(profile.lifePhase)) {
      score += 20;
    } else if (opp.targetOccupations.length === 0) {
      score += 20;
    }

    // 4. Income ceiling (Max 20 points)
    if (opp.incomeCeiling) {
      if (profile.familyIncomeAnnual <= opp.incomeCeiling) {
        score += 20;
      }
    } else {
      score += 20;
    }

    // 5. Educational Qualification check (Max 20 points)
    if (opp.qualificationEligibility && opp.qualificationEligibility.length > 0) {
      const userQual = profile.educationLevel || profile.qualification;
      if (userQual && opp.qualificationEligibility.includes(userQual)) {
        score += 20;
      }
    } else {
      score += 20;
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
