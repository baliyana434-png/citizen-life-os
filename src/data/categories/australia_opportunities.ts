import { Opportunity } from '@/types';

export const AUSTRALIA_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'au-research-training-program',
    title: 'Research Training Program (RTP Scholarships, Australian Government)',
    titleHi: 'अनुसंधान प्रशिक्षण कार्यक्रम (आरटीपी छात्रवृत्ति, ऑस्ट्रेलियाई सरकार)',
    category: 'scholarship',
    lifeStage: 'education',
    country: 'AU',
    targetAges: [21, 50],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker'],
    benefitHeadline: 'Full Postgraduate Tuition Fee Offset + A$32,192 to A$35,000 Annual Living Stipend',
    benefitHeadlineHi: 'पूर्ण शिक्षण शुल्क छूट + A$३२,१९२ से A$३५,००० तक का वार्षिक निर्वाह भत्ता',
    deadline: '2026-10-31',
    daysRemaining: 34,
    is100PercentFree: true,
    isNew: false,
    applicationStatus: 'active_now',
    description: 'The Australian Government Research Training Program (RTP) provides block grants to higher education providers to support domestic and international students undertaking Research Doctorate and Research Masters degrees.',
    descriptionHi: 'ऑस्ट्रेलियाई सरकार का अनुसंधान प्रशिक्षण कार्यक्रम (RTP) मास्टर्स एवं पीएचडी शोधार्थियों को पूर्ण शिक्षण शुल्क माफी तथा वार्षिक निर्वाह भत्ता प्रदान करता है।',
    gazette: {
      circularNumber: 'AU-DESE-RTP-2026',
      issuingAuthority: 'Department of Education (Australian Government)',
      gazetteDate: '2026-06-15',
      lastVerifiedAt: '2026-09-21',
      officialPortalUrl: 'https://www.education.gov.au/research-block-grants/research-training-program',
      scamAlertWarning: 'Applications for RTP scholarships must be made directly to participating Australian universities. No separate fee is required.',
      officialGovtFee: 'A$0 (Completely Free)',
    },
    documents: [
      { id: 'tfn', name: 'Tax File Number (TFN) or Passport (for international candidates)', nameHi: 'टैक्स फाइल नंबर (टीएफएन) अथवा पासपोर्ट', isMandatory: true },
      { id: 'deg', name: 'Four-Year Bachelor Degree with First Class Honours or Masters Equivalent', nameHi: 'स्नातक अथवा स्नातकोत्तर डिग्री प्रमाण', isMandatory: true },
      { id: 'prop', name: 'Research Proposal (Max 1,000 words)', nameHi: 'अनुसंधान प्रस्ताव (अधिकतम १,००० शब्द)', isMandatory: true },
    ],
    applySteps: [
      { step: 1, text: 'Identify a prospective research supervisor at an accredited Australian university.', textHi: 'मान्यता प्राप्त ऑस्ट्रेलियाई विश्वविद्यालय में शोध पर्यवेक्षक से संपर्क करें।' },
      { step: 2, text: 'Submit your candidature application and tick the RTP Scholarship consideration box.', textHi: 'विश्वविद्यालय में शोध दाखिला और आरटीपी छात्रवृत्ति हेतु आवेदन करें।' },
    ],
    tags: ['Australia', 'RTP', 'Doctorate', 'Fully Funded'],
  },
];
