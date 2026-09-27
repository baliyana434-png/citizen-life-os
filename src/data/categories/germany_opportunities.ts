import { Opportunity } from '@/types';

export const GERMANY_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'de-deutschlandstipendium',
    title: 'Deutschlandstipendium National Scholarship Programme (Germany)',
    titleHi: 'डॉइचलैंडस्टिपेंडियम राष्ट्रीय छात्रवृत्ति कार्यक्रम (जर्मनी)',
    category: 'scholarship',
    lifeStage: 'education',
    country: 'DE',
    targetAges: [18, 40],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student'],
    benefitHeadline: '€300 Monthly Direct Stipend (Independent of Personal Income, No Repayment)',
    benefitHeadlineHi: '€३०० मासिक सीधा वजीफा (व्यक्तिगत आय से स्वतंत्र, बिना किसी वापसी के)',
    deadline: '2026-10-31',
    daysRemaining: 34,
    is100PercentFree: true,
    isNew: true,
    applicationStatus: 'active_now',
    description: 'The Deutschlandstipendium supports high-achieving and committed students at state and state-recognized universities in Germany. Co-funded by the Federal Government and private sponsors.',
    descriptionHi: 'डॉइचलैंडस्टिपेंडियम जर्मन संघीय सरकार और निजी संरक्षकों द्वारा संयुक्त रूप से वित्तपोषित राष्ट्रीय छात्रवृत्ति है, जो जर्मन विश्वविद्यालयों के मेधावी विद्यार्थियों को मासिक सहायता देती है।',
    gazette: {
      circularNumber: 'DE-BMBF-DSTIP-2026',
      issuingAuthority: 'Federal Ministry of Education and Research (BMBF, Germany)',
      gazetteDate: '2026-07-01',
      lastVerifiedAt: '2026-09-23',
      officialPortalUrl: 'https://www.deutschlandstipendium.de/',
      scamAlertWarning: 'Application is handled directly by your enrolled German university. Never pay any third-party agent for scholarship nomination.',
      officialGovtFee: '€0 (Completely Free)',
    },
    documents: [
      { id: 'uni_mat', name: 'German University Matriculation Certificate (Immatrikulationsbescheinigung)', nameHi: 'विश्वविद्यालय नामांकन प्रमाण', isMandatory: true },
      { id: 'tax_id', name: 'Steuer-Identifikationsnummer (German Tax ID)', nameHi: 'जर्मन कर पहचान संख्या (स्टॉयर-आईडी)', isMandatory: true },
      { id: 'cv', name: 'Tabular CV and Proof of Social Commitment', nameHi: 'बायोडाटा एवं सामाजिक योगदान प्रमाण', isMandatory: true },
    ],
    applySteps: [
      { step: 1, text: 'Check the scholarship application period on your university portal.', textHi: 'अपने जर्मन विश्वविद्यालय के पोर्टल पर आवेदन तिथि देखें।' },
      { step: 2, text: 'Submit the online application form and academic transcript to the university committee.', textHi: 'विश्वविद्यालय समिति को ऑनलाइन प्रपत्र एवं अंकतालिका प्रस्तुत करें।' },
    ],
    tags: ['Germany', 'BMBF', 'Scholarship', 'Higher Education'],
  },
];
