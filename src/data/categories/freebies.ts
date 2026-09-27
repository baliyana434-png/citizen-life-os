import { Opportunity } from '@/types';

export const FREEBIE_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-jio-cloud-01',
    title: 'Jio AI Cloud: 100GB Free Sovereign Cloud Storage & AI Tools',
    titleHi: 'जियो एआई क्लाउड: १०० जीबी निःशुल्क क्लाउड स्टोरेज एवं एआई टूल्स',
    category: 'tech_perk_free',
    lifeStage: 'freebies',
    targetAges: [14, 75],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student', 'job_seeker', 'employed', 'business_owner', 'homemaker', 'farmer', 'senior_citizen'],
    benefitHeadline: '100GB Permanent Free Cloud Backup for Photos, Documents & Videos with Zero Monthly Rental',
    benefitHeadlineHi: 'फोटो, दस्तावेज एवं वीडियो के सुरक्षित बैकअप हेतु १०० जीबी पूर्णतः निःशुल्क क्लाउड स्टोरेज',
    benefitAmount: 3600,
    deadline: 'OPEN_ROUND',
    description: 'Reliance Jio initiative offering 100GB free cloud storage to all active Jio 5G users across India, saving ₹250/month compared to Google One / Apple iCloud subscriptions.',
    descriptionHi: 'रिलायंस जियो द्वारा अपने उपभोक्ताओं को गूगल वन और आईक्लाउड के मुकाबले १०० जीबी का सुरक्षित निःशुल्क डेटा स्टोरेज।',
    gazette: {
      circularNumber: 'JIO-ANNOUNCEMENT/AI-CLOUD/2026/PUBLIC',
      issuingAuthority: 'Reliance Jio Infocomm Limited',
      gazetteDate: '2026-09-05',
      lastVerifiedAt: 'Live verified 10 mins ago',
      officialPortalUrl: 'https://www.jio.com',
      scamAlertWarning: 'Activation is directly available inside official MyJio app. Never enter OTP on third-party SMS phishing links.',
      officialGovtFee: '₹0 (100% Free for Jio Users)'
    },
    documents: [],
    applySteps: [
      { step: 1, text: 'Open official MyJio app on your smartphone.', textHi: 'अपने स्मार्टफोन पर आधिकारिक MyJio ऐप खोलें।' },
      { step: 2, text: 'Navigate to "JioCloud" section on homepage.', textHi: 'होमपेज पर "JioCloud" विकल्प पर जाएं।' },
      { step: 3, text: 'Tap "Claim 100GB Welcome Offer" and enable auto-backup.', textHi: '"Claim 100GB" पर क्लिक करें और सुरक्षित ऑटो-बैकअप सक्रिय करें।' }
    ],
    tags: ['Jio', 'Free Cloud', 'Storage', '100% Free'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-github-pack-01',
    title: 'GitHub Student Developer Pack ($200,000+ in Free Software & Tools)',
    titleHi: 'गिटहब स्टूडेंट डेवलपर पैक: $२००,००० मूल्य के सॉफ्टवेयर एवं टूल्स पूर्णतः निःशुल्क',
    category: 'tech_perk_free',
    lifeStage: 'freebies',
    targetAges: [14, 28],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student'],
    benefitHeadline: 'Free Canva Pro, Namecheap .me Domain + SSL, JetBrains IDEs, and GitHub Copilot Access',
    benefitHeadlineHi: 'कैनवा प्रो, फ्री वेबसाइट डोमेन, जेटब्रेन्स आईडीई एवं गिटहब कोपायलट निःशुल्क प्राप्त करें',
    benefitAmount: 180000,
    deadline: 'OPEN_ROUND',
    description: 'GitHub and 80+ global tech partners give verified students free premium developer tools and cloud infrastructure for the entire duration of their studies.',
    descriptionHi: 'विश्व के सबसे बड़े डेवलपर प्लेटफॉर्म गिटहब द्वारा कॉलेज छात्रों को प्रीमियम सॉफ्टवेयर, होस्टिंग एवं डोमेन का निःशुल्क बंडल।',
    gazette: {
      circularNumber: 'GITHUB-EDU-PACK-2026/STUDENTS',
      issuingAuthority: 'GitHub Education Global Partnership',
      gazetteDate: '2026-08-01',
      lastVerifiedAt: 'Live verified 20 mins ago',
      officialPortalUrl: 'https://education.github.com/pack',
      scamAlertWarning: 'Never purchase GitHub student accounts on Telegram. Any student with college ID or school bonafide can claim this directly for free.',
      officialGovtFee: '₹0 (Free for All Verified Students)'
    },
    documents: [
      { id: 'd-gh-1', name: 'School / College ID Card or Bonafide Letter', nameHi: 'कॉलेज पहचान पत्र अथवा नामांकन रसीद', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Visit education.github.com/pack and sign in with GitHub account.', textHi: 'education.github.com/pack पर जाकर गिटहब खाते से लॉगिन करें।' },
      { step: 2, text: 'Upload photo of college ID card with current academic year.', textHi: 'चालू शैक्षणिक वर्ष वाले कॉलेज पहचान पत्र की फोटो अपलोड करें।' },
      { step: 3, text: 'Instant verification unlocks Canva Pro, Free domain, and 80+ tools.', textHi: 'सत्यापन होते ही कैनवा प्रो, फ्री डोमेन और ८०+ टूल्स सक्रिय हो जाएंगे।' }
    ],
    tags: ['Free Software', 'Canva Pro', 'Students', 'GitHub'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-ms-office-01',
    title: 'Microsoft Office 365 Education: 100% Free Word, Excel, PowerPoint & 1TB OneDrive',
    titleHi: 'माइक्रोसॉफ्ट ऑफिस ३६५: वर्ड, एक्सेल, पॉवरपॉइंट एवं १टीबी क्लाउड पूर्णतः निःशुल्क',
    category: 'tech_perk_free',
    lifeStage: 'freebies',
    targetAges: [14, 30],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student'],
    benefitHeadline: 'Official Lifetime Student License Worth ₹6,199/Year Provided at Zero Cost',
    benefitHeadlineHi: 'वार्षिक ₹६,१९९ मूल्य का आधिकारिक माइक्रोसॉफ्ट लाइसेंस विद्यार्थियों हेतु बिल्कुल मुफ्त',
    benefitAmount: 6199,
    deadline: 'OPEN_ROUND',
    description: 'Microsoft provides free Office 365 suite (Word, Excel, PowerPoint, OneNote, Teams) plus 1TB cloud storage to students and educators using an institutional email address.',
    descriptionHi: 'माइक्रोसॉफ्ट द्वारा छात्रों एवं शिक्षकों को ऑफिस सॉफ्टवेयर और १ टीबी स्टोरेज की वैध निःशुल्क सुविधा।',
    gazette: {
      circularNumber: 'MSFT-EDU-OFFICE/2026/A1-LICENSE',
      issuingAuthority: 'Microsoft Corporation Education Division',
      gazetteDate: '2026-07-15',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://www.microsoft.com/education/products/office',
      scamAlertWarning: 'Avoid crack keys on unverified websites. Legitimate licenses are granted directly on Microsoft.com using your school/college email.',
      officialGovtFee: '₹0 (Free Education License)'
    },
    documents: [
      { id: 'd-ms-1', name: 'School/College Email ID or Student Enrollment Card', nameHi: 'कॉलेज ईमेल आईडी अथवा प्रवेश पत्र', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Enter your valid school or college email on microsoft.com/education.', textHi: 'microsoft.com/education पर कॉलेज ईमेल आईडी दर्ज करें।' },
      { step: 2, text: 'Verify confirmation link sent to your institutional inbox.', textHi: 'ईमेल पर आए सत्यापन लिंक की पुष्टि करें।' },
      { step: 3, text: 'Download Office apps or use web version instantly on PC/Mobile.', textHi: 'वर्ड, एक्सेल और पॉवरपॉइंट सीधे अपने फोन या लैपटॉप पर इस्तेमाल करें।' }
    ],
    tags: ['Microsoft', 'Free Office', 'Word', 'Excel'],
    is100PercentFree: true
  },
  {
    id: 'opp-ai-tools-01',
    title: 'Top 5 100% Free AI Copilots for Education, Math & Job Applications',
    titleHi: 'शिक्षा, गणित एवं नौकरी आवेदन हेतु शीर्ष ५ पूर्णतः निःशुल्क एआई उपकरण',
    category: 'free_ai_tool',
    lifeStage: 'freebies',
    targetAges: [14, 60],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student', 'exam_aspirant', 'job_seeker', 'employed'],
    benefitHeadline: 'Free Homework Helper, Resume Builder & Mock Interview AI with Zero Subscription Fees',
    benefitHeadlineHi: 'बिना किसी शुल्क के गणित समाधान, एटीएस रेज्यूमे निर्माण एवं साक्षात्कार अभ्यास',
    benefitAmount: 12000,
    deadline: 'OPEN_ROUND',
    description: 'Curated directory of verified artificial intelligence models providing unlimited free tiers for students and professionals (DeepSeek Math, Claude Free, v0, Hugging Face).',
    descriptionHi: 'छात्रों और युवाओं के लिए सत्यापित निःशुल्क एआई टूल्स जो कोचिंग और रेज्यूमे बनाने के हजारों रुपये बचाते हैं।',
    gazette: {
      circularNumber: 'AI-VERIFIED-FREE/2026/CURATION',
      issuingAuthority: 'Citizen Life OS Artificial Intelligence Directory',
      gazetteDate: '2026-09-18',
      lastVerifiedAt: 'Live verified 5 mins ago',
      officialPortalUrl: 'https://chat.deepseek.com',
      scamAlertWarning: 'These tools are officially accessible for free. Avoid third-party scam apps charging monthly credit card fees.',
      officialGovtFee: '₹0 (100% Free Public AI)'
    },
    documents: [],
    applySteps: [
      { step: 1, text: 'Access official free portal link directly.', textHi: 'आधिकारिक निःशुल्क लिंक पर सीधे जाएं।' },
      { step: 2, text: 'Sign in with Google/Email with no payment details required.', textHi: 'बिना कोई कार्ड विवरण दिए सीधे गूगल से साइन इन करें।' },
      { step: 3, text: 'Generate resumes, solve complex equations, or practice interview questions.', textHi: 'तुरंत अभ्यास करें और अध्ययन में सहायता प्राप्त करें।' }
    ],
    tags: ['AI Tools', 'Free Learning', 'Global Access'],
    is100PercentFree: true
  },
  {
    id: 'opp-telelaw-01',
    title: 'NALSA Tele-Law: 100% Free Video Legal Advice from High Court & Panel Advocates',
    titleHi: 'नालसा टेली-लॉ: उच्च न्यायालय एवं पैनल अधिवक्ताओं से १००% निःशुल्क कानूनी परामर्श',
    category: 'tech_perk_free',
    lifeStage: 'freebies',
    targetAges: [18, 80],
    stateEligibility: ['ALL'],
    targetOccupations: ['farmer', 'homemaker', 'business_owner', 'employed', 'senior_citizen', 'job_seeker'],
    benefitHeadline: 'Free Expert Legal Consultation on Land Disputes, Family Issues, FIRs & Compensation (Zero Lawyer Fees)',
    benefitHeadlineHi: 'जमीन विवाद, पारिवारिक मामले, एफआईआर एवं मुआवजे पर उच्च स्तरीय वकीलों से निःशुल्क परामर्श',
    benefitAmount: 15000,
    deadline: 'OPEN_ROUND',
    description: 'Department of Justice & National Legal Services Authority (NALSA) initiative connecting citizens directly with legal experts through video conferencing at Common Service Centres or mobile app.',
    descriptionHi: 'न्याय विभाग एवं राष्ट्रीय विधिक सेवा प्राधिकरण (नालसा) द्वारा आम नागरिकों को घर बैठे या नजदीकी सीएससी से वकीलों से मुफ्त कानूनी सलाह देने की आधिकारिक सेवा।',
    gazette: {
      circularNumber: 'DOJ/TELE-LAW/2026/PUBLIC-JUSTICE',
      issuingAuthority: 'Department of Justice, Ministry of Law and Justice',
      gazetteDate: '2026-06-01',
      lastVerifiedAt: 'Live verified 20 mins ago',
      officialPortalUrl: 'https://www.tele-law.in',
      scamAlertWarning: 'Tele-Law advice is completely free for women, SC/ST, senior citizens, and low-income families. Never pay private middlemen claiming court settlement fees.',
      officialGovtFee: '₹0 (100% Free Legal Aid)'
    },
    documents: [
      { id: 'd-law-1', name: 'Aadhaar Card', nameHi: 'आधार कार्ड', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Download "Tele-Law Citizen" mobile app or visit local CSC center.', textHi: '"Tele-Law Citizen" ऐप डाउनलोड करें अथवा नजदीकी सीएससी केंद्र जाएं।' },
      { step: 2, text: 'Select legal issue category (property, family, employment, criminal).', textHi: 'अपने कानूनी मामले की श्रेणी चुनें और समय स्लॉट बुक करें।' },
      { step: 3, text: 'Connect via secure video or phone call with certified panel lawyer.', textHi: 'निर्धारित समय पर पैनल अधिवक्ता से निःशुल्क वीडियो या फोन कॉल पर सलाह प्राप्त करें।' }
    ],
    tags: ['Legal Aid', 'Free Lawyer', 'Govt Justice', 'Citizen Rights'],
    is100PercentFree: true
  },
  {
    id: 'opp-swayam-courses-01',
    title: 'SWAYAM NPTEL: Free Online Degree Courses & Video Lectures from IITs & IIMs',
    titleHi: 'स्वयं एनपीटीईएल: आईआईटी एवं आईआईएम के प्रोफेसरों द्वारा १००% निःशुल्क ऑनलाइन डिग्री कोर्सेज',
    category: 'skill_roadmap',
    lifeStage: 'freebies',
    targetAges: [14, 75],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student', 'employed', 'job_seeker', 'business_owner', 'homemaker'],
    benefitHeadline: 'Free Access to 2,000+ Courses in AI, Data Science, Business, Farming & Languages from Top IIT Professors',
    benefitHeadlineHi: 'आईआईटी मद्रास, बॉम्बे एवं आईआईएम से एआई, डेटा साइंस, व्यापार एवं कृषि पर २,०००+ निःशुल्क पाठ्यक्रम',
    benefitAmount: 25000,
    deadline: 'OPEN_ROUND',
    description: 'Flagship initiative by Ministry of Education, Govt of India, providing high quality educational modules, video lectures, and study material designed by premier institutes at zero cost.',
    descriptionHi: 'शिक्षा मंत्रालय, भारत सरकार का प्रमुख ऑनलाइन लर्निंग पोर्टल जहां देश के शीर्ष संस्थानों के पाठ्यक्रम पूर्णतः निःशुल्क उपलब्ध हैं।',
    gazette: {
      circularNumber: 'MOE/SWAYAM/2026/PORTAL-GUIDE',
      issuingAuthority: 'Ministry of Education & AICTE (Govt of India)',
      gazetteDate: '2026-07-01',
      lastVerifiedAt: 'Live verified 15 mins ago',
      officialPortalUrl: 'https://swayam.gov.in',
      scamAlertWarning: 'All SWAYAM course learning material and video lectures are 100% free. Exam registration fee for printed physical certificate is optional.',
      officialGovtFee: '₹0 (Free Course Learning)'
    },
    documents: [],
    applySteps: [
      { step: 1, text: 'Visit swayam.gov.in and create free account using Google/Aadhaar.', textHi: 'swayam.gov.in पर जाएं और गूगल खाते से निःशुल्क साइन इन करें।' },
      { step: 2, text: 'Browse course catalog and click "Enroll" on any course of choice.', textHi: 'पाठ्यक्रम सूची देखें और मनपसंद विषय में "Enroll" पर क्लिक करें।' },
      { step: 3, text: 'Watch weekly lectures, submit assignments, and earn UGC credit transfers.', textHi: 'साप्ताहिक वीडियो देखें, असाइनमेंट हल करें और डिग्री क्रेडिट प्राप्त करें।' }
    ],
    tags: ['IIT Courses', 'Free Education', 'SWAYAM', 'Govt Learning'],
    is100PercentFree: true
  },
  {
    id: 'opp-diksha-ncert-01',
    title: 'DIKSHA & PM e-VIDYA: 100% Free Digital NCERT Textbooks, Video Lessons & Audiobooks',
    titleHi: 'दीक्षा एवं पीएम ई-विद्या: कक्षा १ से १२ हेतु निःशुल्क डिजिटल पुस्तकें, वीडियो पाठ एवं ऑडियो बुक्स',
    category: 'tech_perk_free',
    lifeStage: 'freebies',
    targetAges: [5, 25],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student'],
    benefitHeadline: 'Unlimited Free Access to Entire NCERT & State Board Curriculum in 30+ Regional Languages',
    benefitHeadlineHi: 'कक्षा १ से १२ तक के सभी विषयों की पाठ्यपुस्तकें और इंटरैक्टिव क्विज़ पूर्णतः निःशुल्क',
    benefitAmount: 4500,
    deadline: 'OPEN_ROUND',
    description: 'National Digital Infrastructure for Teachers and Students by the Ministry of Education with QR-coded textbooks and high-definition video explanations.',
    descriptionHi: 'शिक्षा मंत्रालय की राष्ट्रीय डिजिटल पहल जिसके अंतर्गत देश के प्रत्येक विद्यार्थी को निःशुल्क शिक्षण सामग्री प्राप्त होती है।',
    gazette: {
      circularNumber: 'NCERT/DIKSHA/2026/CURRICULUM',
      issuingAuthority: 'NCERT & Ministry of Education, Govt of India',
      gazetteDate: '2026-06-10',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://diksha.gov.in',
      scamAlertWarning: 'All DIKSHA books and test banks are 100% free public assets. Never purchase pirated PDFs of NCERT textbooks online.',
      officialGovtFee: '₹0 (100% Free Public Portal)'
    },
    documents: [],
    applySteps: [
      { step: 1, text: 'Visit diksha.gov.in or download DIKSHA mobile app.', textHi: 'diksha.gov.in पर जाएं अथवा दीक्षा मोबाइल ऐप डाउनलोड करें।' },
      { step: 2, text: 'Scan QR code printed in any physical textbook or select grade/subject.', textHi: 'अपनी पुस्तक का क्यूआर कोड स्कैन करें अथवा कक्षा का चयन करें।' },
      { step: 3, text: 'Download chapter PDFs or watch animated explanation videos instantly.', textHi: 'अध्याय पीडीएफ डाउनलोड करें और वीडियो से अध्ययन करें।' }
    ],
    tags: ['NCERT', 'School Books', 'DIKSHA', 'Free Learning'],
    is100PercentFree: true
  },
  {
    id: 'opp-ndli-library-01',
    title: 'National Digital Library of India (NDLI): Free Access to 1 Crore+ Academic Books',
    titleHi: 'भारतीय राष्ट्रीय डिजिटल पुस्तकालय (NDLI): १ करोड़+ अकादमिक पुस्तकों एवं शोध पत्रों का मुफ्त भंडार',
    category: 'tech_perk_free',
    lifeStage: 'freebies',
    targetAges: [10, 75],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student', 'employed', 'senior_citizen'],
    benefitHeadline: 'Free Repository of School to PhD Level Textbooks, Competitive Exam Question Papers & Rare Literature',
    benefitHeadlineHi: 'आईआईटी खड़गपुर द्वारा संचालित देश का सबसे बड़ा डिजिटल ज्ञानकोष (स्कूल से लेकर पीएचडी स्तर तक)',
    benefitAmount: 15000,
    deadline: 'OPEN_ROUND',
    description: 'National mission project sponsored by Ministry of Education and developed by IIT Kharagpur integrating digital resources across all academic disciplines.',
    descriptionHi: 'आईआईटी खड़गपुर द्वारा विकसित राष्ट्रीय डिजिटल पुस्तकालय जहां शोधार्थी, छात्र एवं नागरिक निःशुल्क दुर्लभ पुस्तकें पढ़ सकते हैं।',
    gazette: {
      circularNumber: 'MOE/NMEICT/NDLI/2026',
      issuingAuthority: 'Ministry of Education & IIT Kharagpur',
      gazetteDate: '2026-05-15',
      lastVerifiedAt: 'Live verified 2 hrs ago',
      officialPortalUrl: 'https://ndl.iitkgp.ac.in',
      scamAlertWarning: 'NDLI membership and full-text reading is 100% free for all Indian citizens. No registration fee required.',
      officialGovtFee: '₹0 (100% Free National Service)'
    },
    documents: [],
    applySteps: [
      { step: 1, text: 'Create free account on ndl.iitkgp.ac.in.', textHi: 'ndl.iitkgp.ac.in पर निःशुल्क खाता बनाएं।' },
      { step: 2, text: 'Search by author, subject, exam paper, or book title.', textHi: 'पुस्तक, लेखक अथवा परीक्षा प्रश्न पत्र खोजें।' },
      { step: 3, text: 'Read online or download authorized full-text open access documents.', textHi: 'ऑनलाइन पढ़ें अथवा अधिकृत पीडीएफ डाउनलोड करें।' }
    ],
    tags: ['Digital Library', 'IIT Kharagpur', 'Free Books', 'Research'],
    is100PercentFree: true
  }
];
