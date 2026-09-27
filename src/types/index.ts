export type LifeStage = 
  | 'exams' 
  | 'private_jobs' 
  | 'internships' 
  | 'education' 
  | 'abroad_jobs'
  | 'career' 
  | 'startups' 
  | 'schemes' 
  | 'freebies' 
  | 'health';

export type OpportunityCategory = 
  | 'govt_scheme' 
  | 'competitive_exam' 
  | 'college_admission'
  | 'scholarship'
  | 'govt_job' 
  | 'private_job' 
  | 'remote_usd_job' 
  | 'startup_idea'
  | 'skill_roadmap'
  | 'free_ai_tool' 
  | 'tech_perk_free'
  | 'college_finder' 
  | 'healthcare_free'
  | 'internship'
  | 'study_abroad'
  | 'career_consultant';

export interface GazetteRef {
  circularNumber: string;
  issuingAuthority: string;
  gazetteDate: string;
  lastVerifiedAt: string;
  officialPortalUrl: string;
  officialNoticePdfUrl?: string;
  scamAlertWarning: string;
  officialGovtFee: string;
}

export interface DocumentRequired {
  id: string;
  name: string;
  nameHi: string;
  isMandatory: boolean;
  notes?: string;
}

export type GenderEligibility = 'all' | 'female' | 'male';

export type CountryCode = 'IN' | 'US' | 'GB' | 'CA' | 'AU' | 'DE' | 'GLOBAL';

export interface Opportunity {
  id: string;
  title: string;
  titleHi: string;
  category: OpportunityCategory;
  lifeStage: LifeStage;
  country?: CountryCode; // Country of origin or eligibility
  targetAges: [number, number]; // [minAge, maxAge]
  genderEligibility?: GenderEligibility; // 'all' (default), 'female', 'male'
  stateEligibility: string[]; // ['ALL'] or ['UP', 'Bihar', etc.]
  incomeCeiling?: number; // In INR or USD per annum
  targetOccupations: string[];
  benefitHeadline: string;
  benefitHeadlineHi: string;
  benefitAmount?: number; // e.g. 25000 or 0 for free
  deadline: string; // ISO date string or 'OPEN_ROUND'
  daysRemaining?: number;
  description: string;
  descriptionHi: string;
  gazette: GazetteRef;
  documents: DocumentRequired[];
  applySteps: { step: number; text: string; textHi: string }[];
  tags: string[];
  is100PercentFree: boolean;
  isNew?: boolean; // When true, renders red rotating starburst badge
  applicationStatus?: 'active_now' | 'upcoming' | 'ongoing'; // Real government status
  matchScore?: number; // 0 - 100 calculated dynamically
}

export interface CitizenProfile {
  id: string;
  fullName: string;
  email?: string;
  photoURL?: string;
  phoneNumber: string;
  country?: CountryCode;
  nationalIdName?: string; // e.g. 'Aadhaar Card', 'Social Security Number', etc.
  nationalIdMasked?: string; // e.g. 'XXXX-XXXX-8921' or 'XXX-XX-8921'
  aadhaarNumberMasked?: string; // Kept for backwards compatibility
  isAadhaarVerified: boolean;
  isOnboarded?: boolean;
  age: number;
  dob?: string;
  gender: 'male' | 'female' | 'other';
  state: string;
  district: string;
  pincode: string;
  administrativeDivision?: string;
  lifePhase: 'school_student' | 'college_student' | 'exam_aspirant' | 'job_seeker' | 'employed' | 'business_owner' | 'farmer' | 'homemaker' | 'senior_citizen';
  casteCategory: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority';
  familyIncomeAnnual: number;
  educationLevel: 'below_10th' | '10th_pass' | '12th_pass' | 'graduate' | 'post_graduate';
  activeGoal: string;
  notificationsEnabled: {
    webPush: boolean;
    whatsApp: boolean;
    urgentDeadlinesOnly: boolean;
  };
}

export interface FamilyMember {
  id: string;
  relation: 'self' | 'father' | 'mother' | 'spouse' | 'child' | 'sibling' | 'son' | 'daughter' | 'brother' | 'sister' | 'grandparent' | 'other' | string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  isAadhaarVerified: boolean;
  lifePhase: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ar';

export type HelplineCategory = 
  | 'emergency' 
  | 'cyber_legal' 
  | 'women_child' 
  | 'senior' 
  | 'farmer' 
  | 'health' 
  | 'citizen_services';

export interface HelplineFacility {
  id: string;
  number: string;
  name: string;
  nameHi: string;
  category: HelplineCategory;
  authority: string;
  authorityHi: string;
  hours: string;
  hoursHi: string;
  isTollFree: boolean;
  is24x7: boolean;
  purpose: string;
  purposeHi: string;
  guidance: string[];
  guidanceHi: string[];
  portalUrl?: string;
  tags: string[];
}
