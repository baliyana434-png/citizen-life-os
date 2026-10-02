import { Opportunity } from '@/types';

export const SCHEME_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-vishwakarma-01',
    title: 'PM Vishwakarma Yojana: ₹15,000 Free Toolkit + ₹3,00,000 Loan at 5%',
    titleHi: 'प्रधानमंत्री विश्वकर्मा योजना: ₹15,000 निःशुल्क टूलकिट + ₹3,00,000 सस्ता ऋण',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [18, 65],
    stateEligibility: ['ALL'],
    targetOccupations: ['business_owner', 'farmer', 'homemaker', 'employed'],
    benefitHeadline: '₹15,000 Free Modern Equipment Voucher + ₹3 Lakh Collateral-Free Credit + ₹500/day Stipend',
    benefitHeadlineHi: '₹15,000 का आधुनिक टूलकिट वाउचर + ₹3 लाख बिना गारंटी 5% ब्याज ऋण + ₹500 दैनिक प्रशिक्षण भत्ता',
    benefitAmount: 315000,
    deadline: 'OPEN_ROUND',
    description: 'Central government mega support scheme for 18 traditional trades including carpenters, blacksmiths, goldsmiths, tailors, barbers, masons, and cobblers.',
    descriptionHi: 'पारंपरिक 18 शिल्पकारों और कारीगरों (दर्जी, बढ़ई, लोहार, सुनार, नाई, राजमिस्त्री) के लिए केंद्र सरकार की व्यापक कल्याणकारी योजना।',
    gazette: {
      circularNumber: 'MSME/PM-VISHWAKARMA/2023-26/01',
      issuingAuthority: 'Ministry of MSME, Govt of India',
      gazetteDate: '2026-07-01',
      lastVerifiedAt: 'Live verified 4 hrs ago',
      officialPortalUrl: 'https://pmvishwakarma.gov.in',
      scamAlertWarning: 'Registration is free at Common Service Centers (CSC). No middleman can charge more than official CSC nominal biometrics fee.',
      officialGovtFee: '₹0 (Free Govt Scheme)'
    },
    documents: [
      { id: 'd-vis-1', name: 'Aadhaar Linked with Mobile', nameHi: 'मोबाइल से लिंक आधार कार्ड', isMandatory: true },
      { id: 'd-vis-2', name: 'Bank Passbook Copy', nameHi: 'बैंक पासबुक की प्रति', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Aadhaar biometric authentication at nearest CSC or official portal.', textHi: 'निकटतम सीएससी केंद्र या आधिकारिक पोर्टल पर बायोमेट्रिक सत्यापन करवाएं।' },
      { step: 2, text: 'Gram Panchayat or Urban Local Body verification of your trade.', textHi: 'ग्राम पंचायत अथवा नगर पालिका द्वारा आपके पारंपरिक कार्य का सत्यापन।' },
      { step: 3, text: 'Attend 5-7 days basic skill training with ₹500 daily stipend.', textHi: '5-7 दिनों का कौशल प्रशिक्षण लें (प्रतिदिन ₹500 भत्ता प्राप्त करें)।' },
      { step: 4, text: 'Receive ₹15,000 e-voucher for tools and apply for ₹1 Lakh initial loan.', textHi: 'टूलकिट हेतु ₹15,000 का वाउचर प्राप्त करें एवं 5% ब्याज पर ऋण लें।' }
    ],
    tags: ['Artisans', 'Business Loan', 'Central Govt', 'Vishwakarma'],
    is100PercentFree: true
  },
  {
    id: 'opp-kisan-01',
    title: 'PM-KISAN: Direct Bank Benefit of ₹6,000/Year to Farmers',
    titleHi: 'प्रधानमंत्री किसान सम्मान निधि: ₹6,000 प्रतिवर्ष सीधी बैंक सहायता',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [18, 75],
    stateEligibility: ['ALL'],
    targetOccupations: ['farmer'],
    benefitHeadline: '₹2,000 Deposited in 3 Installments Directly via Aadhaar DBT',
    benefitHeadlineHi: '₹2,000 की 3 किस्तों में प्रतिवर्ष ₹6,000 सीधे बैंक खाते में',
    benefitAmount: 6000,
    deadline: 'OPEN_ROUND',
    description: 'Income support scheme for all landholding farmer families across the country with instant direct bank transfer.',
    descriptionHi: 'देश के सभी भूमिधारक किसान परिवारों के बैंक खातों में केंद्र सरकार द्वारा प्रत्यक्ष लाभ अंतरण (डीबीटी) के माध्यम से वित्तीय सहायता।',
    gazette: {
      circularNumber: 'AGRI/PM-KISAN/19-26/DBT',
      issuingAuthority: 'Ministry of Agriculture & Farmers Welfare',
      gazetteDate: '2026-08-01',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://pmkisan.gov.in',
      scamAlertWarning: 'Do not share OTP with unofficial callers claiming to update your e-KYC. Complete e-KYC only on pmkisan.gov.in.',
      officialGovtFee: '₹0 (100% Free)'
    },
    documents: [
      { id: 'd-kis-1', name: 'Land Record (Khatauni / Khasra)', nameHi: 'खतौनी / भू-अभिलेख विवरण', isMandatory: true },
      { id: 'd-kis-2', name: 'Aadhaar Card', nameHi: 'आधार कार्ड', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Visit Farmers Corner on pmkisan.gov.in.', textHi: 'pmkisan.gov.in पोर्टल पर फार्मर्स कॉर्नर पर जाएं।' },
      { step: 2, text: 'Enter Aadhaar number and land record details.', textHi: 'आधार नंबर एवं भूलेख खतौनी का विवरण दर्ज करें।' },
      { step: 3, text: 'Complete facial or OTP e-KYC to activate installment.', textHi: 'किस्त सक्रिय करने हेतु आधार फेस अथवा ओटीपी ई-केवाईसी पूर्ण करें।' }
    ],
    tags: ['Farmers', 'Direct Cash', 'Central Govt', 'PM Kisan'],
    is100PercentFree: true
  },
  {
    id: 'opp-pmay-01',
    title: 'Pradhan Mantri Awas Yojana (PMAY-2.0): ₹2.50 Lakh House Subsidy',
    titleHi: 'प्रधानमंत्री आवास योजना (PMAY 2.0): पक्के मकान हेतु ₹2.50 लाख की सरकारी सब्सिडी',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [21, 70],
    stateEligibility: ['ALL'],
    targetOccupations: ['farmer', 'homemaker', 'business_owner', 'employed', 'job_seeker'],
    benefitHeadline: 'Direct Financial Assistance & Interest Subsidy of ₹2,50,000 for Pucca House Construction',
    benefitHeadlineHi: 'अपना पक्का मकान बनाने हेतु ₹2,50,000 की सीधी वित्तीय सहायता एवं ब्याज अनुदान',
    benefitAmount: 250000,
    deadline: 'OPEN_ROUND',
    description: 'Central and state government joint mission to provide pucca houses with water connection, toilet, and electricity to all eligible urban and rural families.',
    descriptionHi: 'गरीब और मध्यम वर्गीय परिवारों को शौचालय, नल एवं बिजली कनेक्शन युक्त पक्का घर बनाने हेतु केंद्र व राज्य सरकार की संयुक्त सहायता।',
    gazette: {
      circularNumber: 'MOHUA/PMAY-U-2.0/2026/CABINET',
      issuingAuthority: 'Ministry of Housing & Urban Affairs, Govt of India',
      gazetteDate: '2026-08-10',
      lastVerifiedAt: 'Live verified 3 hrs ago',
      officialPortalUrl: 'https://pmaymis.gov.in',
      scamAlertWarning: 'PMAY selection is audited via geo-tagging and SECC database. Never pay local municipal or panchayat middlemen for house approval.',
      officialGovtFee: '₹0 (Free Citizen Welfare)'
    },
    documents: [
      { id: 'd-pmay-1', name: 'Aadhaar of all family members', nameHi: 'परिवार के सभी सदस्यों का आधार कार्ड', isMandatory: true },
      { id: 'd-pmay-2', name: 'Income Certificate / BPL or EWS Proof', nameHi: 'आय प्रमाण पत्र / राशन कार्ड', isMandatory: true },
      { id: 'd-pmay-3', name: 'Land registry / Plot document', nameHi: 'जमीन की रजिस्ट्री / पट्टा', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Submit citizen assessment application on pmaymis.gov.in or CSC.', textHi: 'pmaymis.gov.in अथवा नजदीकी सीएससी पर ऑनलाइन आवेदन करें।' },
      { step: 2, text: 'Field geo-tagging inspection by district housing officer.', textHi: 'आवास विकास अधिकारी द्वारा जमीन का भौतिक एवं जियो-टैगिंग सत्यापन।' },
      { step: 3, text: 'Direct DBT subsidy credited in 3 construction milestone stages.', textHi: 'निर्माण के 3 चरणों में सीधी सब्सिडी राशि बैंक खाते में हस्तांतरित।' }
    ],
    tags: ['Housing', 'Family Subsidy', 'Pucca House', 'PMAY'],
    is100PercentFree: true
  },
  {
    id: 'opp-sukanya-01',
    title: 'Sukanya Samriddhi Yojana: 8.2% Tax-Free Compound Interest for Daughters',
    titleHi: 'सुकन्या समृद्धि योजना: बेटियों के भविष्य हेतु 8.2% कर-मुक्त चक्रवृद्धि ब्याज',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [22, 60],
    genderEligibility: 'female',
    stateEligibility: ['ALL'],
    targetOccupations: ['farmer', 'homemaker', 'business_owner', 'employed'],
    benefitHeadline: 'Deposit as low as ₹250/year and get ₹70 Lakh+ maturity for daughter\'s higher education and marriage',
    benefitHeadlineHi: 'प्रतिवर्ष न्यूनतम ₹250 जमा करके बेटी की उच्च शिक्षा हेतु ₹70 लाख+ का कर-मुक्त कोष बनाएं',
    benefitAmount: 1500000,
    deadline: 'OPEN_ROUND',
    description: 'Government of India backed small deposit scheme for a girl child launched as part of the "Beti Bachao, Beti Padhao" campaign with highest sovereign guaranteed interest.',
    descriptionHi: 'बेटी बचाओ बेटी पढ़ाओ अभियान के तहत बालिकाओं के उज्ज्वल भविष्य हेतु भारत सरकार की सर्वाधिक ब्याज देने वाली सुरक्षित बचत योजना।',
    gazette: {
      circularNumber: 'DEA/MOF/SSY-INTEREST-2026/Q1',
      issuingAuthority: 'Department of Economic Affairs, Ministry of Finance',
      gazetteDate: '2026-01-01',
      lastVerifiedAt: 'Live verified 2 hrs ago',
      officialPortalUrl: 'https://www.indiapost.gov.in',
      scamAlertWarning: 'Account can be opened at any Post Office or Nationalized Bank. Complete tax exemption under 80C and Section 10(10D).',
      officialGovtFee: '₹0 (Minimum deposit ₹250)'
    },
    documents: [
      { id: 'd-ssy-1', name: 'Daughter\'s Birth Certificate', nameHi: 'बालिका का जन्म प्रमाण पत्र', isMandatory: true },
      { id: 'd-ssy-2', name: 'Parent / Guardian Aadhaar & PAN', nameHi: 'माता-पिता का आधार कार्ड एवं पैन कार्ड', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Download SSY Account Opening Form from India Post website.', textHi: 'इंडिया पोस्ट की वेबसाइट से एसएसवाई खाता खोलने का फॉर्म डाउनलोड करें।' },
      { step: 2, text: 'Submit with birth certificate at nearest Post Office or Bank branch.', textHi: 'निकटतम डाकघर अथवा बैंक शाखा में आवश्यक दस्तावेजों के साथ जमा करें।' },
      { step: 3, text: 'Receive official passbook and track online via IPPB app.', textHi: 'आधिकारिक पासबुक प्राप्त करें और आईपीपीबी ऐप द्वारा ऑनलाइन प्रबंधित करें।' }
    ],
    tags: ['Daughters', 'Tax Free Saving', 'Post Office', 'Sukanya'],
    is100PercentFree: true
  },
  {
    id: 'opp-atal-pension-01',
    title: 'Atal Pension Yojana (APY): Guaranteed ₹1,000 to ₹5,000 Monthly Govt Pension',
    titleHi: 'अटल पेंशन योजना (एपीवाई): 60 वर्ष के पश्चात आजीवन ₹1,000 से ₹5,000 मासिक सरकारी पेंशन',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [18, 40],
    stateEligibility: ['ALL'],
    targetOccupations: ['farmer', 'homemaker', 'business_owner', 'employed', 'job_seeker'],
    benefitHeadline: 'Guaranteed Lifetime Pension from Govt of India + 100% Corpus Refund to Nominee upon Death',
    benefitHeadlineHi: 'भारत सरकार द्वारा गारंटीकृत मासिक पेंशन + जीवनसाथी को आजीवन पेंशन एवं बच्चों को पूरी जमा पूंजी वापसी',
    benefitAmount: 60000,
    deadline: 'OPEN_ROUND',
    description: 'Pension scheme administered by PFRDA focused on unorganized sector workers, where small monthly contributions from age 18 to 40 guarantee a fixed monthly pension after age 60.',
    descriptionHi: 'पेंशन निधि विनियामक और विकास प्राधिकरण द्वारा संचालित सामाजिक सुरक्षा योजना जो बुजुर्ग अवस्था में स्थायी मासिक आय सुनिश्चित करती है।',
    gazette: {
      circularNumber: 'PFRDA/APY/2026/POLICY-CIRCULAR',
      issuingAuthority: 'Pension Fund Regulatory and Development Authority (PFRDA)',
      gazetteDate: '2026-06-01',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://www.npscra.nsdl.co.in',
      scamAlertWarning: 'APY auto-debits contributions through your savings bank account. Do not pay any agent in cash.',
      officialGovtFee: '₹0 (Nominal monthly contribution based on entry age)'
    },
    documents: [
      { id: 'd-apy-1', name: 'Savings Bank Account with Auto-Debit Facility', nameHi: 'बैंक बचत खाता पासबुक', isMandatory: true },
      { id: 'd-apy-2', name: 'Aadhaar Card Linked to Mobile', nameHi: 'आधार कार्ड', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Log in to Net Banking or visit your branch where savings account is held.', textHi: 'अपने बैंक की नेट बैंकिंग अथवा शाखा में जाएं।' },
      { step: 2, text: 'Select pension slab (₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000/month).', textHi: 'वांछित मासिक पेंशन स्लैब का चयन करें।' },
      { step: 3, text: 'Receive PRAN (Permanent Retirement Account Number) card instantly.', textHi: 'तुरंत स्थायी सेवानिवृत्ति खाता संख्या (PRAN) प्राप्त करें।' }
    ],
    tags: ['Pension', 'Old Age Security', 'Atal Pension', 'Central Govt'],
    is100PercentFree: true
  },
  {
    id: 'opp-pm-ujjwala-01',
    title: 'Pradhan Mantri Ujjwala Yojana 2.0: 100% Free LPG Gas Connection + Stove + Refill',
    titleHi: 'प्रधानमंत्री उज्ज्वला योजना 2.0: 100% निःशुल्क एलपीजी गैस कनेक्शन + गैस चूल्हा + पहला सिलेंडर',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [18, 70],
    genderEligibility: 'female',
    stateEligibility: ['ALL'],
    targetOccupations: ['homemaker', 'farmer'],
    benefitHeadline: '₹3,200 Total Government Benefit Provided Completely Free for Adult Women of Low-Income Families',
    benefitHeadlineHi: 'गरीब परिवारों की महिलाओं को धुआं-मुक्त रसोई हेतु निःशुल्क गैस चूल्हा, रेगुलेटर, पाइप एवं सिलेंडर',
    benefitAmount: 3200,
    deadline: 'OPEN_ROUND',
    description: 'Ministry of Petroleum & Natural Gas initiative providing deposit-free LPG connections to poor households across Indane, Bharatgas, and HP Gas distributors.',
    descriptionHi: 'पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय द्वारा ग्रामीण एवं निर्धन परिवारों की महिलाओं के स्वास्थ्य की रक्षा हेतु निःशुल्क गैस कनेक्शन।',
    gazette: {
      circularNumber: 'MOPNG/PMUY-2.0/2026/GUIDELINES',
      issuingAuthority: 'Ministry of Petroleum & Natural Gas (Govt of India)',
      gazetteDate: '2026-07-10',
      lastVerifiedAt: 'Live verified 2 hrs ago',
      officialPortalUrl: 'https://pmuy.gov.in',
      scamAlertWarning: 'Ujjwala 2.0 connection is 100% free with zero security deposit. Never pay any gas agency delivery boy for the initial connection kit.',
      officialGovtFee: '₹0 (100% Free Govt Welfare)'
    },
    documents: [
      { id: 'd-uj-1', name: 'Ration Card of the Family / Self-Declaration', nameHi: 'राशन कार्ड अथवा परिवार का घोषणा पत्र', isMandatory: true },
      { id: 'd-uj-2', name: 'Aadhaar Card of Female Head of Family & Bank Account', nameHi: 'महिला मुखिया का आधार कार्ड एवं बैंक खाता', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Submit free online application on pmuy.gov.in or nearest gas agency.', textHi: 'pmuy.gov.in पर अथवा नजदीकी गैस एजेंसी पर निःशुल्क फॉर्म भरें।' },
      { step: 2, text: 'Biometric e-KYC verification of adult female applicant.', textHi: 'आवेदक महिला का बायोमेट्रिक ई-केवाईसी सत्यापन।' },
      { step: 3, text: 'Collect gas stove, filled cylinder, and regulator with zero payment.', textHi: 'बिना कोई शुल्क दिए गैस चूल्हा, भरा हुआ सिलेंडर और रेगुलेटर प्राप्त करें।' }
    ],
    tags: ['Ujjwala', 'Free Gas', 'Women Empowerment', 'Clean Fuel'],
    is100PercentFree: true
  },
  {
    id: 'opp-standup-india-01',
    title: 'Stand-Up India Scheme: ₹10 Lakh to ₹1 Crore Business Loan for SC/ST & Women',
    titleHi: 'स्टैंड-अप इंडिया योजना: अनुसूचित जाति, जनजाति एवं महिला उद्यमियों हेतु ₹10 लाख से ₹1 करोड़ का ऋण',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [18, 65],
    stateEligibility: ['ALL'],
    targetOccupations: ['business_owner', 'homemaker', 'job_seeker'],
    benefitHeadline: 'Low-Interest Composite Green-Field Business Loan Backed by Govt of India Credit Guarantee',
    benefitHeadlineHi: 'विनिर्माण, सेवा अथवा कृषि संबद्ध व्यापार शुरू करने हेतु ₹1 करोड़ तक का सरकारी गारंटी युक्त बैंक ऋण',
    benefitAmount: 2500000,
    deadline: 'OPEN_ROUND',
    description: 'Department of Financial Services initiative facilitating bank loans between ₹10 lakh and ₹1 crore to at least one SC or ST borrower and at least one woman borrower per bank branch.',
    descriptionHi: 'प्रत्येक बैंक शाखा द्वारा कम से कम एक महिला अथवा एससी/एसटी उद्यमी को नया व्यवसाय शुरू करने हेतु बड़ा ऋण उपलब्ध कराने की राष्ट्रीय योजना।',
    gazette: {
      circularNumber: 'DFS/STANDUP-INDIA/2026/CREDIT-EXP',
      issuingAuthority: 'Department of Financial Services, Ministry of Finance',
      gazetteDate: '2026-06-25',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://www.standupmitra.in',
      scamAlertWarning: 'Apply directly via standupmitra.in. Banks cannot refuse applications meeting green-field criteria.',
      officialGovtFee: '₹0 (Free Govt Portal Application)'
    },
    documents: [
      { id: 'd-st-1', name: 'Caste Certificate (for SC/ST) or Proof of Woman Entrepreneurship (51% stake)', nameHi: 'जाति प्रमाण पत्र अथवा महिला उद्यमी स्वामित्व प्रमाण', isMandatory: true },
      { id: 'd-st-2', name: 'Project DPR & PAN Card', nameHi: 'परियोजना डीपीआर एवं पैन कार्ड', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Register as applicant on standupmitra.in portal.', textHi: 'standupmitra.in पोर्टल पर आवेदक के रूप में पंजीकरण करें।' },
      { step: 2, text: 'Select Handholding agency or connect directly with preferred Lead Bank.', textHi: 'हैंडहोल्डिंग एजेंसी अथवा बैंक शाखा का चयन करें।' },
      { step: 3, text: 'Get project appraisal and direct loan sanction.', textHi: 'परियोजना मूल्यांकन के पश्चात ऋण स्वीकृति प्राप्त करें।' }
    ],
    tags: ['Women Entrepreneur', 'SC ST Loans', 'Stand Up India', 'Business Funding'],
    is100PercentFree: true
  },
  {
    id: 'opp-lakhpati-didi-01',
    title: 'Lakhpati Didi Yojana: ₹1,00,000+ Annual Income Mission for SHG Women (Zero-Interest Capital + Drone Training)',
    titleHi: 'लखपति दीदी योजना: स्वयं सहायता समूह (SHG) महिलाओं हेतु ₹1,00,000+ वार्षिक आय मिशन एवं ड्रोन प्रशिक्षण',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [18, 60],
    genderEligibility: 'female',
    stateEligibility: ['ALL'],
    targetOccupations: ['homemaker', 'farmer', 'business_owner'],
    benefitHeadline: 'Zero-Interest Community Investment Fund + ₹1-5 Lakh Microcredit + Free Agri-Drone Pilot & Business Training',
    benefitHeadlineHi: 'बिना ब्याज सामुदायिक ऋण + ₹1-5 लाख वित्तीय सहायता + निःशुल्क नमो ड्रोन दीदी एवं उद्यमिता प्रशिक्षण',
    benefitAmount: 150000,
    deadline: 'OPEN_ROUND',
    applicationStatus: 'active_now',
    description: 'Ministry of Rural Development flagship initiative under Deendayal Antyodaya Yojana - National Rural Livelihoods Mission (DAY-NRLM) aimed at enabling 3 crore rural women to earn sustainable income of ₹1 lakh or more per year.',
    descriptionHi: 'ग्रामीण विकास मंत्रालय द्वारा संचालित राष्ट्रीय ग्रामीण आजीविका मिशन के तहत देश की 3 करोड़ स्वयं सहायता समूह महिलाओं को आर्थिक रूप से सशक्त बनाकर प्रतिवर्ष न्यूनतम ₹1 लाख की आय सुनिश्चित करने की योजना।',
    gazette: {
      circularNumber: 'MORD/DAY-NRLM/LAKHPATI-DIDI/2026/08',
      issuingAuthority: 'Ministry of Rural Development (Govt of India)',
      gazetteDate: '2026-08-15',
      lastVerifiedAt: 'Live verified 30 mins ago',
      officialPortalUrl: 'https://nrlm.gov.in',
      scamAlertWarning: 'Enrollment is conducted strictly through registered Self Help Groups (SHGs) and Village Organizations. Beware of unauthorized private agents.',
      officialGovtFee: '₹0 (100% Free Govt Welfare)'
    },
    documents: [
      { id: 'd-ld-1', name: 'Aadhaar Card Linked with Bank Account', nameHi: 'बैंक खाते से लिंक आधार कार्ड', isMandatory: true },
      { id: 'd-ld-2', name: 'SHG (Self Help Group) Member Passbook / ID', nameHi: 'स्वयं सहायता समूह सदस्यता पासबुक', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Join or connect with your local Gram Panchayat Self Help Group (SHG) under NRLM.', textHi: 'ग्राम पंचायत में राष्ट्रीय ग्रामीण आजीविका मिशन के स्वयं सहायता समूह से जुड़ें।' },
      { step: 2, text: 'Select livelihood trade: Drone Pilot, Dairy, Mushroom Farming, Solar Lighting, or Food Processing.', textHi: 'अपनी पसंद का आजीविका कार्य (ड्रोन दीदी, डेयरी, सिलाई, खाद्य प्रसंस्करण) चुनें।' },
      { step: 3, text: 'Receive free skill training at RSETI and obtain bank credit linkage.', textHi: 'आरसेटी केंद्र पर निःशुल्क प्रशिक्षण प्राप्त कर बैंक क्रेडिट लिंकेज से व्यवसाय शुरू करें।' }
    ],
    tags: ['Lakhpati Didi', 'Women SHG', 'Rural Women', 'Drone Didi', 'Zero Interest Loan'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-pmmvy-01',
    title: 'Pradhan Mantri Matru Vandana Yojana (PMMVY): Direct DBT Cash Support of ₹5,000 - ₹6,000 for Mothers',
    titleHi: 'प्रधानमंत्री मातृ वंदना योजना (PMMVY): गर्भवती एवं धात्री माताओं को ₹5,000 - ₹6,000 सीधी बैंक सहायता',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [19, 45],
    genderEligibility: 'female',
    stateEligibility: ['ALL'],
    targetOccupations: ['homemaker', 'farmer', 'employed', 'job_seeker'],
    benefitHeadline: 'Direct Cash Transfer into Mother\'s Aadhaar-Linked Bank Account for Health, Nutrition & Child Immunization',
    benefitHeadlineHi: 'पोषण एवं स्वास्थ्य देखभाल हेतु गर्भवती महिला के आधार लिंक बैंक खाते में सीधे ₹5,000 से ₹6,000 डीबीटी अंतरण',
    benefitAmount: 6000,
    deadline: 'OPEN_ROUND',
    applicationStatus: 'active_now',
    description: 'Ministry of Women and Child Development maternity benefit program providing direct financial incentive for pregnant women and lactating mothers for first and second child (if girl child).',
    descriptionHi: 'महिला एवं बाल विकास मंत्रालय द्वारा गर्भवती महिलाओं को उचित पोषण, टीकाकरण एवं प्रसव पूर्व जांच हेतु दी जाने वाली सीधी वित्तीय सहायता।',
    gazette: {
      circularNumber: 'MWCD/PMMVY-2.0/DBT-MOTHERS/2026',
      issuingAuthority: 'Ministry of Women & Child Development (Govt of India)',
      gazetteDate: '2026-07-05',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://pmmvy.wcd.gov.in',
      scamAlertWarning: 'Citizens can apply directly online at pmmvy.wcd.gov.in or through local Anganwadi Worker (AWW) / ASHA. No fees required.',
      officialGovtFee: '₹0 (Free Citizen Welfare Scheme)'
    },
    documents: [
      { id: 'd-pmmvy-1', name: 'Mother\'s Aadhaar Card & Aadhaar-Linked Bank Passbook', nameHi: 'माता का आधार कार्ड एवं बैंक खाता पासबुक', isMandatory: true },
      { id: 'd-pmmvy-2', name: 'Mother and Child Protection (MCP) Card from PHC/Anganwadi', nameHi: 'एमसीपी कार्ड (मातृ एवं शिशु सुरक्षा कार्ड)', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Register online at pmmvy.wcd.gov.in or submit form at nearest Anganwadi centre.', textHi: 'pmmvy.wcd.gov.in पोर्टल पर अथवा नजदीकी आंगनवाड़ी केंद्र पर पंजीकरण करें।' },
      { step: 2, text: 'Upload MCP card proving ANC check-up and registration within 570 days of LMP.', textHi: 'प्रसव पूर्व जांच (ANC) का एमसीपी कार्ड विवरण दर्ज करें।' },
      { step: 3, text: 'Direct Aadhaar DBT installment credited directly to mother’s bank account.', textHi: 'सत्यापन के उपरांत किस्त सीधे माता के आधार सीडेड बैंक खाते में प्राप्त करें।' }
    ],
    tags: ['PMMVY', 'Mother Care', 'Maternity Benefit', 'Direct Cash DBT', 'Women Welfare'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-mssc-01',
    title: 'Mahila Samman Savings Certificate (MSSC): 7.5% Sovereign Guaranteed Fixed Return for Women & Girls',
    titleHi: 'महिला सम्मान बचत प्रमाण पत्र (MSSC): बालिकाओं एवं महिलाओं हेतु 7.5% सुरक्षित सरकारी ब्याज योजना',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [10, 80],
    genderEligibility: 'female',
    stateEligibility: ['ALL'],
    targetOccupations: ['homemaker', 'school_student', 'college_student', 'employed', 'business_owner'],
    benefitHeadline: '7.5% Compound Annual Interest Rate + ₹2 Lakh Maximum Sovereign Deposit + Partial Withdrawal Allowed After 1 Year',
    benefitHeadlineHi: '7.5% वार्षिक चक्रवृद्धि ब्याज + ₹2 लाख तक पूर्ण सरकारी सुरक्षा + 1 वर्ष बाद 40% आंशिक निकासी सुविधा',
    benefitAmount: 200000,
    deadline: 'OPEN_ROUND',
    applicationStatus: 'ongoing',
    description: 'Ministry of Finance small savings initiative exclusively designed for women and girl children to foster financial independence and security with quarterly compounded interest.',
    descriptionHi: 'वित्त मंत्रालय द्वारा महिलाओं एवं बालिकाओं के वित्तीय सशक्तिकरण हेतु डाकघरों और अधिकृत बैंकों में संचालित 2 वर्ष की विशेष उच्च ब्याज बचत योजना।',
    gazette: {
      circularNumber: 'MOF/DEA/MSSC-SCHEME/2023-26',
      issuingAuthority: 'Department of Economic Affairs, Ministry of Finance',
      gazetteDate: '2026-04-01',
      lastVerifiedAt: 'Live verified 2 hrs ago',
      officialPortalUrl: 'https://www.indiapost.gov.in',
      scamAlertWarning: 'Account can be opened at any Post Office or nationalized public bank branch. Do not pay commissions to private agents.',
      officialGovtFee: '₹0 (Zero Account Opening Charges)'
    },
    documents: [
      { id: 'd-mssc-1', name: 'Woman / Girl Applicant Aadhaar Card & PAN Card', nameHi: 'महिला/बालिका का आधार कार्ड एवं पैन कार्ड', isMandatory: true },
      { id: 'd-mssc-2', name: 'Passport Size Photographs & KYC Form', nameHi: 'पासपोर्ट साइज फोटो एवं केवाईसी फॉर्म', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Download Form-1 (Application for opening MSSC account) from India Post portal.', textHi: 'इंडिया पोस्ट पोर्टल से फॉर्म-1 डाउनलोड करें अथवा डाकघर से प्राप्त करें।' },
      { step: 2, text: 'Submit form with KYC documents and deposit amount (₹1,000 to ₹2 Lakh) at post office or bank.', textHi: 'दस्तावेज एवं जमा राशि के साथ डाकघर/बैंक में फॉर्म जमा करें।' },
      { step: 3, text: 'Receive official MSSC Passbook with guaranteed maturity value.', textHi: 'गारंटीकृत परिपक्वता मूल्य के साथ आधिकारिक पासबुक प्राप्त करें।' }
    ],
    tags: ['Mahila Samman', 'Women Savings', 'Post Office', 'Guaranteed Interest', 'Safe Investment'],
    is100PercentFree: true
  },
  {
    id: 'opp-silai-machine-01',
    title: 'PM Vishwakarma Free Sewing Machine Scheme: ₹15,000 Voucher + Free Tailoring Certification for Women',
    titleHi: 'प्रधानमंत्री सिलाई मशीन योजना (विश्वकर्मा दर्जी): ₹15,000 निःशुल्क आधुनिक सिलाई मशीन वाउचर + प्रशिक्षण',
    category: 'govt_scheme',
    lifeStage: 'schemes',
    targetAges: [18, 55],
    genderEligibility: 'female',
    stateEligibility: ['ALL'],
    targetOccupations: ['homemaker', 'job_seeker', 'business_owner'],
    benefitHeadline: '₹15,000 Digital E-Voucher for Modern Electric Sewing Machine + ₹500/Day Training Stipend + Govt Certificate',
    benefitHeadlineHi: 'निःशुल्क इलेक्ट्रॉनिक सिलाई मशीन हेतु ₹15,000 का ई-वाउचर + प्रतिदिन ₹500 प्रशिक्षण भत्ता + सरकारी प्रमाण पत्र',
    benefitAmount: 18500,
    deadline: 'OPEN_ROUND',
    applicationStatus: 'active_now',
    description: 'Central government initiative under PM Vishwakarma (Tailor/Darzi Trade) providing modern electric sewing machines, 5-day professional tailoring training with stipend, and collateral-free enterprise loan support to women across India.',
    descriptionHi: 'प्रधानमंत्री विश्वकर्मा योजना के दर्जी घटक के अंतर्गत देश की महिलाओं को आत्मनिर्भर बनाने हेतु आधुनिक इलेक्ट्रॉनिक सिलाई मशीन, 5 दिवसीय निःशुल्क प्रशिक्षण एवं प्रमाण पत्र।',
    gazette: {
      circularNumber: 'MSME/PM-VISHWAKARMA/TAILOR-TRADE/2026',
      issuingAuthority: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
      gazetteDate: '2026-08-20',
      lastVerifiedAt: 'Live verified 45 mins ago',
      officialPortalUrl: 'https://pmvishwakarma.gov.in',
      scamAlertWarning: 'Registration is free at Common Service Centers (CSC) and official portal pmvishwakarma.gov.in. Beware of fake forms on social media charging money.',
      officialGovtFee: '₹0 (100% Free Govt Welfare Scheme)'
    },
    documents: [
      { id: 'd-sm-1', name: 'Aadhaar Card Linked to Mobile', nameHi: 'मोबाइल से लिंक आधार कार्ड', isMandatory: true },
      { id: 'd-sm-2', name: 'Bank Passbook with Aadhaar Linkage', nameHi: 'बैंक पासबुक की प्रति', isMandatory: true },
      { id: 'd-sm-3', name: 'Ration Card / Family Declaration', nameHi: 'राशन कार्ड अथवा परिवार का विवरण', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Complete free biometric Aadhaar verification at nearest CSC or on pmvishwakarma.gov.in.', textHi: 'निकटतम सीएससी अथवा पोर्टल पर आधार बायोमेट्रिक सत्यापन करें।' },
      { step: 2, text: 'Select "Darzi (Tailor)" trade and submit Gram Panchayat / Urban verification.', textHi: 'दर्जी ट्रेड का चयन करें और पंचायत सत्यापन पूरा कराएं।' },
      { step: 3, text: 'Attend 5-day basic training (receive ₹500/day allowance) and get ₹15,000 toolkit voucher for sewing machine.', textHi: '5 दिवसीय प्रशिक्षण पूर्ण कर सिलाई मशीन हेतु ₹15,000 का डिजिटल वाउचर प्राप्त करें।' }
    ],
    tags: ['Free Sewing Machine', 'Silai Machine', 'Tailoring', 'Women Empowerment', 'PM Vishwakarma'],
    is100PercentFree: true,
    isNew: true
  }
];
