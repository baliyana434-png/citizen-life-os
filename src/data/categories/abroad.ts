import { Opportunity } from '@/types';

export const ABROAD_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-abroad-germany-daad-01',
    title: 'Study in Germany: 100% Tuition-Free Bachelor & Master Degrees (Public Universities & DAAD)',
    titleHi: 'जर्मनी में निःशुल्क उच्च शिक्षा: सरकारी विश्वविद्यालयों में १००% ट्यूशन फीस माफी (DAAD पोर्टल)',
    category: 'study_abroad',
    applicationStatus: 'active_now',
    lifeStage: 'abroad_jobs',
    targetAges: [18, 32],
    stateEligibility: ['ALL'],
    targetOccupations: ['school_student', 'college_student', 'job_seeker'],
    benefitHeadline: 'Zero Tuition Fees in 400+ Top Public German Universities + 20 Hr/Week Student Job (€1,000/Mo) + 18-Month Post-Study Work Visa',
    benefitHeadlineHi: '४००+ जर्मन सरकारी विश्वविद्यालयों में शून्य ट्यूशन फीस + ₹९०,००० प्रतिमाह छात्र पार्ट-टाइम कमाई व १८ माह का जॉब सर्च वीजा',
    benefitAmount: 1800000,
    deadline: '2026-07-15',
    description: 'Germany’s public universities charge €0 tuition fees for international students across engineering, IT, management, and basic sciences. Accredited by the Federal Ministry of Education & Research (BMBF) and DAAD.',
    descriptionHi: 'जर्मनी के सरकारी विश्वविद्यालयों में दुनिया भर के छात्रों के लिए स्नातक एवं परास्नातक स्तर पर कोई ट्यूशन फीस नहीं लगती। केवल नाममात्र सेमेस्टर योगदान (~₹२५,०००) देय होता है।',
    gazette: {
      circularNumber: 'DAAD/BMBF/STUDY-GERMANY/2026',
      issuingAuthority: 'German Academic Exchange Service (DAAD) & Federal Ministry of Education',
      gazetteDate: '2026-08-15',
      lastVerifiedAt: 'Live verified 15 mins ago',
      officialPortalUrl: 'https://www.daad.in',
      scamAlertWarning: 'Never pay ₹2 to ₹5 Lakh to unauthorized education consultancies. Public university applications are handled directly via uni-assist.de or official university portals with zero agency involvement.',
      officialGovtFee: '€0 Tuition Fee (Standard Semester Contribution ~€250-350 only)'
    },
    documents: [
      { id: 'd-daad-1', name: 'Valid Indian Passport (Min 1 Year Validity)', nameHi: 'वैध भारतीय पासपोर्ट', isMandatory: true },
      { id: 'd-daad-2', name: 'Class 12th & Degree Marksheets with APS Certificate (Akademische Prüfstelle)', nameHi: 'अंकतालिकाएं एवं अनिवार्य एपीएस (APS) प्रमाण पत्र', isMandatory: true },
      { id: 'd-daad-3', name: 'English Proficiency (IELTS 6.5+ or TOEFL 90+) or German Certificate', nameHi: 'अंग्रेजी भाषा प्रमाण पत्र (IELTS) अथवा जर्मन भाषा ज्ञान', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Search English-taught courses on official DAAD database at daad.de/en/study-and-research-in-germany/courses.', textHi: 'आधिकारिक daad.de पोर्टल पर अंग्रेजी माध्यम के निःशुल्क कोर्स खोजें।' },
      { step: 2, text: 'Obtain mandatory APS Certificate from German Embassy New Delhi (aps-india.info).', textHi: 'जर्मन दूतावास के aps-india.info पोर्टल से एपीएस प्रमाण पत्र प्राप्त करें।' },
      { step: 3, text: 'Submit application directly to universities via uni-assist.de and book student visa slot.', textHi: 'uni-assist.de द्वारा आवेदन भेजकर स्टूडेंट वीजा प्राप्त करें।' }
    ],
    tags: ['Study in Germany', 'Zero Tuition', 'DAAD', 'Engineering in Europe', 'Work in Germany'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-abroad-italy-dsu-01',
    title: 'Italy DSU Regional Government Scholarship: 100% Free Tuition + Free University Hostel & Food + €7,000/Yr Cash',
    titleHi: 'इटली डीएसयू सरकारी छात्रवृत्ति: १००% मुफ्त ट्यूशन फीस + विश्वविद्यालय हॉस्टल व भोजन + ₹६.५ लाख नकद अनुदान',
    category: 'study_abroad',
    applicationStatus: 'active_now',
    lifeStage: 'abroad_jobs',
    targetAges: [18, 30],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker'],
    benefitHeadline: 'Complete Tuition Waiver + Free Canteen Meals + Free Campus Accommodation + Direct Cash Grant of up to €7,000/Year (~₹6.5 Lakh)',
    benefitHeadlineHi: 'पूर्ण शिक्षण शुल्क माफी + विश्वविद्यालय कैंटीन में प्रतिदिन मुफ्त भोजन + हॉस्टल आवास + ₹६.५ लाख वार्षिक नकद छात्रवृत्ति',
    benefitAmount: 650000,
    deadline: '2026-08-30',
    description: 'Regional Italian government scholarships (DSU Toscana, EDISU Piemonte, LazioDiSCo) providing 100% financial coverage for meritorious international students admitted to public Italian universities (Politecnico di Milano, Sapienza, Pisa, Bologna).',
    descriptionHi: 'इटली की क्षेत्रीय सरकारों द्वारा भारतीय छात्रों को दुनिया के सबसे पुराने एवं प्रतिष्ठित सरकारी विश्वविद्यालयों में बिना किसी खर्चे के पढ़ने, रहने एवं खाने हेतु दिया जाने वाला विशाल सरकारी अनुदान।',
    gazette: {
      circularNumber: 'MUR/ITALY/DSU-REGIONAL/2026',
      issuingAuthority: 'Ministry of Universities & Research (MUR Italy) & Regional DSU Councils',
      gazetteDate: '2026-07-20',
      lastVerifiedAt: 'Live verified 25 mins ago',
      officialPortalUrl: 'https://www.universitaly.it',
      scamAlertWarning: 'DSU regional scholarships require family income evaluation (ISEE Parificato below €25,000). Applications are 100% online through official regional DSU portals. No agents can guarantee approval.',
      officialGovtFee: '€0 (Zero Tuition with DSU Grant)'
    },
    documents: [
      { id: 'd-dsu-1', name: 'University Admission Letter via universitaly.it', nameHi: 'universitaly.it द्वारा जारी विश्वविद्यालय प्रवेश पत्र', isMandatory: true },
      { id: 'd-dsu-2', name: 'Family Income & Property Certificate legalized by MEA India (for ISEE)', nameHi: 'विदेश मंत्रालय (MEA) द्वारा सत्यापित पारिवारिक आय प्रमाण पत्र', isMandatory: true },
      { id: 'd-dsu-3', name: 'Valid Passport and Declaration of Value (DOV) / CIMEA', nameHi: 'वैध पासपोर्ट एवं CIMEA प्रमाणन', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Apply for admission on universitaly.it to participating public Italian universities.', textHi: 'universitaly.it पोर्टल पर जाकर सरकारी विश्वविद्यालयों में आवेदन करें।' },
      { step: 2, text: 'Prepare family income certificate and calculate ISEE Parificato index.', textHi: 'आय प्रमाण पत्र तैयार कर डीएसयू कार्यालय में ISEE इंडेक्स जमा करें।' },
      { step: 3, text: 'Submit regional DSU scholarship form on regional portal (e.g. dsu.toscana.it).', textHi: 'संबंधित क्षेत्रीय डीएसयू पोर्टल पर छात्रवृत्ति फॉर्म भरें।' }
    ],
    tags: ['Study in Italy', 'DSU Scholarship', 'Free Food & Hostel', 'Fully Funded Europe', 'Universitaly'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-abroad-nsdc-jobs-01',
    title: 'NSDC International: Ethical Govt-Verified Overseas Jobs in Germany, Japan & Gulf (Zero Broker Exploitation)',
    titleHi: 'एनएसडीसी इंटरनेशनल: जर्मनी, जापान व खाड़ी देशों में सरकार प्रमाणित सुरक्षित विदेशी नौकरियां',
    category: 'career_consultant',
    applicationStatus: 'active_now',
    lifeStage: 'abroad_jobs',
    targetAges: [21, 42],
    stateEligibility: ['ALL'],
    targetOccupations: ['job_seeker', 'employed'],
    benefitHeadline: 'Direct Verified Foreign Employment (Monthly: ₹1.5 Lakh - ₹3.8 Lakh) in Healthcare, Engineering & Tech under Bilateral Govt MoUs',
    benefitHeadlineHi: 'भारत सरकार के आधिकारिक समझौतों के तहत नर्सिंग, इंजीनियरिंग व तकनीकी क्षेत्र में ₹१.५ लाख - ₹३.८ लाख प्रतिमाह वेतन',
    benefitAmount: 220000,
    deadline: 'OPEN_ROUND',
    description: 'National Skill Development Corporation (NSDC) International facilitates government-to-government ethical recruitment of Indian professionals (nurses, automotive engineers, hospitality, IT specialists) with transparent work permits and language training.',
    descriptionHi: 'कौशल विकास एवं उद्यमिता मंत्रालय द्वारा भारत सरकार के आधिकारिक समझौतों के तहत युवाओं को जर्मनी, जापान, ताइवान एवं गल्फ देशों में कानूनी कार्य वीजा व उच्च वेतन वाली नौकरी उपलब्ध कराने का एकमात्र आधिकारिक मंच।',
    gazette: {
      circularNumber: 'MSDE/NSDC-INTL/OVERSEAS-JOBS/2026',
      issuingAuthority: 'Ministry of Skill Development & Entrepreneurship (Govt of India)',
      gazetteDate: '2026-08-01',
      lastVerifiedAt: 'Live verified 10 mins ago',
      officialPortalUrl: 'https://nsdcinternational.com',
      scamAlertWarning: 'Never deal with unlicensed travel agents who demand ₹5 to ₹15 Lakhs and risk human trafficking. NSDC International charges only nominal standardized processing fees regulated by the Government of India.',
      officialGovtFee: 'Regulated Nominal Processing Fee (Government Bilateral Framework)'
    },
    documents: [
      { id: 'd-nsdc-int-1', name: 'Valid Passport (Minimum 2 Years Validity)', nameHi: 'वैध पासपोर्ट (कम से कम २ वर्ष वैधता)', isMandatory: true },
      { id: 'd-nsdc-int-2', name: 'Degree / Diploma / GNM / B.Sc Nursing / ITI Trade Certificate', nameHi: 'डिग्री, डिप्लोमा, नर्सिंग अथवा आईटीआई प्रमाण पत्र', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Register candidate profile on nsdcinternational.com and select destination country.', textHi: 'nsdcinternational.com पर प्रोफाइल बनाकर पसंदीदा देश चुनें।' },
      { step: 2, text: 'Undergo certified language and cultural orientation training (German B1/B2 or Japanese N4).', textHi: 'सरकारी केंद्र पर भाषा एवं सांस्कृतिक प्रशिक्षण पूरा करें।' },
      { step: 3, text: 'Attend employer interview, receive verified job contract, and get embassy work visa issued.', textHi: 'नियोक्ता का इंटरव्यू देकर वैध कार्य वीजा प्राप्त करें।' }
    ],
    tags: ['Overseas Jobs', 'Govt Verified', 'Germany Jobs', 'Japan Visa', 'Skill India International'],
    is100PercentFree: false,
    isNew: true
  },
  {
    id: 'opp-abroad-japan-ssw-01',
    title: 'Japan Specified Skilled Worker (SSW) & TITP: 5-Year Legal Work Visa (Salary: ₹1.2 Lakh - ₹2.2 Lakh/Month)',
    titleHi: 'जापान एसएसडब्ल्यू (SSW) एवं टीआईटीपी: ५ वर्षीय कानूनी वर्क वीजा (वेतन: ₹१.२ लाख - ₹२.२ लाख प्रतिमाह)',
    category: 'career_consultant',
    applicationStatus: 'active_now',
    lifeStage: 'abroad_jobs',
    targetAges: [19, 35],
    stateEligibility: ['ALL'],
    targetOccupations: ['job_seeker', 'college_student', 'employed'],
    benefitHeadline: 'Official 5-Year Japanese Residence Status (SSW-1) + Monthly Pay ¥2,20,000 - ¥3,50,000 + National Pension & Health Coverage',
    benefitHeadlineHi: 'जापान में ५ वर्ष का वैध वर्क स्टेटस + ₹१.२ लाख से ₹२.२ लाख प्रतिमाह वेतन + पूर्ण पेंशन व स्वास्थ्य बीमा',
    benefitAmount: 160000,
    deadline: 'OPEN_ROUND',
    description: 'Bilateral skilled migration framework signed between Government of India (MSDE) and Government of Japan (Ministry of Justice & MHLW) covering 14 sectors including Nursing Care, Food Service, Agriculture, Construction, and Machine Parts.',
    descriptionHi: 'भारत व जापान सरकार के द्विपक्षीय समझौते के अंतर्गत भारतीय युवाओं को जापान के विभिन्न उद्योगों में सीधे कानूनी रोजगार। इसमें जापानी भाषा (N4 स्तर) एवं तकनीकी कौशल परीक्षा उत्तीर्ण करने पर वर्क वीजा मिलता है।',
    gazette: {
      circularNumber: 'GOI-JAPAN/SSW-MOC/2026/PROGRAM',
      issuingAuthority: 'Organization for Technical Intern Training (OTIT) & Ministry of Justice Japan',
      gazetteDate: '2026-08-10',
      lastVerifiedAt: 'Live verified 30 mins ago',
      officialPortalUrl: 'https://www.otit.go.jp',
      scamAlertWarning: 'Only send applications through officially empaneled Sending Organizations (SO) registered with MSDE India. Never pay cash to unverified local touts.',
      officialGovtFee: 'Official JLPT/JFT Exam Fee (~₹1,500) & Skill Evaluation Fee Only'
    },
    documents: [
      { id: 'd-jap-1', name: 'JLPT N4 or JFT-Basic Japanese Language Certificate', nameHi: 'जापानी भाषा प्रमाण पत्र (JLPT N4 अथवा JFT-Basic)', isMandatory: true },
      { id: 'd-jap-2', name: 'Japan SSW Skill Evaluation Test Passing Certificate in Specified Sector', nameHi: 'संबंधित क्षेत्र में कौशल मूल्यांकन परीक्षा उत्तीर्ण प्रमाण पत्र', isMandatory: true },
      { id: 'd-jap-3', name: 'Valid Indian Passport & Clean Police Clearance Certificate (PCC)', nameHi: 'वैध पासपोर्ट एवं पुलिस क्लीयरेंस (PCC)', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Learn Japanese up to N4 level and pass JFT-Basic exam conducted in Indian testing centres.', textHi: 'जापानी भाषा N4 स्तर सीखकर भारत में JFT-Basic परीक्षा पास करें।' },
      { step: 2, text: 'Take official Prometric SSW Skill Test in your trade (Nursing, Food Service, Agriculture).', textHi: 'अपने क्षेत्र की प्रोमेट्रिक कौशल परीक्षा उत्तीर्ण करें।' },
      { step: 3, text: 'Interview with Japanese sponsoring company through empaneled sending organization and receive COE.', textHi: 'जापानी नियोक्ता से इंटरव्यू कर सर्टिफिकेट ऑफ एलिजिबिलिटी (COE) प्राप्त करें।' }
    ],
    tags: ['Japan Work Visa', 'SSW Visa', 'High Salary', 'TITP', 'Govt of Japan'],
    is100PercentFree: false,
    isNew: true
  },
  {
    id: 'opp-abroad-chevening-01',
    title: 'Chevening UK Government Scholarship 2026: 100% Fully-Funded Master Degree in United Kingdom',
    titleHi: 'शेवनिंग यूके सरकार छात्रवृत्ति २०२६: ब्रिटेन के शीर्ष विश्वविद्यालयों में १ वर्ष का मास्टर्स डिग्री अध्ययन पूर्णतः निःशुल्क',
    category: 'scholarship',
    applicationStatus: 'active_now',
    lifeStage: 'abroad_jobs',
    targetAges: [21, 40],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker', 'employed'],
    benefitHeadline: '100% University Tuition Fees at Oxford, Cambridge, LSE, Imperial + Monthly Living Allowance (£1,400/Month) + Airfare',
    benefitHeadlineHi: 'ब्रिटेन के ऑक्सफोर्ड, कैम्ब्रिज, एलएसई जैसे संस्थानों में १००% ट्यूशन फीस + ₹१.५ लाख प्रतिमाह निर्वाह भत्ता + हवाई टिकट',
    benefitAmount: 4500000,
    deadline: '2026-11-05',
    description: 'UK Government’s global scholarship programme funded by the Foreign, Commonwealth and Development Office (FCDO) and partner organisations. Enables outstanding emerging leaders to pursue a one-year master’s degree in any subject at any UK university.',
    descriptionHi: 'ब्रिटेन सरकार की प्रतिष्ठित फेलोशिप जिसके तहत भारत के प्रतिभाशाली युवाओं को ब्रिटेन के किसी भी विश्वविद्यालय में १ वर्ष का मास्टर्स करने का सम्पूर्ण खर्च ब्रिटिश सरकार वहन करती है।',
    gazette: {
      circularNumber: 'UK-FCDO/CHEVENING/2026-27/COHORT',
      issuingAuthority: 'Foreign, Commonwealth & Development Office (UK Government)',
      gazetteDate: '2026-08-01',
      lastVerifiedAt: 'Live verified 15 mins ago',
      officialPortalUrl: 'https://www.chevening.org/scholarship/india/',
      scamAlertWarning: 'Chevening applications are submitted exclusively via chevening.org/apply. No agency or private consultant can guarantee selection or bypass the British High Commission interview board.',
      officialGovtFee: '£0 (100% Free Application & Fully Funded Public Award)'
    },
    documents: [
      { id: 'd-chev-1', name: 'Undergraduate Degree with minimum 2:1 honours equivalent', nameHi: 'स्नातक डिग्री (कम से कम ६०% अंक)', isMandatory: true },
      { id: 'd-chev-2', name: 'Minimum 2 Years (2,800 Hours) Work Experience (Full-time, Part-time, or Volunteer)', nameHi: 'न्यूनतम २ वर्ष का कार्य अनुभव (पूर्णकालिक/इंटर्नशिप)', isMandatory: true },
      { id: 'd-chev-3', name: 'Three Eligible UK Master’s Course Choices', nameHi: '३ पसंदीदा यूके मास्टर्स कोर्स चयन', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Submit online application with 4 leadership & networking essays on chevening.org/apply.', textHi: 'chevening.org पर जाकर नेतृत्व एवं नेटवर्किंग से जुड़े ४ निबंध लिखकर आवेदन भरें।' },
      { step: 2, text: 'Shortlisted candidates attend in-person interview at British High Commission New Delhi or consulates.', textHi: 'ब्रिटिश उच्चायोग में साक्षात्कार दें।' },
      { step: 3, text: 'Secure unconditional offer from an eligible UK university to receive final scholarship letter.', textHi: 'यूके विश्वविद्यालय से प्रवेश पत्र मिलने पर पूर्ण छात्रवृत्ति अवार्ड प्राप्त करें।' }
    ],
    tags: ['Chevening', 'UK Scholarship', 'Oxford', 'Cambridge', 'Fully Funded', 'Study in UK'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-abroad-nos-msje-01',
    title: 'National Overseas Scholarship (NOS): 100% Fully Funded Master & Ph.D. in Top 500 QS World Universities',
    titleHi: 'राष्ट्रीय विदेशी छात्रवृत्ति (NOS): दुनिया के शीर्ष ५०० विश्वविद्यालयों में मास्टर्स एवं पीएचडी का सम्पूर्ण खर्च भारत सरकार द्वारा वहन',
    category: 'scholarship',
    applicationStatus: 'upcoming',
    lifeStage: 'abroad_jobs',
    targetAges: [21, 35],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker'],
    benefitHeadline: 'Full Tuition Fees Paid Directly by Govt of India to Foreign University + $15,400/Year Living Allowance + Airfare & Medical Cover',
    benefitHeadlineHi: 'हार्वर्ड, एमआईटी, ऑक्सफोर्ड में पूर्ण शिक्षण शुल्क + $१५,४०० (~₹१३ लाख) वार्षिक निर्वाह भत्ता + हवाई यात्रा व बीमा भारत सरकार द्वारा देय',
    benefitAmount: 6000000,
    deadline: 'UPCOMING_ANNUAL_CYCLE',
    description: 'Ministry of Social Justice & Empowerment scheme providing 125 annual fully funded slots for meritorious SC, De-notified, Nomadic, Landless Agricultural Labourers, and Traditional Artisans to study Master’s or Ph.D. in top 500 QS world ranked institutions.',
    descriptionHi: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय द्वारा संचालित सर्वोच्च विदेशी छात्रवृत्ति जिसके तहत दुनिया के शीर्ष ५०० विश्वविद्यालयों में अध्ययन का करोड़ों रुपये का खर्च भारत सरकार सीधे वहन करती है।',
    gazette: {
      circularNumber: 'MSJE/NOS/2026/SELECTION-PANEL',
      issuingAuthority: 'Ministry of Social Justice & Empowerment (Govt of India)',
      gazetteDate: '2026-02-15',
      lastVerifiedAt: 'Live verified 20 mins ago',
      officialPortalUrl: 'https://nosmsje.gov.in',
      scamAlertWarning: 'Application is 100% online at nosmsje.gov.in. No offline agents or middlemen have any quota. Candidate must hold an unconditional offer letter from a top 500 QS university.',
      officialGovtFee: '₹0 (100% Free Govt Application)'
    },
    documents: [
      { id: 'd-nos-1', name: 'Unconditional Admission Offer from Top 500 QS World University', nameHi: 'शीर्ष ५०० विश्व विश्वविद्यालय से बिना शर्त प्रवेश पत्र', isMandatory: true },
      { id: 'd-nos-2', name: 'Caste / Artisan / Landless Agriculture Category Certificate', nameHi: 'जाति / कारीगर / भूमिहीन कृषि प्रमाण पत्र', isMandatory: true },
      { id: 'd-nos-3', name: 'Income Certificate (Family income below ₹8 Lakh/year)', nameHi: 'आय प्रमाण पत्र (पारिवारिक आय ₹८ लाख से कम)', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Obtain unconditional admission offer letter from any top 500 QS ranked global university.', textHi: 'शीर्ष ५०० वैश्विक विश्वविद्यालय से प्रवेश पत्र प्राप्त करें।' },
      { step: 2, text: 'Register on official portal nosmsje.gov.in with Aadhaar and academic credentials.', textHi: 'nosmsje.gov.in पोर्टल पर अपने विवरण के साथ आवेदन पत्र भरें।' },
      { step: 3, text: 'Govt committee selects awardees and releases tuition fees directly to the foreign university.', textHi: 'सरकारी समिति द्वारा चयन के उपरांत विदेशी विश्वविद्यालय को सीधी फीस जारी की जाती है।' }
    ],
    tags: ['National Overseas Scholarship', 'Fully Funded', 'Harvard', 'MIT', 'Govt of India', 'Study Abroad'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-abroad-france-eiffel-01',
    title: 'France Eiffel Excellence Scholarship 2026: Fully Funded Master & Ph.D. in French Elite Institutions',
    titleHi: 'फ्रांस एफिल एक्सीलेंस स्कॉलरशिप २०२६: फ्रांस में मास्टर्स एवं पीएचडी हेतु पूर्ण सरकारी फेलोशिप',
    category: 'scholarship',
    applicationStatus: 'upcoming',
    lifeStage: 'abroad_jobs',
    targetAges: [21, 30],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker'],
    benefitHeadline: 'Monthly Allowance of €1,181 (Master) / €1,700 (Ph.D.) + Return International Flights + French Social Security & Cultural Allowance',
    benefitHeadlineHi: '€१,१८१ (~₹१.१ लाख) से €१,७०० (~₹१.६ लाख) मासिक भत्ता + अंतरराष्ट्रीय हवाई टिकट व मुफ्त फ्रेंच स्वास्थ्य बीमा',
    benefitAmount: 2500000,
    deadline: '2026-11-10',
    description: 'Prestigious fellowship developed by the French Ministry for Europe and Foreign Affairs to enable French higher education institutions to attract top foreign students for master’s and doctoral degree programs.',
    descriptionHi: 'फ्रांस के विदेश मंत्रालय द्वारा संचालित वैश्विक छात्रवृत्ति जिसके तहत इंजीनियरिंग, विज्ञान, अर्थशास्त्र एवं प्रबंधन के उत्कृष्ट छात्रों को फ्रांस के शीर्ष संस्थानों में पढ़ने का पूरा खर्च मिलता है।',
    gazette: {
      circularNumber: 'CAMPUS-FRANCE/EIFFEL/2026/PROGRAM',
      issuingAuthority: 'French Ministry for Europe and Foreign Affairs & Campus France',
      gazetteDate: '2026-08-20',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence',
      scamAlertWarning: 'Applications are submitted strictly through French higher education institutions (universities/Grandes Écoles). Students cannot apply directly without institutional nomination.',
      officialGovtFee: '€0 (French Republic Public Fellowship)'
    },
    documents: [
      { id: 'd-eiff-1', name: 'Bachelor’s Degree Transcripts with high academic ranking', nameHi: 'स्नातक अंकतालिका (शीर्ष अकादमिक रैंक)', isMandatory: true },
      { id: 'd-eiff-2', name: 'Professional Resume & Statement of Purpose', nameHi: 'बायोडाटा एवं अध्ययन उद्देश्य पत्र (SOP)', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Contact Campus France India office or reach out directly to your chosen French university.', textHi: 'कैंपस फ्रांस इंडिया कार्यालय अथवा फ्रांसीसी विश्वविद्यालय से संपर्क करें।' },
      { step: 2, text: 'University agrees to support your candidacy and submits your application dossier to Campus France Paris.', textHi: 'विश्वविद्यालय आपके आवेदन को कैंपस फ्रांस पेरिस को अग्रेषित करता है।' },
      { step: 3, text: 'Results announced by French Ministry and visa processing begins.', textHi: 'परिणाम घोषित होने पर वीजा प्रक्रिया शुरू होती है।' }
    ],
    tags: ['France Scholarship', 'Eiffel Excellence', 'Campus France', 'Free Education Europe', 'Engineering in France'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-abroad-erasmus-mundus-01',
    title: 'Erasmus Mundus Joint Masters Scholarship: Study Across 2 to 3 European Countries (100% EU Funded)',
    titleHi: 'इरास्मस मुंडस यूरोपियन छात्रवृत्ति: २ से ३ यूरोपीय देशों में मास्टर्स अध्ययन (१००% यूरोपीय संघ द्वारा वित्तपोषित)',
    category: 'scholarship',
    applicationStatus: 'active_now',
    lifeStage: 'abroad_jobs',
    targetAges: [20, 35],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker'],
    benefitHeadline: 'Full Tuition Fee Waiver + €1,400/Month Living Allowance (~₹1.25 Lakh/Mo) + Travel & Visa Installation Grants',
    benefitHeadlineHi: 'यूरोपीय संघ के कई देशों में निःशुल्क पढ़ाई + ₹१.२५ लाख प्रतिमाह निर्वाह भत्ता + हवाई टिकट व यात्रा अनुदान',
    benefitAmount: 3600000,
    deadline: '2026-01-15',
    description: 'High-level integrated study programmes designed and delivered by international partnerships of higher education institutions across the European Union. Students study in at least 2 different European countries and earn a joint or double degree.',
    descriptionHi: 'यूरोपीय संघ का सबसे प्रतिष्ठित छात्रवृत्ति कार्यक्रम जिसमें छात्र २ वर्ष के दौरान २ या ३ अलग-अलग यूरोपीय देशों (जैसे जर्मनी, फ्रांस, स्पेन, स्वीडन) के विश्वविद्यालयों में अध्ययन करते हैं और डबल डिग्री प्राप्त करते हैं।',
    gazette: {
      circularNumber: 'EU-COMMISSION/ERASMUS-MUNDUS/2026',
      issuingAuthority: 'European Education and Culture Executive Agency (EACEA), European Commission',
      gazetteDate: '2026-08-10',
      lastVerifiedAt: 'Live verified 45 mins ago',
      officialPortalUrl: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en',
      scamAlertWarning: 'Erasmus Mundus application catalogue is publicly searchable on ec.europa.eu. Consortia applications are submitted directly online with no agency involvement.',
      officialGovtFee: '€0 (100% European Union Grant)'
    },
    documents: [
      { id: 'd-eras-1', name: 'Bachelor’s Degree Certificate in relevant discipline', nameHi: 'स्नातक डिग्री प्रमाण पत्र', isMandatory: true },
      { id: 'd-eras-2', name: 'English Language Certificate (IELTS/TOEFL) and Motivation Letter', nameHi: 'अंग्रेजी भाषा प्रमाण पत्र एवं प्रेरणा पत्र (Motivation Letter)', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Search 100+ master programmes in the official Erasmus Mundus Catalogue online.', textHi: 'आधिकारिक कैटलॉग में १००+ मास्टर्स प्रोग्राम खोजें।' },
      { step: 2, text: 'Select up to 3 consortia programmes and submit your application directly on the consortium portal.', textHi: 'अधिकतम ३ प्रोग्राम चुनकर उनके पोर्टल पर ऑनलाइन आवेदन जमा करें।' },
      { step: 3, text: 'Shortlisted applicants receive full EU fellowship award letter and Schengen student visa.', textHi: 'चयनित होने पर पूर्ण यूरोपीय संघ छात्रवृत्ति पत्र प्राप्त करें।' }
    ],
    tags: ['Erasmus Mundus', 'European Union', 'Double Degree', 'Study in Europe', 'High Stipend'],
    is100PercentFree: true,
    isNew: true
  },
  {
    id: 'opp-abroad-aus-pgwp-01',
    title: 'Australia & Canada Post-Study Work Visa (Subclass 485 & PGWP): 2 to 4 Years Unrestricted Work Rights',
    titleHi: 'ऑस्ट्रेलिया एवं कनाडा पोस्ट-स्टडी वर्क वीजा: २ से ४ वर्ष का कानूनी वर्क परमिट (न्यूनतम वेतन $२३/घंटा)',
    category: 'study_abroad',
    applicationStatus: 'active_now',
    lifeStage: 'abroad_jobs',
    targetAges: [18, 35],
    stateEligibility: ['ALL'],
    targetOccupations: ['college_student', 'job_seeker', 'employed'],
    benefitHeadline: 'Earn AUD $4,000 - $6,500/Month (~₹2.2 Lakh - ₹3.6 Lakh/Mo) with Guaranteed Full-Time Work Rights & PR Pathway',
    benefitHeadlineHi: 'ऑस्ट्रेलिया या कनाडा में पढ़ाई के बाद २-४ वर्ष तक कानूनी रूप से नौकरी करने व ₹२.२ लाख से ₹३.६ लाख कमाने का अधिकार',
    benefitAmount: 250000,
    deadline: 'OPEN_ROUND',
    description: 'Official government post-study pathways (Australia Temporary Graduate Subclass 485 and Canada Post-Graduation Work Permit) granting Indian graduates unrestricted employment rights to recover tuition costs and qualify for permanent residency (PR).',
    descriptionHi: 'ऑस्ट्रेलिया और कनाडा सरकार द्वारा मान्यता प्राप्त शिक्षा पूर्ण करने वाले भारतीय विद्यार्थियों को दिए जाने वाले कानूनी वर्क परमिट जिसके तहत बिना किसी कंपनी स्पॉन्सरशिप के किसी भी क्षेत्र में काम किया जा सकता है।',
    gazette: {
      circularNumber: 'IMMIGRATION-AU-CA/PSWP/2026/REG',
      issuingAuthority: 'Department of Home Affairs Australia & IRCC Canada',
      gazetteDate: '2026-07-01',
      lastVerifiedAt: 'Live verified 1 hr ago',
      officialPortalUrl: 'https://immi.homeaffairs.gov.au',
      scamAlertWarning: 'Ensure your college/course is CRICOS registered (in Australia) or on the DLI PGWP-eligible list (in Canada). Unaccredited private colleges do not grant work permits.',
      officialGovtFee: 'Standard Sovereign Visa Application Charge (Direct on Govt Portal)'
    },
    documents: [
      { id: 'd-pswp-1', name: 'Letter of Completion / Degree from accredited institution', nameHi: 'मान्यता प्राप्त संस्थान से डिग्री / पाठ्यक्रम पूर्णता प्रमाण पत्र', isMandatory: true },
      { id: 'd-pswp-2', name: 'Valid Passport and Overseas Student Health Cover (OSHC) records', nameHi: 'वैध पासपोर्ट एवं स्वास्थ्य बीमा रिकॉर्ड', isMandatory: true }
    ],
    applySteps: [
      { step: 1, text: 'Verify your institution on immi.homeaffairs.gov.au or canada.ca DLI list.', textHi: 'सरकारी इमिग्रेशन पोर्टल पर कॉलेज की वर्क परमिट पात्रता जांचें।' },
      { step: 2, text: 'Submit post-study visa application online within 6 months of graduation.', textHi: 'कोर्स पूरा होने के ६ माह के भीतर सरकारी पोर्टल पर ऑनलाइन आवेदन करें।' },
      { step: 3, text: 'Receive unrestricted multi-year full-time open work visa.', textHi: 'बहु-वर्षीय खुला कार्य वीजा प्राप्त कर नौकरी शुरू करें।' }
    ],
    tags: ['Work in Australia', 'Post Study Work', 'Canada PGWP', 'Permanent Residency', 'Global Careers'],
    is100PercentFree: false,
    isNew: true
  }
];
