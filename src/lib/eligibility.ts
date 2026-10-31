import { Opportunity, CitizenProfile } from '@/types';

export interface EligibilityResult {
  isEligible: boolean;
  isAgeMatch: boolean;
  isStateMatch: boolean;
  isGenderMatch: boolean;
  isQualificationMatch?: boolean;
  qualificationText?: string;
  ageText: string;
  stateText: string;
  matchScore: number;
}

/**
 * Computes citizen eligibility against an opportunity based on registered age, state, and gender.
 */
export function evaluateCitizenEligibility(
  opportunity: Opportunity,
  profile?: CitizenProfile | null
): EligibilityResult {
  if (!profile || !profile.isOnboarded) {
    return {
      isEligible: true,
      isAgeMatch: true,
      isStateMatch: true,
      isGenderMatch: true,
      ageText: 'All ages eligible',
      stateText: 'All States / Regions',
      matchScore: 100,
    };
  }

  // 1. Age Match
  let isAgeMatch = true;
  let ageText = 'All ages';
  if (opportunity.targetAges && opportunity.targetAges.length === 2) {
    const [minAge, maxAge] = opportunity.targetAges;
    isAgeMatch = profile.age >= minAge && profile.age <= maxAge;
    ageText = `${minAge} - ${maxAge} yrs`;
  }

  // 2. State / Region Match
  let isStateMatch = true;
  let stateText = 'All India / National';
  if (opportunity.stateEligibility && opportunity.stateEligibility.length > 0) {
    const isAll = opportunity.stateEligibility.includes('ALL');
    const userDivision = profile.administrativeDivision || profile.state;
    isStateMatch = isAll || (!!userDivision && opportunity.stateEligibility.includes(userDivision));
    stateText = isAll ? 'National / All States' : opportunity.stateEligibility.join(', ');
  }

  // 3. Gender Match
  let isGenderMatch = true;
  if (opportunity.genderEligibility && opportunity.genderEligibility !== 'all') {
    isGenderMatch = !profile.gender || opportunity.genderEligibility === profile.gender;
  }

  // 4. Educational Qualification Match
  let isQualificationMatch = true;
  let qualificationText = 'All Qualifications';
  if (opportunity.qualificationEligibility && opportunity.qualificationEligibility.length > 0) {
    const userQual = profile.educationLevel || profile.qualification;
    isQualificationMatch = !userQual || opportunity.qualificationEligibility.includes(userQual);
    qualificationText = opportunity.qualificationEligibility.join(', ');
  }

  const isEligible = isAgeMatch && isStateMatch && isGenderMatch && isQualificationMatch;
  let matchScore = 0;
  if (isAgeMatch) matchScore += 30;
  if (isStateMatch) matchScore += 30;
  if (isGenderMatch) matchScore += 20;
  if (isQualificationMatch) matchScore += 20;

  return {
    isEligible,
    isAgeMatch,
    isStateMatch,
    isGenderMatch,
    isQualificationMatch,
    qualificationText,
    ageText,
    stateText,
    matchScore,
  };
}
