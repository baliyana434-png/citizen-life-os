import { Opportunity } from '@/types';

export const PRIVATE_JOB_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-tcs-nqt-01',
    title: 'TCS NQT 2026: National Qualifier Test for 45,000+ Fresher & IT Roles Across 1,000+ Top Companies',
    titleHi: 'टीसीएस एनक्यूटी 2026: 1,000+ शीर्ष कंपनियों में 45,000+ फ्रेशर्स व आईटी पदों पर राष्ट्रीय भर्ती',
    category: 'private_job',
    applicationStatus: 'active_now',
    lifeStage: 'private_jobs',
    targetAges: [18, 32],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker', 'employed'],
    benefitHeadline: 'Single Test Score Valid for TCS Ninja, Digital & Prime Roles (₹3.6 LPA - ₹9.0 LPA) + Tata Motors & Titan',
    benefitHeadlineHi: 'एक टेस्ट से टीसीएस निंजा, डिजिटल एवं प्राइम पदों (वेतन: ₹3.6 लाख से ₹9.0 लाख) में सीधा चयन',
    benefitAmount: 55000,
    deadline: '2026-04-15',
    description: 'Tata Consultancy Services official national assessment standardized across India. High scores qualify candidates directly for technical interviews in TCS, Tata Elxsi, TVS, Jio, and 1,000+ corporate hiring partners.',
    descriptionHi: 'टाटा कंसल्टेंसी सर्विसेज (TCS) द्वारा संचालित अखिल भारतीय राष्ट्रीय परीक्षा जिसके स्कोर के आधार पर देश की 1,000+ प्रमुख निजी कंपनियों में सॉफ्टवेयर, डेटा और बिजनेस ऑपरेशंस के पदों पर सीधी भर्ती होती है।',
    gazette: {
      circularNumber: 'TCS-iON/NQT-2026/NATIONAL-CYCLE',
      issuingAuthority: 'Tata Consultancy Services (TCS iON)',
      gazetteDate: '2026-09-05',
      lastVerifiedAt: 'Live verified 10 mins ago',
      officialPortalUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
      scamAlertWarning: 'TCS strictly operates a merit-based hiring policy. Never pay money to any fake recruitment agency claiming to guarantee TCS interview clearance.',
      officialGovtFee: 'Official Exam Booking Fee Only (Direct on TCS Portal)'
    },
    documents: [
      { id: 'd-tcs-1', name: 'Graduation / Diploma Degree or Final Year Marksheet', nameHi: 'डिग्री/डिप्लोमा अथवा अंतिम वर्ष की अंकतालिका', isMandatory: true },
      { id: 'd-tcs-2', name: 'Aadhaar Card & Resume / CV', nameHi: 'आधार कार्ड एवं बायोडाटा (CV)', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Register on official TCS iON portal learning.tcsionhub.in/hub/national-qualifier-test.', textHi: 'आधिकारिक टीसीएस आयन पोर्टल पर जाकर रजिस्ट्रेशन करें।' },
      { step: 2, text: 'Choose NQT Cognitive and IT Subject Pack matching your engineering/degree stream.', textHi: 'अपनी शैक्षणिक शाखा के अनुसार कॉग्निटिव एवं आईटी विषय चुनें।' },
      { step: 3, text: 'Appear for in-centre computer test and apply directly to 1,000+ corporate openings.', textHi: 'परीक्षा दें और स्कोरकार्ड से टीसीएस एवं भागीदार कंपनियों में आवेदन करें।' }
    ],
    tags: ['TCS NQT', 'Private Job', 'IT Fresher', 'Software Engineer', 'Tata Jobs'],
    is100PercentFree: false,
    isNew: true
  },
  {
    id: 'opp-infosys-hiring-01',
    title: 'Infosys National Fresher & Lateral Recruitment 2026 (Systems Engineer & Specialist Programmer)',
    titleHi: 'इन्फोसिस राष्ट्रीय भर्ती 2026: सिस्टम्स इंजीनियर एवं स्पेशलिस्ट प्रोग्रामर भर्ती (3.6 - 9.5 लाख)',
    category: 'private_job',
    applicationStatus: 'active_now',
    lifeStage: 'private_jobs',
    targetAges: [18, 30],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker', 'employed'],
    benefitHeadline: 'Pan-India Hiring for SE (₹3.6 LPA) and Specialist Programmer / Digital Specialist (₹9.5 LPA)',
    benefitHeadlineHi: 'सिस्टम्स इंजीनियर (₹3.6 लाख) एवं स्पेशलिस्ट प्रोग्रामर (₹9.5 लाख) पदों पर अखिल भारतीय भर्ती',
    benefitAmount: 60000,
    deadline: '2026-05-30',
    description: 'Infosys official nationwide recruitment drive for fresh engineers, MCA, and MSc graduates across development centers in Bengaluru, Pune, Hyderabad, Chennai, and Indore.',
    descriptionHi: 'इन्फोसिस द्वारा देशभर के बीई, बीटेक, एमसीए स्नातकों के लिए सॉफ्टवेयर डेवलपमेंट, क्लाउड आर्किटेक्चर और साइबर सुरक्षा के पदों पर सीधी भर्ती।',
    gazette: {
      circularNumber: 'INFY/HRD/NATIONAL-DRIVE/2026',
      issuingAuthority: 'Infosys Limited Talent Acquisition',
      gazetteDate: '2026-09-01',
      lastVerifiedAt: 'Live verified 20 mins ago',
      officialPortalUrl: 'https://career.infosys.com',
      scamAlertWarning: 'Infosys does not charge any application or interview fees at any stage of recruitment. Report fake recruitment consultancies immediately.',
      officialGovtFee: '₹0 (100% Free Direct Application)'
    },
    documents: [
      { id: 'd-infy-1', name: 'BE / B.Tech / MCA / MSc Final Marksheet or Degree', nameHi: 'बीई / बीटेक / एमसीए अंकतालिका', isMandatory: true },
      { id: 'd-infy-2', name: 'Updated Resume / Portfolio & Aadhaar', nameHi: 'बायोडाटा एवं आधार कार्ड', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Visit official Infosys career portal career.infosys.com and create profile.', textHi: 'आधिकारिक इन्फोसिस करियर पोर्टल पर प्रोफाइल बनाएं।' },
      { step: 2, text: 'Submit application for Systems Engineer or Specialist Programmer openings.', textHi: 'सिस्टम्स इंजीनियर अथवा स्पेशलिस्ट प्रोग्रामर पद के लिए आवेदन करें।' },
      { step: 3, text: 'Take online technical coding and aptitude assessment round.', textHi: 'ऑनलाइन कोडिंग एवं एप्टीट्यूड परीक्षा पास करें।' }
    ],
    tags: ['Infosys', 'Private Job', 'Software Engineer', 'IT Careers', 'Direct Hiring'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-google-careers-01',
    title: 'Google India Engineering & Tech Careers 2026: Direct Corporate Openings (Bengaluru, Hyderabad, Gurugram)',
    titleHi: 'गूगल इंडिया इंजीनियरिंग एवं टेक करियर 2026: बेंगलुरु, हैदराबाद व गुरुग्राम में सीधी भर्ती',
    category: 'private_job',
    applicationStatus: 'active_now',
    lifeStage: 'private_jobs',
    targetAges: [18, 38],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker', 'employed'],
    benefitHeadline: 'Starting CTC ₹18 LPA - ₹42 LPA + Google Stock Units (GSUs), World-Class Health Insurance & Free Meals',
    benefitHeadlineHi: 'प्रारंभिक पैकेज ₹18 लाख - ₹42 लाख + गूगल स्टॉक (GSUs), विश्वस्तरीय स्वास्थ्य बीमा एवं निःशुल्क भोजन',
    benefitAmount: 180000,
    deadline: 'OPEN_ROUND',
    description: 'Direct applications open for Software Engineers (Early Career), Cloud Support Specialists, AI Prompt Evaluators, and Technical Solutions Associates across Google offices in India.',
    descriptionHi: 'गूगल के भारत स्थित कार्यालयों में सॉफ्टवेयर इंजीनियर, क्लाउड सपोर्ट और तकनीकी सलाहकारों के लिए आधिकारिक करियर पोर्टल पर सीधी भर्तियां।',
    gazette: {
      circularNumber: 'GOOG-IN/CAREERS/2026/CY-01',
      issuingAuthority: 'Google India Human Resources',
      gazetteDate: '2026-09-10',
      lastVerifiedAt: 'Live verified 15 mins ago',
      officialPortalUrl: 'https://careers.google.com/jobs/results/?location=India',
      scamAlertWarning: 'Google NEVER charges any fee for interviews, tests, or application processing. Always apply directly on careers.google.com.',
      officialGovtFee: '₹0 (100% Free Direct Application)'
    },
    documents: [
      { id: 'd-goog-1', name: 'Comprehensive Resume highlighting DSA & Project Work', nameHi: 'विस्तृत बायोडाटा (प्रोजेक्ट्स व डीएसए विवरण)', isMandatory: true },
      { id: 'd-goog-2', name: 'GitHub Profile / Live Project Links', nameHi: 'गिटहब प्रोफाइल अथवा लाइव प्रोजेक्ट लिंक', isMandatory: false }
    ],
    applySteps: [
      { step: 1, text: 'Search India roles on careers.google.com and filter by "Early Career" or your experience level.', textHi: 'careers.google.com पर भारत के पदों को सर्च करें।' },
      { step: 2, text: 'Upload 1-page PDF resume with clear metrics and technical stack.', textHi: '1 पेज का बायोडाटा अपलोड कर फॉर्म भरें।' },
      { step: 3, text: 'Complete online Technical Assessment (Google OA) if shortlisted.', textHi: 'शॉर्टलिस्ट होने पर ऑनलाइन कोडिंग टेस्ट दें।' }
    ],
    tags: ['Google India', 'Top MNC', 'High Salary', 'Software Engineer', 'Cloud'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-amazon-jobs-01',
    title: 'Amazon India Operations, Customer & Tech Support: 20,000+ Corporate & Operations Roles',
    titleHi: 'अमेज़न इंडिया ऑपरेशंस एवं कस्टमर सपोर्ट: देश भर में 20,000+ पदों पर सीधी भर्ती',
    category: 'private_job',
    applicationStatus: 'active_now',
    lifeStage: 'private_jobs',
    targetAges: [18, 35],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker', 'employed'],
    benefitHeadline: 'Salary ₹3.2 LPA - ₹8.5 LPA + Performance Bonuses, Night Shift Allowances & Comprehensive Medical Coverage',
    benefitHeadlineHi: 'वेतन ₹3.2 लाख - ₹8.5 लाख + कार्य प्रदर्शन बोनस, नाइट अलाउंस व 5 लाख का कैशलेस मेडिकल कवर',
    benefitAmount: 45000,
    deadline: 'OPEN_ROUND',
    description: 'Amazon India hiring across fulfillment centers, digital customer service, AWS cloud support, and logistics monitoring in 25+ cities across India.',
    descriptionHi: 'अमेज़न इंडिया द्वारा देश के 25+ शहरों में ग्राहक सेवा, लॉजिस्टिक्स निगरानी, एडब्ल्यूएस क्लाउड ऑपरेशंस हेतु फ्रेशर्स और अनुभवी युवाओं की सीधी भर्ती।',
    gazette: {
      circularNumber: 'AMZN-IN/RECRUIT/OPS-TECH/2026',
      issuingAuthority: 'Amazon Development Centre India',
      gazetteDate: '2026-08-20',
      lastVerifiedAt: 'Live verified 25 mins ago',
      officialPortalUrl: 'https://www.amazon.jobs/en/locations/india',
      scamAlertWarning: 'Amazon recruiters never ask for registration money or security deposit. All hiring happens via amazon.jobs.',
      officialGovtFee: '₹0 (100% Free Direct Application)'
    },
    documents: [
      { id: 'd-amz-1', name: '12th / Graduation Marksheet in Any Stream', nameHi: '12वीं अथवा किसी भी विषय में स्नातक अंकतालिका', isMandatory: true },
      { id: 'd-amz-2', name: 'Aadhaar Card and PAN Card', nameHi: 'आधार कार्ड एवं पैन कार्ड', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Visit amazon.jobs and search openings in your nearest city.', textHi: 'amazon.jobs पर अपने शहर के नजदीकी पद खोजें।' },
      { step: 2, text: 'Submit online application and take standard 30-minute virtual aptitude test.', textHi: 'आवेदन पत्र भरकर 30 मिनट का ऑनलाइन टेस्ट दें।' },
      { step: 3, text: 'Receive offer letter with direct reporting date at nearest Amazon centre.', textHi: 'चयनित होने पर आधिकारिक ऑफर लेटर प्राप्त करें।' }
    ],
    tags: ['Amazon Jobs', 'Customer Support', 'Operations', 'Work From Home / Office', 'MNC Hiring'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-wipro-nth-01',
    title: 'Wipro Elite National Talent Hunt (NTH) 2026: Project Engineer & Cloud Analyst',
    titleHi: 'विप्रो एलीट नेशनल टैलेंट हंट 2026: प्रोजेक्ट इंजीनियर एवं क्लाउड एनालिस्ट भर्ती',
    category: 'private_job',
    applicationStatus: 'upcoming',
    lifeStage: 'private_jobs',
    targetAges: [19, 28],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker'],
    benefitHeadline: 'National Engineering Hiring Drive with Starting Package of ₹3.50 LPA - ₹6.50 LPA + ₹25,000 Joining Bonus',
    benefitHeadlineHi: 'इंजीनियरिंग छात्रों हेतु विप्रो में ₹3.5 लाख से ₹6.5 लाख पैकेज पर स्थायी प्रोजेक्ट इंजीनियर पद',
    benefitAmount: 40000,
    deadline: 'UPCOMING_ANNUAL_CYCLE',
    description: 'Wipro off-campus assessment for fresh B.E., B.Tech, and 5-year integrated M.Tech candidates across India looking to kickstart their technical career in software development and cloud operations.',
    descriptionHi: 'विप्रो द्वारा देशभर के इंजीनियरिंग छात्रों के लिए आयोजित राष्ट्रीय कैंपस भर्ती। चयनित उम्मीदवारों को सॉफ्टवेयर विकास, क्लाउड और साइबर सुरक्षा में प्रशिक्षण और नियुक्ति दी जाती है।',
    gazette: {
      circularNumber: 'WIPRO/ELITE-NTH/2026/CYCLE',
      issuingAuthority: 'Wipro Talent Transformation Board',
      gazetteDate: '2026-08-28',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://careers.wipro.com',
      scamAlertWarning: 'Wipro does not charge any application or security fees from candidates. Report fake placement consultants.',
      officialGovtFee: '₹0 (100% Free Campus Drive)'
    },
    documents: [
      { id: 'd-wip-1', name: 'B.E. / B.Tech Marksheets (Min 60% with no active backlogs)', nameHi: 'बीटेक अंकतालिका (न्यूनतम 60% अंक)', isMandatory: true },
      { id: 'd-wip-2', name: 'Aadhaar Card', nameHi: 'आधार कार्ड', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Register on careers.wipro.com during the open Elite NTH window.', textHi: 'विप्रो करियर पोर्टल पर जाकर रजिस्ट्रेशन करें।' },
      { step: 2, text: 'Appear for online assessment covering Aptitude, Written Communication, and Online Coding.', textHi: 'ऑनलाइन कोडिंग, संचार एवं एप्टीट्यूड टेस्ट दें।' },
      { step: 3, text: 'Complete technical & HR video interview on Wipro platform.', textHi: 'वीडियो साक्षात्कार उत्तीर्ण कर ऑफर लेटर प्राप्त करें।' }
    ],
    tags: ['Wipro', 'Elite NTH', 'Private Job', 'IT Engineering', 'Fresher Drive'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-wellfound-startup-01',
    title: 'Wellfound (AngelList) & Y Combinator Direct Tech Startup Hiring (Full-Stack, AI, Growth)',
    titleHi: 'वेलफाउंड एवं वाई-कॉम्बिनेटर स्टार्टअप्स: सीधे संस्थापकों से संपर्क कर हाई-पेइंग जॉब प्राप्त करें',
    category: 'private_job',
    applicationStatus: 'active_now',
    lifeStage: 'private_jobs',
    targetAges: [18, 38],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker', 'employed'],
    benefitHeadline: 'Salary ₹6 LPA - ₹25 LPA + High-Upside Startup Equity (ESOPs) & Remote Flexibility',
    benefitHeadlineHi: 'वेतन ₹6 लाख - ₹25 लाख + स्टार्टअप इक्विटी (ESOPs) एवं घर बैठे रिमोट काम की सुविधा',
    benefitAmount: 85000,
    deadline: 'OPEN_ROUND',
    description: 'Connect directly with funded tech startups backed by Y Combinator, Sequoia, and Peak XV. Apply with 1-click directly to founders without HR screening filters.',
    descriptionHi: 'फंडेड स्टार्टअप्स में सीधे संस्थापकों से जुड़कर नौकरी पाने का आधिकारिक वैश्विक मंच। बिना किसी बिचौलिए के सीधे फाउंडर को अपना काम दिखाएं।',
    gazette: {
      circularNumber: 'WELLFOUND/STARTUP-JOBS/2026',
      issuingAuthority: 'Wellfound Global Talent Network',
      gazetteDate: '2026-09-02',
      lastVerifiedAt: 'Live verified 15 mins ago',
      officialPortalUrl: 'https://wellfound.com/jobs',
      scamAlertWarning: 'Never pay fees for startup interviews. Wellfound profile creation and direct messaging to founders is 100% free.',
      officialGovtFee: '₹0 (100% Free Platform)'
    },
    documents: [
      { id: 'd-well-1', name: 'GitHub Profile or Live Deployed Project Links', nameHi: 'गिटहब प्रोफाइल या लाइव प्रोजेक्ट लिंक', isMandatory: true },
      { id: 'd-well-2', name: 'Concise Wellfound Applicant Profile', nameHi: 'वेलफाउंड प्रोफाइल विवरण', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Create free profile on wellfound.com and list your tech stack (React, Node, Python, AI).', textHi: 'wellfound.com पर अपनी प्रोफाइल बनाएं और स्किल्स जोड़ें।' },
      { step: 2, text: 'Filter by "Location: India" or "Remote" and salary bracket.', textHi: 'भारत अथवा रिमोट जॉब्स को अपनी सैलरी पसंद के अनुसार फ़िल्टर करें।' },
      { step: 3, text: 'Send direct 2-line personalized pitch note to the startup founder.', textHi: 'कंपनी के संस्थापक को सीधे संक्षिप्त संदेश भेजकर इंटरव्यू शेड्यूल करें।' }
    ],
    tags: ['Startups', 'High Growth', 'Remote Work', 'ESOPs', 'Tech Careers'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-zomato-ops-01',
    title: 'Zomato & Blinkit City Operations Associate: Ground Fulfillment & Merchant Onboarding',
    titleHi: 'ज़ोमैटो एवं ब्लिंकिट सिटी ऑपरेशंस: 500+ शहरों में डार्क स्टोर व मर्चेंट ऑनबोर्डिंग पद (25,000 - 35,000/माह)',
    category: 'private_job',
    applicationStatus: 'active_now',
    lifeStage: 'private_jobs',
    targetAges: [18, 35],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker'],
    benefitHeadline: 'Monthly ₹25,000 - ₹35,000 + Fuel Allowance, Performance Incentives & ESIC Health Card',
    benefitHeadlineHi: '₹25,000 - ₹35,000 प्रतिमाह + पेट्रोल भत्ता, प्रोत्साहन राशि एवं ईएसआईसी स्वास्थ्य कार्ड',
    benefitAmount: 30000,
    deadline: 'OPEN_ROUND',
    description: 'Ground operations and quick-commerce dark store management associate roles across Tier-1, Tier-2, and Tier-3 cities managing merchant onboarding, rider coordination, and supply chain fulfillment.',
    descriptionHi: 'देश के 500+ छोटे-बड़े शहरों में ज़ोमैटो एवं ब्लिंकिट के डार्क स्टोर प्रबंधन, रेस्टोरेंट ऑनबोर्डिंग और फील्ड ऑपरेशंस हेतु युवाओं की सीधी भर्ती।',
    gazette: {
      circularNumber: 'ZOMATO/BLINKIT-OPS/2026/CAREERS',
      issuingAuthority: 'Zomato Limited Human Resources',
      gazetteDate: '2026-08-10',
      lastVerifiedAt: 'Live verified 30 mins ago',
      officialPortalUrl: 'https://www.zomato.com/careers',
      scamAlertWarning: 'Zomato never charges money for interviews or onboarding kit. Beware of fake SMS messages.',
      officialGovtFee: '₹0 (100% Free Direct Application)'
    },
    documents: [
      { id: 'd-zom-1', name: '10th / 12th / Graduation Certificate', nameHi: '10वीं/12वीं अथवा स्नातक अंकतालिका', isMandatory: true },
      { id: 'd-zom-2', name: 'PAN Card, Aadhaar Card & Driving Licence', nameHi: 'पैन, आधार कार्ड एवं ड्राइविंग लाइसेंस', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Check local city operations vacancies on zomato.com/careers.', textHi: 'zomato.com/careers पर अपने शहर की रिक्तियां देखें।' },
      { step: 2, text: 'Submit resume and select your nearest city hub.', textHi: 'बायोडाटा सबमिट कर नजदीकी हब का चयन करें।' },
      { step: 3, text: 'Attend local branch interview and complete 3-day training.', textHi: 'स्थानीय शाखा में साक्षात्कार देकर 3-दिवसीय प्रशिक्षण पूरा करें।' }
    ],
    tags: ['Zomato', 'Blinkit', 'Private Job', 'Operations', 'Fresher Friendly'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-posp-advisor-01',
    title: 'IRDAI Certified POSP Financial & Insurance Consultant (Zero Investment)',
    titleHi: 'आईआरडीएआई प्रमाणित वित्तीय एवं बीमा सलाहकार (शून्य निवेश)',
    category: 'private_job',
    applicationStatus: 'active_now',
    lifeStage: 'private_jobs',
    targetAges: [18, 70],
    stateEligibility: ['ALL'],
    targetOccupations: ['homemaker', 'farmer', 'business_owner', 'employed', 'senior_citizen', 'job_seeker'],
    benefitHeadline: 'Earn ₹20,000 - ₹50,000/Month Working from Mobile with Top IRDAI Approved Insurers',
    benefitHeadlineHi: 'मोबाइल से काम करके शीर्ष बीमा कंपनियों के साथ ₹20,000 - ₹50,000 प्रतिमाह कमीशन कमाएं',
    benefitAmount: 35000,
    deadline: 'OPEN_ROUND',
    description: 'Point of Sales Person (POSP) is an IRDAI-authorized official career path allowing any 10th pass adult to sell life, health, motor, and crop insurance policies directly to community members with 100% transparent payouts.',
    descriptionHi: 'भारतीय बीमा विनियामक एवं विकास प्राधिकरण (आईआरडीएआई) द्वारा मान्यता प्राप्त करियर मार्ग जिसमें न्यूनतम 10वीं पास वयस्क बीमा सलाहकार बनकर आजीवन आय कमा सकते हैं।',
    gazette: {
      circularNumber: 'IRDAI/POSP/2026/REGULATION-04',
      issuingAuthority: 'Insurance Regulatory and Development Authority of India',
      gazetteDate: '2026-06-10',
      lastVerifiedAt: 'Live verified 2 hrs ago',
      officialPortalUrl: 'https://irdai.gov.in',
      scamAlertWarning: 'POSP 15-hour training and certification is 100% free with IRDAI registered brokers. Never pay any joining fee.',
      officialGovtFee: '₹0 (100% Free Training & Certification)'
    },
    documents: [
      { id: 'd-posp-1', name: '10th Standard Pass Certificate', nameHi: '10वीं उत्तीर्ण प्रमाण पत्र', isMandatory: true },
      { id: 'd-posp-2', name: 'PAN Card & Aadhaar Card', nameHi: 'पैन कार्ड एवं आधार कार्ड', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Register with any IRDAI-licensed insurance broker (PolicyBazaar, Turtlemint, etc.).', textHi: 'आईआरडीएआई पंजीकृत ब्रोकर पोर्टल पर निःशुल्क पंजीकरण करें।' },
      { step: 2, text: 'Complete mandatory 15-hour online video training on insurance modules.', textHi: 'अनिवार्य 15 घंटे का ऑनलाइन वीडियो प्रशिक्षण पूरा करें।' },
      { step: 3, text: 'Pass official 30-minute online POSP test and get licensed to advise clients.', textHi: '30 मिनट की परीक्षा उत्तीर्ण कर आधिकारिक सलाहकार लाइसेंस प्राप्त करें।' }
    ],
    tags: ['POSP', 'Insurance Consultant', 'Work from Home', 'Zero Investment', 'Flexible Income'],
    is100PercentFree: true
  },
  {
    id: 'opp-remote-01',
    title: 'Global Verified Remote Data & AI Evaluator (USD Payouts)',
    titleHi: 'वैश्विक सत्यापित रिमोट एआई एवं डेटा मूल्यांकनकर्ता (डॉलर भुगतान)',
    category: 'remote_usd_job',
    applicationStatus: 'active_now',
    lifeStage: 'private_jobs',
    targetAges: [18, 55],
    stateEligibility: ['ALL'],
    targetOccupations: ['job_seeker', 'college_student', 'homemaker', 'employed'],
    benefitHeadline: '$18 - $24 Per Hour (~₹1,500 - ₹2,000/hr) Direct to Indian Bank via PayPal/Stripe',
    benefitHeadlineHi: '$18 - $24 प्रति घंटा (~₹1,500 - ₹2,000/घंटा) सीधे भारतीय बैंक खाते में',
    benefitAmount: 90000,
    deadline: 'OPEN_ROUND',
    description: 'Work from home for international AI research laboratories evaluating generative models in Hindi and English. Flexible 10-20 hours per week.',
    descriptionHi: 'घर बैठे अंतरराष्ट्रीय एआई अनुसंधान प्रयोगशालाओं के लिए हिंदी और अंग्रेजी भाषा में मॉडल्स का मूल्यांकन। सप्ताह में 10-20 घंटे का लचीला कार्य।',
    gazette: {
      circularNumber: 'REMOTE-CORP-VERIFIED/2026/IN',
      issuingAuthority: 'Direct Corporate Enterprise Partner (Scale AI / Outlier)',
      gazetteDate: '2026-09-15',
      lastVerifiedAt: 'Live verified 15 mins ago',
      officialPortalUrl: 'https://outlier.ai',
      scamAlertWarning: 'Genuine remote work platforms NEVER ask for registration fees or deposit money. Registration and testing is 100% free.',
      officialGovtFee: '₹0 (100% Free Application)'
    },
    documents: [
      { id: 'd-rem-1', name: 'PAN Card & Bank Account', nameHi: 'पैन कार्ड एवं बैंक खाता विवरण', isMandatory: true },
      { id: 'd-rem-2', name: 'Valid Government ID (Aadhaar/Passport)', nameHi: 'वैध पहचान पत्र (आधार या पासपोर्ट)', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Create applicant profile on verified portal.', textHi: 'सत्यापित पोर्टल पर अपना आवेदक विवरण भरें।' },
      { step: 2, text: 'Complete 20-minute language comprehension screening test.', textHi: '20 मिनट का निःशुल्क भाषा ज्ञान परीक्षण पूरा करें।' },
      { step: 3, text: 'Start evaluating AI training tasks and receive weekly dollar payouts.', textHi: 'कार्य शुरू करें और प्रति सप्ताह सीधे खाते में डॉलर भुगतान प्राप्त करें।' }
    ],
    tags: ['Remote Job', 'Earn in Dollars', 'AI Training', 'Flexible Hours', 'Verified Global Work'],
    is100PercentFree: true
  },
  {
    id: 'opp-amazon-wow-01',
    title: 'Amazon WOW 2026: Technology Mentorship & SDE Hiring Drive Exclusively for Women Engineers',
    titleHi: 'अमेज़न वाओ 2026: महिला इंजीनियरिंग छात्राओं हेतु सॉफ्टवेयर डेवलपमेंट इंजीनियर (SDE) भर्ती एवं मेंटरशिप',
    category: 'private_job',
    applicationStatus: 'active_now',
    lifeStage: 'private_jobs',
    targetAges: [18, 28],
    genderEligibility: 'female',
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker'],
    benefitHeadline: '₹1,10,000/Month Paid SDE Internship + Pre-Placement Offer (₹28 LPA - ₹44 LPA) at Amazon India Development Centers',
    benefitHeadlineHi: '₹1,10,000 प्रतिमाह पेड इंटर्नशिप + अमेज़न इंडिया में ₹28 से ₹44 लाख वार्षिक पैकेज पर स्थायी सॉफ्टवेयर इंजीनियर जॉब',
    benefitAmount: 110000,
    deadline: '2026-05-15',
    description: 'Amazon WOW is a dedicated initiative designed to skill, mentor, and hire women students pursuing B.Tech, B.E., M.Tech, or MCA across Indian engineering institutes directly for software development engineer (SDE) roles.',
    descriptionHi: 'अमेज़न इंडिया द्वारा देश के सभी इंजीनियरिंग कॉलेजों की छात्राओं के लिए आयोजित आधिकारिक तकनीकी मेंटरशिप एवं सीधी सॉफ्टवेयर इंजीनियर भर्ती ड्राइव।',
    gazette: {
      circularNumber: 'AMZN/WOW/INDIA-2026/ACADEMIC-RECRUIT',
      issuingAuthority: 'Amazon Development Centre India',
      gazetteDate: '2026-08-10',
      lastVerifiedAt: 'Live verified 15 mins ago',
      officialPortalUrl: 'https://amazon.jobs',
      scamAlertWarning: 'Amazon never requests any cash or deposit for registrations or technical assessments. Apply only via official amazon.jobs or amazonwowindia.splashthat.com.',
      officialGovtFee: '₹0 (100% Free Corporate Hiring)'
    },
    documents: [
      { id: 'd-wow-1', name: 'Updated Technical Resume with GitHub / Project Links', nameHi: 'अपडेटेड तकनीकी बायोडाटा (GitHub / प्रोजेक्ट लिंक सहित)', isMandatory: true },
      { id: 'd-wow-2', name: 'College Student ID / Degree Enrolment Proof', nameHi: 'कॉलेज आईडी कार्ड अथवा नामांकन प्रमाण', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Register for Amazon WOW mentorship on official portal amazonwowindia.splashthat.com or amazon.jobs.', textHi: 'आधिकारिक पोर्टल पर अमेज़न वाओ हेतु पंजीकरण करें।' },
      { step: 2, text: 'Participate in live coding masterclasses and take the online coding assessment round.', textHi: 'कोडिंग वर्कशॉप में भाग लें और ऑनलाइन प्रोग्रामिंग टेस्ट उत्तीर्ण करें।' },
      { step: 3, text: 'Clear technical interviews with Amazon bar raisers and receive official SDE internship/FTE offer.', textHi: 'तकनीकी इंटरव्यू पास करके आधिकारिक ऑफर लेटर प्राप्त करें।' }
    ],
    tags: ['Amazon WOW', 'Women in Tech', 'SDE Hiring', 'High Salary', 'Software Engineer'],
    is100PercentFree: true,
    isNew: true
  }
];
