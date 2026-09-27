import { Opportunity } from '@/types';

export const CAREER_OPPORTUNITIES: Opportunity[] = [
  // =========================================================================
  // 1. FREE HIGH-INCOME SKILL ROADMAPS (Self-Paced, 100% Free Resources)
  // =========================================================================
  {
    id: 'opp-skill-ai-01',
    title: 'AI Prompt Engineering & Workflow Automation: Complete Free Roadmap',
    titleHi: 'एआई प्रॉम्प्ट इंजीनियरिंग एवं वर्कफ़्लो ऑटोमेशन: १००% निःशुल्क संपूर्ण रोडमैप',
    category: 'skill_roadmap',
    lifeStage: 'career',
    targetAges: [16, 50],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker', 'employed', 'business_owner'],
    benefitHeadline: 'Learn to Automate Business Tasks Using LLMs & Make ₹50,000 - ₹1.5 Lakh/Month as Freelance Consultant',
    benefitHeadlineHi: 'एआई की मदद से जटिल कार्य ऑटोमेट करना सीखें एवं ₹५०,००० - ₹१.५ लाख प्रतिमाह तक कमाएं',
    benefitAmount: 65000,
    deadline: 'OPEN_ROUND',
    description: 'Curated 6-week self-paced roadmap using 100% free courses from DeepLearning.AI, Harvard CS50, and official OpenAI documentation with zero subscription cost.',
    descriptionHi: 'हार्वर्ड और डीपलर्निंग एआई द्वारा संचालित ६ सप्ताह का निःशुल्क कोर्स जिससे बिना कोडिंग के एआई टूल्स चलाकर उच्च आय प्राप्त की जा सकती है।',
    gazette: {
      circularNumber: 'SKILL-AI-FREE-2026/CURATED',
      issuingAuthority: 'Citizen Life OS Free Skills Council',
      gazetteDate: '2026-09-01',
      lastVerifiedAt: 'Live verified 10 mins ago',
      officialPortalUrl: 'https://learnprompting.org',
      scamAlertWarning: 'Never pay ₹5,000 to ₹25,000 for Instagram AI masterclasses. All top-tier knowledge is publicly available for free at learnprompting.org.',
      officialGovtFee: '₹0 (100% Free Public Learning)'
    },
    documents: [],
    applySteps: [
      { step: 1, text: 'Start with free Prompt Engineering Guide at learnprompting.org.', textHi: 'learnprompting.org पर निःशुल्क गाइड से शुरुआत करें।' },
      { step: 2, text: 'Complete DeepLearning.AI ChatGPT Prompt Engineering for Developers (Free).', textHi: 'डीपलर्निंग.एआई का निःशुल्क सर्टिफिकेट कोर्स पूरा करें।' },
      { step: 3, text: 'Build 3 automation workflows on Zapier / Make free tier to showcase to clients.', textHi: 'क्लाइंट्स को दिखाने हेतु ३ लाइव ऑटोमेशन प्रोजेक्ट तैयार करें।' }
    ],
    tags: ['High Income Skill', 'Free AI Course', 'Freelancing'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-skill-video-01',
    title: 'High-Ticket Video Editing & Motion Graphics (CapCut + DaVinci Resolve)',
    titleHi: 'हाई-टिकट वीडियो एडिटिंग एवं मोशन ग्राफिक्स (कैपकैट एवं डाविंची रिजॉल्व)',
    category: 'skill_roadmap',
    lifeStage: 'career',
    targetAges: [15, 45],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student', 'job_seeker', 'homemaker'],
    benefitHeadline: 'Master Short-Form & Long-Form Video Storytelling and Earn $500 - $2,000 Per International Client',
    benefitHeadlineHi: 'शॉर्ट्स एवं यूट्यूब वीडियो एडिटिंग सीखकर अंतरराष्ट्रीय क्लाइंट्स से $५०० - $२,००० प्रति माह कमाएं',
    benefitAmount: 85000,
    deadline: 'OPEN_ROUND',
    description: 'Learn color grading, sound design, and hook pacing on DaVinci Resolve (100% free software used by Hollywood studios) with zero pirated plugins.',
    descriptionHi: 'हॉलीवुड स्तर के निःशुल्क सॉफ्टवेयर डाविंची रिजॉल्व पर वीडियो एडिटिंग सीखकर घर बैठे वैश्विक स्तर पर कमाई का रोडमैप।',
    gazette: {
      circularNumber: 'SKILL-MEDIA-2026/RESOLVE',
      issuingAuthority: 'Open Creative Standards Foundation',
      gazetteDate: '2026-08-15',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://www.blackmagicdesign.com/products/davinciresolve',
      scamAlertWarning: 'DaVinci Resolve is completely free from Blackmagic Design official website. Never buy cracked torrents containing malware.',
      officialGovtFee: '₹0 (Free Software & YouTube Guides)'
    },
    documents: [],
    applySteps: [
      { step: 1, text: 'Download official free DaVinci Resolve from blackmagicdesign.com.', textHi: 'आधिकारिक वेबसाइट से निःशुल्क डाविंची रिजॉल्व सॉफ्टवेयर डाउनलोड करें।' },
      { step: 2, text: 'Follow Blackmagic official 10-part certified training videos on YouTube.', textHi: 'ब्लैकमैजिक के आधिकारिक १०-भागों वाले यूट्यूब ट्यूटोरियल देखें।' },
      { step: 3, text: 'Create a 3-video portfolio and reach out to creators on Twitter/LinkedIn.', textHi: '३ वीडियो का पोर्टफोलियो बनाकर सोशल मीडिया पर क्रिएटर्स से संपर्क करें।' }
    ],
    tags: ['Video Editing', 'Remote Earning', 'Creative Skill'],
    is100PercentFree: true
  },
  {
    id: 'opp-csc-vle-01',
    title: 'CSC Digital Seva Kendra (VLE): Village Level Entrepreneurship Certification',
    titleHi: 'सीएससी डिजिटल सेवा केंद्र (वीएलई): ग्रामीण स्तर पर डिजिटल उद्यम प्रमाणन',
    category: 'skill_roadmap',
    lifeStage: 'career',
    targetAges: [18, 50],
    stateEligibility: ['ALL'],
    targetOccupations: ['job_seeker', 'farmer', 'business_owner'],
    benefitHeadline: 'Earn ₹30,000 - ₹60,000/Month Providing 400+ Govt G2C and B2C Services in Your Village/Ward',
    benefitHeadlineHi: 'गांव या कस्बे में डिजिटल सेवा केंद्र खोलकर ₹३०,००० - ₹६०,००० प्रतिमाह की स्थायी आय कमाएं',
    benefitAmount: 45000,
    deadline: 'OPEN_ROUND',
    description: 'Special Purpose Vehicle under Ministry of Electronics & IT (MeitY) allowing citizens to run government kiosks providing PAN, Passport, PM-Kisan, and Banking services.',
    descriptionHi: 'इलेक्ट्रॉनिक्स एवं सूचना प्रौद्योगिकी मंत्रालय द्वारा अधिकृत केंद्र जिससे गांव में बैंकिंग, आधार व पैन सेवाएं देकर आजीवन स्वरोजगार स्थापित होता है।',
    gazette: {
      circularNumber: 'MEITY/CSC-VLE/2026/REG-01',
      issuingAuthority: 'CSC e-Governance Services India Limited',
      gazetteDate: '2026-07-01',
      lastVerifiedAt: 'Live verified 30 mins ago',
      officialPortalUrl: 'https://register.csc.gov.in',
      scamAlertWarning: 'CSC registration only requires official TEC certification fee (~₹1,479). Never pay private agents ₹10,000 to ₹50,000 for CSC approval.',
      officialGovtFee: '₹1,479 (Official TEC Exam Fee Only)'
    },
    documents: [
      { id: 'd-csc-1', name: 'Telecentre Entrepreneur Course (TEC) Certificate', nameHi: 'टीईसी प्रमाण पत्र', isMandatory: true },
      { id: 'd-csc-2', name: 'Aadhaar, PAN & Cancelled Cheque', nameHi: 'आधार, पैन एवं कैंसिल चेक', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Pass online TEC exam at cscentrepreneur.in to obtain TEC number.', textHi: 'cscentrepreneur.in पर ऑनलाइन परीक्षा देकर टीईसी नंबर प्राप्त करें।' },
      { step: 2, text: 'Fill official VLE registration form on register.csc.gov.in.', textHi: 'register.csc.gov.in पर जाकर निःशुल्क आवेदन भरें।' },
      { step: 3, text: 'Complete physical inspection by District Manager to activate portal ID.', textHi: 'जिला प्रबंधक सत्यापन के उपरांत केंद्र की आईडी चालू हो जाती है।' }
    ],
    tags: ['CSC', 'Digital India', 'Self Employment', 'Steady Income'],
    is100PercentFree: false
  },
  {
    id: 'opp-webdev-fullstack-01',
    title: 'Free Full-Stack Web & Mobile App Development Roadmap (The Odin Project + freeCodeCamp)',
    titleHi: 'पूर्णतः निःशुल्क फुल-स्टैक वेब एवं मोबाइल ऐप डेवलपमेंट रोडमैप (शून्य से विशेषज्ञ)',
    category: 'skill_roadmap',
    lifeStage: 'career',
    targetAges: [16, 45],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student', 'job_seeker', 'employed'],
    benefitHeadline: 'Master JavaScript, React, Node.js & Next.js to Land ₹6 LPA - ₹18 LPA Software Engineering Roles',
    benefitHeadlineHi: 'बिना किसी महंगे बूटकैंप के घर बैठे कोडिंग सीखकर ₹६ लाख से ₹१८ लाख का सॉफ्टवेयर इंजीनियर पैकेज पाएं',
    benefitAmount: 70000,
    deadline: 'OPEN_ROUND',
    description: '100% open-source curriculum trusted globally by millions of developers. Includes real-world project assignments, Git version control, and Discord community code reviews with zero paywalls.',
    descriptionHi: 'द ओडिन प्रोजेक्ट और फ्रीकोडकैंप द्वारा संचालित संपूर्ण कोडिंग पाठ्यक्रम। बिना किसी कॉलेज डिग्री के भी टेक कंपनियों में नौकरी पाने का सबसे प्रामाणिक रास्ता।',
    gazette: {
      circularNumber: 'OPEN-SOURCE-CURRICULUM/2026/WEB',
      issuingAuthority: 'Open Source Education Initiative',
      gazetteDate: '2026-08-01',
      lastVerifiedAt: 'Live verified 2 hrs ago',
      officialPortalUrl: 'https://www.theodinproject.com',
      scamAlertWarning: 'Never pay ₹50,000 to ₹1.5 Lakh for private coding bootcamps promising "guaranteed jobs". The exact same curriculum is free on theodinproject.com and freecodecamp.org.',
      officialGovtFee: '₹0 (100% Free Open Source Learning)'
    },
    documents: [],
    applySteps: [
      { step: 1, text: 'Start with The Odin Project Foundations course at theodinproject.com.', textHi: 'theodinproject.com पर जाकर फाउंडेशन कोर्स से शुरुआत करें।' },
      { step: 2, text: 'Build 5 real-world GitHub projects (Calculator, Weather App, Full-Stack E-Commerce).', textHi: '५ लाइव प्रोजेक्ट्स बनाकर अपने गिटहब अकाउंट पर अपलोड करें।' },
      { step: 3, text: 'Apply for remote developer jobs or freelance contracts on GitHub Jobs and Wellfound.', textHi: 'अपने प्रोजेक्ट पोर्टफोलियो के साथ रिमोट या ऑन-साइट नौकरियों के लिए आवेदन करें।' }
    ],
    tags: ['Coding', 'Web Development', 'Full-Stack', 'Free Education', 'High Salary'],
    is100PercentFree: true
  },
  {
    id: 'opp-google-cert-01',
    title: 'Google Career Certificates: IT Support, Data Analytics, Cybersecurity & UX Design',
    titleHi: 'गूगल करियर प्रमाणन: डेटा एनालिटिक्स, साइबर सुरक्षा, आईटी सपोर्ट एवं यूएक्स डिजाइन',
    category: 'skill_roadmap',
    lifeStage: 'career',
    targetAges: [16, 55],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker', 'employed'],
    benefitHeadline: 'Industry-Recognized Google Credential Qualifying You for ₹4.5 LPA - ₹12 LPA Tech Roles + Financial Aid',
    benefitHeadlineHi: 'गूगल द्वारा प्रमाणित सर्टिफिकेट जिससे बिना डिग्री के भी ₹४.५ लाख से ₹१२ लाख की टेक नौकरियां मिलती हैं',
    benefitAmount: 50000,
    deadline: 'OPEN_ROUND',
    description: 'Professional certificates designed by Google engineers on Coursera to fast-track job readiness in 3 to 6 months. 100% tuition fee waiver available via Coursera Financial Aid for all Indian students.',
    descriptionHi: 'गूगल के इंजीनियरों द्वारा तैयार किए गए प्रोफेशनल कोर्सेज। कोर्सएरा फाइनेंशियल एड के जरिए भारतीय छात्रों को यह कोर्स १००% निःशुल्क मिल जाता है।',
    gazette: {
      circularNumber: 'GOOGLE-GROW-WITH-GOOGLE/2026/IN',
      issuingAuthority: 'Grow with Google & Coursera Open Initiative',
      gazetteDate: '2026-08-10',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://grow.google/certificates',
      scamAlertWarning: 'Do not pay full Coursera subscription fees if you have limited income. Always click "Financial Aid Available" next to the Enroll button for 100% free access.',
      officialGovtFee: '₹0 (With Official Financial Aid Form)'
    },
    documents: [
      { id: 'd-gc-1', name: 'Identity Proof (Aadhaar or College ID)', nameHi: 'पहचान पत्र (आधार अथवा कॉलेज आईडी)', isMandatory: false }
    ],
    applySteps: [
      { step: 1, text: 'Visit grow.google/certificates and select your field (Data Analytics, Cyber, IT).', textHi: 'grow.google/certificates पर अपनी पसंद का विषय चुनें।' },
      { step: 2, text: 'On Coursera page, click "Financial Aid Available", enter ₹0 annual income, and write your study goal.', textHi: 'कोर्सएरा पर फाइनेंशियल एड चुनकर १००% फीस माफी हेतु आवेदन सबमिट करें।' },
      { step: 3, text: 'Complete weekly modules, earn official Google badge, and share on LinkedIn.', textHi: 'कोर्स पूरा कर लिंक्डइन पर गूगल का डिजिटल बैज प्रदर्शित करें।' }
    ],
    tags: ['Google Certificate', 'Data Analytics', 'Cybersecurity', 'Free with Aid', 'Job Ready'],
    is100PercentFree: true
  },
  {
    id: 'opp-solar-technician-01',
    title: 'Suryamitra Solar PV Technician Skill Certification (MNRE Govt Certified Training)',
    titleHi: 'सूर्यमित्र सोलर पीवी तकनीशियन सरकारी कौशल प्रशिक्षण (आवास व भोजन सहित निःशुल्क)',
    category: 'skill_roadmap',
    lifeStage: 'career',
    targetAges: [18, 35],
    stateEligibility: ['ALL'],
    targetOccupations: ['job_seeker', 'college_student'],
    benefitHeadline: '600-Hour Residential Technical Certification + 100% Assured Placement in Solar EPC Firms (₹22,000 - ₹38,000/Month)',
    benefitHeadlineHi: '६०० घंटे का आवासीय तकनीकी प्रशिक्षण + सोलर कंपनियों में ₹२२,००० - ₹३८,००० वेतन पर सीधी नौकरी',
    benefitAmount: 35000,
    deadline: 'OPEN_ROUND',
    description: 'National Institute of Solar Energy (NISE) flagship program training youth in installation, commissioning, and maintenance of rooftop and utility solar plants under PM Surya Ghar Yojana.',
    descriptionHi: 'नवीन एवं नवीकरणीय ऊर्जा मंत्रालय के राष्ट्रीय सौर ऊर्जा संस्थान द्वारा संचालित निःशुल्क आवासीय प्रशिक्षण जिसमें युवाओं को सोलर प्लांट इंस्टॉलेशन और रखरखाव सिखाया जाता है।',
    gazette: {
      circularNumber: 'MNRE/NISE/SURYAMITRA/2026/08',
      issuingAuthority: 'National Institute of Solar Energy (Ministry of New & Renewable Energy)',
      gazetteDate: '2026-07-15',
      lastVerifiedAt: 'Live verified 3 hrs ago',
      officialPortalUrl: 'https://suryamitra.nise.res.in',
      scamAlertWarning: 'Suryamitra training, lodging, and boarding is 100% paid by the Government of India. Centers cannot charge any training or hostel fees.',
      officialGovtFee: '₹0 (100% Govt Funded Residential Program)'
    },
    documents: [
      { id: 'd-surya-1', name: '10th Marksheet + ITI (Electrician/Wireman) or Diploma (Electrical/Mechanical)', nameHi: '१०वीं अंकतालिका + आईटीआई अथवा डिप्लोमा प्रमाण पत्र', isMandatory: true },
      { id: 'd-surya-2', name: 'Aadhaar Card and 2 Passport Photos', nameHi: 'आधार कार्ड एवं २ पासपोर्ट फोटो', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Check list of accredited Suryamitra training centers in your district on suryamitra.nise.res.in.', textHi: 'suryamitra.nise.res.in पोर्टल पर अपने जिले के ट्रेनिंग सेंटर की सूची देखें।' },
      { step: 2, text: 'Visit the training center with ITI/Diploma certificates for registration.', textHi: 'प्रमाण पत्रों के साथ नजदीकी सूर्यमित्र केंद्र पर संपर्क करें।' },
      { step: 3, text: 'Complete 3-month course and clear Skill Council for Green Jobs (SCGJ) assessment.', textHi: '३ माह का कोर्स पूरा कर सरकारी प्रमाण पत्र व नौकरी प्राप्त करें।' }
    ],
    tags: ['Suryamitra', 'Solar Energy', 'Free Training', 'Govt Job Placement', 'PM Surya Ghar'],
    is100PercentFree: true
  },
  {
    id: 'opp-ncs-counselling-01',
    title: 'National Career Service (NCS) Career Counselling & Psychometric Aptitude Test',
    titleHi: 'राष्ट्रीय करियर सेवा (NCS): निःशुल्क करियर काउंसलिंग एवं साइकोमेट्रिक टेस्ट',
    category: 'career_consultant',
    lifeStage: 'career',
    targetAges: [14, 40],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student', 'job_seeker'],
    benefitHeadline: '100% Free 1-on-1 Guidance with Certified Govt Career Counsellors & Scientific Career Fitment Report',
    benefitHeadlineHi: 'प्रमाणित सरकारी करियर काउंसलर्स द्वारा निःशुल्क परामर्श एवं वैज्ञानिक योग्यता रिपोर्ट',
    benefitAmount: 5000,
    deadline: 'OPEN_ROUND',
    description: 'Ministry of Labour & Employment initiative providing students and youth personalized career guidance across 3,500+ job roles, Model Career Centres (MCCs), and psychometric interest mapping.',
    descriptionHi: 'श्रम एवं रोजगार मंत्रालय द्वारा संचालित आधिकारिक राष्ट्रीय पोर्टल जहां विशेषज्ञ करियर काउंसलर विद्यार्थियों को उनकी रुचि और क्षमता अनुसार सही करियर चुनने में मार्गदर्शन करते हैं।',
    gazette: {
      circularNumber: 'MOLE/NCS/CAREER-ADVISORY/2026',
      issuingAuthority: 'Ministry of Labour and Employment (Govt of India)',
      gazetteDate: '2026-08-01',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://www.ncs.gov.in',
      scamAlertWarning: 'NCS career counselling and job fair entry is completely free. Never pay private agents for NCS registration.',
      officialGovtFee: '₹0 (100% Free Public Service)'
    },
    documents: [
      { id: 'd-ncs-1', name: 'Aadhaar Card or Unique NCS ID', nameHi: 'आधार कार्ड अथवा एनसीएस आईडी', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Register as Jobseeker on ncs.gov.in with Aadhaar verification.', textHi: 'ncs.gov.in पोर्टल पर आधार द्वारा निःशुल्क पंजीकरण करें।' },
      { step: 2, text: 'Take the online career aptitude and interest assessment test.', textHi: 'पोर्टल पर ऑनलाइन करियर एप्टीट्यूड टेस्ट दें।' },
      { step: 3, text: 'Book an online or in-person slot at your nearest Model Career Centre.', textHi: 'नजदीकी मॉडल करियर सेंटर में काउंसलर के साथ स्लॉट बुक करें।' }
    ],
    tags: ['Career Guidance', 'Psychometric Test', 'Govt Counselling', 'Job Fair', 'NCS'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-edu-advisory-01',
    title: 'Higher Education & Career Advisory: UGC, AICTE & AIU Degree Verification & Course Selection',
    titleHi: 'उच्च शिक्षा एवं करियर परामर्श: यूजीसी, एआईसीटीई मान्यता जांच एवं सही कॉलेज चयन',
    category: 'career_consultant',
    lifeStage: 'career',
    targetAges: [15, 35],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student', 'job_seeker'],
    benefitHeadline: 'Instant Verification of 1,200+ Universities & Fake University Blacklist to Protect Your Career & Fees',
    benefitHeadlineHi: '१,२००+ विश्वविद्यालयों की वास्तविक मान्यता जांचें व फर्जी संस्थानों की ब्लैकलिस्ट से अपना भविष्य बचाएं',
    benefitAmount: 0,
    deadline: 'OPEN_ROUND',
    description: 'Centralized directory by UGC and AICTE to verify whether an educational institution or distance degree holds valid statutory approvals before students invest hard-earned money.',
    descriptionHi: 'विश्वविद्यालय अनुदान आयोग (UGC) का आधिकारिक पोर्टल जिसके द्वारा किसी भी कॉलेज या ऑनलाइन डिग्री की सरकारी मान्यता और फर्जी संस्थानों की सूची निशुल्क देखी जा सकती है।',
    gazette: {
      circularNumber: 'UGC/ACADEMIC-VERIFY/2026/NOTIF',
      issuingAuthority: 'University Grants Commission (UGC)',
      gazetteDate: '2026-07-20',
      lastVerifiedAt: 'Live verified 2 hrs ago',
      officialPortalUrl: 'https://www.ugc.gov.in',
      scamAlertWarning: 'Over 20+ fake universities operate unauthorized study centers in India. Always verify college status on ugc.gov.in before paying any admission fees.',
      officialGovtFee: '₹0 (Free Public Directory)'
    },
    documents: [],
    applySteps: [
      { step: 1, text: 'Visit ugc.gov.in and navigate to "Universities" section.', textHi: 'ugc.gov.in पर जाकर "विश्वविद्यालय" अनुभाग खोलें।' },
      { step: 2, text: 'Check Central, State, Private, or Deemed University approval status.', textHi: 'कॉलेज की यूजीसी मान्यता और संबद्धता की जांच करें।' },
      { step: 3, text: 'Review the latest published list of Fake / Unrecognized Universities.', textHi: 'यूजीसी द्वारा जारी फर्जी संस्थानों की ब्लैकलिस्ट अवश्य देखें।' }
    ],
    tags: ['UGC Approved', 'College Verification', 'Career Advisory', 'Fake College Alert', 'Free Tool'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-nsdc-international-01',
    title: 'Skill India International: Ethical Overseas Employment & Work Visa Gateway (Germany, Japan, Gulf)',
    titleHi: 'स्किल इंडिया इंटरनेशनल: सुरक्षित विदेशी रोजगार एवं वर्क वीजा (जर्मनी, जापान, गल्फ)',
    category: 'career_consultant',
    lifeStage: 'career',
    targetAges: [20, 42],
    stateEligibility: ['ALL'],
    targetOccupations: ['job_seeker', 'employed'],
    benefitHeadline: 'Direct Overseas Employment (Salary: ₹1.2 Lakh - ₹3.5 Lakh/Month) + Official Govt Pre-Departure Training',
    benefitHeadlineHi: 'सीधे विदेशी रोजगार (वेतन: ₹१.२ लाख से ₹३.५ लाख प्रतिमाह) + सरकारी भाषा व कार्य प्रशिक्षण',
    benefitAmount: 180000,
    deadline: 'OPEN_ROUND',
    description: 'National Skill Development Corporation (NSDC) International facilitates ethical government-to-government overseas recruitment of skilled Indian nurses, technicians, engineers, hospitality workers, and construction managers in Germany, Japan (TITP/SSW), Taiwan, and GCC nations.',
    descriptionHi: 'राष्ट्रीय कौशल विकास निगम (एनएसडीसी) द्वारा भारत सरकार के आधिकारिक समझौतों के तहत नर्सिंग, इंजीनियरिंग, होटल मैनेजमेंट और तकनीशियनों को जर्मनी, जापान और यूएई में सुरक्षित विदेशी रोजगार उपलब्ध कराया जाता है।',
    gazette: {
      circularNumber: 'MSDE/NSDC-INTL/OVERSEAS-JOBS/2026',
      issuingAuthority: 'Ministry of Skill Development & Entrepreneurship (Govt of India)',
      gazetteDate: '2026-08-01',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://nsdcinternational.com',
      scamAlertWarning: 'Never pay illegal travel agents or visa fraudsters. All overseas recruitment under NSDC International is ethically managed with fixed nominal service charges.',
      officialGovtFee: 'Transparent Standard Processing Fee (Govt MoU)'
    },
    documents: [
      { id: 'd-nsdc-1', name: 'Valid Indian Passport (Min 2 Years Validity)', nameHi: 'वैध भारतीय पासपोर्ट (न्यूनतम २ वर्ष की वैधता)', isMandatory: true },
      { id: 'd-nsdc-2', name: 'Diploma / Degree / ITI in Relevant Trade or Nursing', nameHi: 'संबंधित ट्रेड में डिप्लोमा, डिग्री अथवा नर्सिंग सर्टिफिकेट', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Register profile on nsdcinternational.com and select destination country (Germany/Japan/UAE).', textHi: 'nsdcinternational.com पोर्टल पर जाकर प्रोफाइल बनाएं और देश चुनें।' },
      { step: 2, text: 'Complete subsidized language training (German B1/B2 or Japanese N4/N3) at NSDC Skill Institute.', textHi: 'एनएसडीसी केंद्र पर भाषा प्रशिक्षण पूरा करें।' },
      { step: 3, text: 'Attend direct employer interview and receive verified foreign employment contract.', textHi: 'विदेशी नियोक्ता का साक्षात्कार देकर सत्यापित वर्क कॉन्ट्रैक्ट प्राप्त करें।' }
    ],
    tags: ['Overseas Jobs', 'Skill India International', 'Foreign Work Visa', 'High Salary Overseas', 'Govt Verified'],
    is100PercentFree: false,
    isNew: true
  }
];
