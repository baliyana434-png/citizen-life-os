import { Opportunity } from '@/types';

export const CANADA_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'ca-student-grant-fulltime',
    title: 'Canada Student Grant for Full-Time Students (CSG-FT)',
    titleHi: 'कनाडा छात्र अनुदान (कनाडा सरकार)',
    category: 'scholarship',
    lifeStage: 'education',
    country: 'CA',
    targetAges: [17, 60],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student'],
    benefitHeadline: 'Up to C$4,200 per Year in Non-Repayable Federal Educational Grant',
    benefitHeadlineHi: 'प्रति वर्ष C$४,२०० तक का गैर-वापसी योग्य संघीय शैक्षिक अनुदान',
    deadline: '2026-07-31',
    daysRemaining: 307,
    is100PercentFree: true,
    isNew: false,
    applicationStatus: 'active_now',
    description: 'The Canada Student Grant for Full-Time Students is available to students from low- and middle-income families who are enrolled in a full-time post-secondary program at a designated educational institution.',
    descriptionHi: 'कनाडा छात्र अनुदान पात्र परिवारों के विद्यार्थियों को उच्च शिक्षा हेतु दिया जाने वाला संघीय अनुदान है। यह छात्र ऋण नहीं है, अतः इसे वापस नहीं चुकाना होता।',
    gazette: {
      circularNumber: 'CA-ESDC-CSG-2026',
      issuingAuthority: 'Employment and Social Development Canada (Government of Canada)',
      gazetteDate: '2026-08-01',
      lastVerifiedAt: '2026-09-22',
      officialPortalUrl: 'https://www.canada.ca/en/services/benefits/education/student-aid/grants-loans/full-time.html',
      scamAlertWarning: 'Students are automatically considered for the Canada Student Grant when applying for student aid through their province or territory.',
      officialGovtFee: 'C$0 (Completely Free)',
    },
    documents: [
      { id: 'sin', name: 'Social Insurance Number (SIN)', nameHi: 'सोशल इंश्योरेंस नंबर (एसआईएन)', isMandatory: true },
      { id: 'tax', name: 'Notice of Assessment (Canada Revenue Agency CRA)', nameHi: 'कनाडा राजस्व एजेंसी कर निर्धारण नोटिस', isMandatory: true },
      { id: 'enrol', name: 'Post-Secondary Enrollment Confirmation', nameHi: 'संस्थान नामांकन पुष्टि', isMandatory: true },
    ],
    applySteps: [
      { step: 1, text: 'Apply for student financial assistance through your provincial or territorial student aid office.', textHi: 'अपने प्रांतीय छात्र सहायता कार्यालय के माध्यम से आवेदन करें।' },
      { step: 2, text: 'Eligible grants are calculated automatically and deposited directly into your designated account.', textHi: 'अनुदान राशि की स्वतः गणना होकर सीधे आपके बैंक खाते में भेजी जाएगी।' },
    ],
    tags: ['Canada', 'CSG', 'Federal Grant', 'Education'],
  },
];
