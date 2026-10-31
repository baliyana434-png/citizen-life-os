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
  issuingAuthorityHi?: string;
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

export type CountryCode = 'IN' | 'US' | 'GB' | 'CA' | 'AU' | 'DE' | 'FR' | 'JP' | 'AE' | 'BR' | 'SG' | 'KR' | 'SA' | 'NZ' | 'ZA' | 'IT';

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
  qualificationEligibility?: EducationalQualification[];
}

export type EducationalQualification =
  | 'below_10th'
  | '10th_pass'
  | '12th_pass'
  | 'iti_diploma'
  | 'graduate'
  | 'post_graduate'
  | 'doctorate_phd';

export interface QualificationOption {
  id: EducationalQualification;
  label: string;
  labelHi: string;
}

export const QUALIFICATION_OPTIONS: QualificationOption[] = [
  { id: 'below_10th', label: 'Below 10th Standard', labelHi: '10वीं से कम' },
  { id: '10th_pass', label: '10th Pass (Matriculation)', labelHi: '10वीं पास (मैट्रिक)' },
  { id: '12th_pass', label: '12th Pass (Intermediate / 10+2)', labelHi: '12वीं पास (इंटरमीडिएट)' },
  { id: 'iti_diploma', label: 'ITI / Polytechnic Diploma', labelHi: 'आईटीआई / पॉलिटेक्निक डिप्लोमा' },
  { id: 'graduate', label: "Graduate / Bachelor's Degree", labelHi: 'स्नातक / ग्रेजुएट' },
  { id: 'post_graduate', label: "Post Graduate / Master's Degree", labelHi: 'परास्नातक / पोस्ट ग्रेजुएट' },
  { id: 'doctorate_phd', label: 'Doctorate / Ph.D. / Research', labelHi: 'डॉक्टरेट / पीएचडी' },
];

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
  casteCategory: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | string;
  familyIncomeAnnual: number;
  educationLevel: EducationalQualification;
  qualification?: EducationalQualification;
  activeGoal: string;
  notificationsEnabled: {
    webPush: boolean;
    whatsApp: boolean;
    urgentDeadlinesOnly: boolean;
  };
  subscription?: CitizenSubscription;
}

export interface CitizenSubscription {
  status: 'inactive' | 'active' | 'expired';
  plan: '1_year';
  amount: number;
  currency: string;
  activatedAt: string;
  validUntil: string;
  transactionId: string;
  paymentMethod?: string;
  signature?: string;
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
  country?: CountryCode;
}
