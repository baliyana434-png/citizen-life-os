import { HelplineFacility } from '@/types';

export const VERIFIED_HELPLINES: HelplineFacility[] = [
  {
    id: 'hl-112',
    number: '112',
    name: 'National Emergency Response Support System (ERSS)',
    nameHi: 'राष्ट्रीय आपातकालीन हेल्पलाइन (पुलिस, अग्निशमन व एम्बुलेंस)',
    category: 'emergency',
    authority: 'Ministry of Home Affairs (Govt of India)',
    authorityHi: 'गृह मंत्रालय (भारत सरकार)',
    hours: '24x7 All Days',
    hoursHi: '२४x७ सभी दिन',
    isTollFree: true,
    is24x7: true,
    purpose: 'Pan-India single emergency number for immediate Police, Fire brigade, Ambulance, and Disaster management intervention.',
    purposeHi: 'पुलिस सहायता, आग लगने पर दमकल, आकस्मिक एम्बुलेंस एवं किसी भी आपदा में तुरंत आपातकालीन सरकारी सहायता।',
    guidance: [
      'Provide your exact location, nearby landmark, and current district.',
      'State the nature of emergency clearly (accident, theft, medical, violence).',
      'Stay on call until the dispatch officer confirms the unit is on the way.'
    ],
    guidanceHi: [
      'अपना सटीक स्थान, नजदीकी लैंडमार्क एवं जिले का नाम बताएं।',
      'आपातकाल का प्रकार स्पष्ट रूप से बताएं (दुर्घटना, चोरी, चिकित्सा, हिंसा)।',
      'जब तक कंट्रोल रूम अधिकारी टीम रवाना होने की पुष्टि न करे, कॉल न काटें।'
    ],
    portalUrl: 'https://112.gov.in',
    tags: ['Emergency', 'Police', 'Ambulance', 'Fire', '112', 'Life Threatening']
  },
  {
    id: 'hl-1930',
    number: '1930',
    name: 'National Cyber Financial Fraud Reporting Helpline',
    nameHi: 'राष्ट्रीय साइबर वित्तीय धोखाधड़ी हेल्पलाइन (ऑनलाइन ठगी रिपोर्टिंग)',
    category: 'cyber_legal',
    authority: 'Indian Cyber Crime Coordination Centre (I4C), MHA',
    authorityHi: 'भारतीय साइबर अपराध समन्वय केंद्र (I4C), गृह मंत्रालय',
    hours: '24x7 All Days',
    hoursHi: '२४x७ सभी दिन',
    isTollFree: true,
    is24x7: true,
    purpose: 'Immediate freezing of defrauded money transferred through UPI, netbanking, or debit/credit cards during the "Golden Hour".',
    purposeHi: 'यूपीआई (UPI), नेट बैंकिंग अथवा बैंक खातों से ऑनलाइन ठगी होने पर "गोल्डन आवर" में खाते फ्रीज कराकर पैसा सुरक्षित वापस पाना।',
    guidance: [
      'Call IMMEDIATELY within 2-3 hours of unauthorized transaction (Golden Hour).',
      'Keep Transaction UTR / Reference ID, Debit SMS, and your Bank Account number ready.',
      'Also register complaint on official national cyber portal cybercrime.gov.in.'
    ],
    guidanceHi: [
      'पैसा कटने के तुरंत २-३ घंटे के भीतर (गोल्डन आवर) कॉल करें।',
      'लेन-देन का यूटीआर (UTR) नंबर, बैंक मैसेज और अपना खाता नंबर पास रखें।',
      'कॉल के बाद cybercrime.gov.in पर भी आधिकारिक शिकायत दर्ज करवाएं।'
    ],
    portalUrl: 'https://cybercrime.gov.in',
    tags: ['Cyber Fraud', 'UPI Scam', 'Bank Freeze', 'Golden Hour', '1930', 'Police Cyber Cell']
  },
  {
    id: 'hl-15100',
    number: '15100',
    name: 'Tele-Law: Free 24x7 Citizen Legal Consultation & Aid',
    nameHi: 'टेली-लॉ: निःशुल्क कानूनी सलाह एवं सहायता (न्याय विभाग)',
    category: 'cyber_legal',
    authority: 'Department of Justice, Ministry of Law and Justice',
    authorityHi: 'न्याय विभाग, कानून एवं न्याय मंत्रालय (भारत सरकार)',
    hours: '24x7 All Days',
    hoursHi: '२४x७ सभी दिन',
    isTollFree: true,
    is24x7: true,
    purpose: 'Connects marginalized citizens, women, farmers, and underprivileged families directly with high-court panel advocates for 100% free legal advice.',
    purposeHi: 'गरीबों, महिलाओं, किसानों व श्रमिकों को जमीन-जायदाद विवाद, पारिवारिक मामलों व एफआईआर पर वरिष्ठ वकीलों से सीधी मुफ्त कानूनी सलाह।',
    guidance: [
      'Keep any relevant notice, property dispute papers, or case details handy.',
      'Explain your legal matter calmly in your preferred local language.',
      'Can also be accessed in-person via Common Service Centers (CSC) in your village.'
    ],
    guidanceHi: [
      'जमीन या विवाद से संबंधित कागजात अथवा नोटिस अपने पास रखें।',
      'अपनी मातृभाषा में मामले का पूरा विवरण पैनल वकील को समझाएं।',
      'गांव के नजदीकी सीएससी (CSC) केंद्र पर जाकर वीडियो कॉन्फ्रेंस से भी सलाह ले सकते हैं।'
    ],
    portalUrl: 'https://www.tele-law.in',
    tags: ['Free Legal Aid', 'Lawyer', 'Court Case Advice', 'Tele-Law', 'Justice', 'Govt Legal Support']
  },
  {
    id: 'hl-181',
    number: '181',
    name: 'National Women Helpline (WHL) - Women in Distress',
    nameHi: 'राष्ट्रीय महिला हेल्पलाइन १८१ (संकटग्रस्त महिलाओं हेतु २४ घंटे सहायता)',
    category: 'women_child',
    authority: 'Ministry of Women and Child Development',
    authorityHi: 'महिला एवं बाल विकास मंत्रालय (भारत सरकार)',
    hours: '24x7 All Days',
    hoursHi: '२४x७ सभी दिन',
    isTollFree: true,
    is24x7: true,
    purpose: 'Confidential 24-hour emergency response for women facing domestic violence, harassment, stalking, dowry distress, or mental distress.',
    purposeHi: 'घरेलू हिंसा, उत्पीड़न, दहेज प्रताड़ना अथवा मानसिक संकट से पीड़ित महिलाओं को त्वरित पुलिस सुरक्षा, आश्रय व कानूनी सहायता।',
    guidance: [
      'The caller identity is kept 100% confidential and protected.',
      'Provides immediate linkage to One Stop Centres (Sakhi Centres), police, and ambulances.',
      'Counselors are trained to handle extreme distress and arrange immediate shelter.'
    ],
    guidanceHi: [
      'कॉलर की पहचान पूरी तरह से गुप्त रखी जाती है।',
      'सखी वन स्टॉप सेंटर, महिला पुलिस एवं एम्बुलेंस से तुरंत समन्वय कराया जाता है।',
      'आपात स्थिति में महिला को सुरक्षित सरकारी आश्रय गृह (Shelter Home) पहुंचाया जाता है।'
    ],
    portalUrl: 'https://wcd.nic.in',
    tags: ['Women Safety', 'Domestic Violence', 'Women Helpline', 'Sakhi Centre', '181', 'Confidential']
  },
  {
    id: 'hl-1098',
    number: '1098',
    name: 'Childline India: 24x7 Emergency Child Protection',
    nameHi: 'चाइल्डलाइन १०९८: संकटग्रस्त बच्चों की आपातकालीन सुरक्षा हेल्पलाइन',
    category: 'women_child',
    authority: 'Ministry of Women and Child Development',
    authorityHi: 'महिला एवं बाल विकास मंत्रालय (भारत सरकार)',
    hours: '24x7 All Days',
    hoursHi: '२४x७ सभी दिन',
    isTollFree: true,
    is24x7: true,
    purpose: 'Nationwide emergency intervention service for children in need of care and protection: missing children, child labour, child abuse, and runaway children.',
    purposeHi: 'लापता बच्चों, बाल श्रम, बाल विवाह, परित्यक्त एवं संकटग्रस्त बच्चों की सुरक्षा व पुनर्वास हेतु राष्ट्रीय आपातकालीन सेवा।',
    guidance: [
      'Any citizen or the child themselves can call 1098 toll-free from any phone.',
      'State child location, visual physical condition, and urgency level.',
      'Child Welfare Committee (CWC) team is dispatched within minutes.'
    ],
    guidanceHi: [
      'कोई भी नागरिक अथवा स्वयं बच्चा किसी भी फोन से बिना पैसे दिए १०९८ पर कॉल कर सकता है।',
      'बच्चे का सही स्थान और शारीरिक स्थिति का विवरण दें।',
      'बाल कल्याण समिति और रेस्क्यू टीम तुरंत मौके पर पहुंचती है।'
    ],
    portalUrl: 'https://childlineindia.org',
    tags: ['Child Protection', 'Missing Children', 'Childline', 'Rescue', '1098', 'Free Emergency']
  },
  {
    id: 'hl-14567',
    number: '14567',
    name: 'Elderline: National Helpline for Senior Citizens',
    nameHi: 'एल्डरलाइन १४५६७: वरिष्ठ नागरिकों हेतु राष्ट्रीय कल्याण एवं सुरक्षा हेल्पलाइन',
    category: 'senior',
    authority: 'Ministry of Social Justice & Empowerment',
    authorityHi: 'सामाजिक न्याय एवं अधिकारिता मंत्रालय (भारत सरकार)',
    hours: '8:00 AM - 8:00 PM (All 7 Days)',
    hoursHi: 'प्रातः ८:०० से सायं ८:०० बजे तक (सातों दिन)',
    isTollFree: true,
    is24x7: false,
    purpose: 'Free assistance for elderly citizens on abuse rescue, legal disputes, old-age homes admission, govt pension guidance, and emotional support.',
    purposeHi: 'बुजुर्गों को दुर्व्यवहार से मुक्ति, वृद्धाश्रम में आश्रय, भरण-पोषण कानून के तहत मदद, पेंशन संबंधी समस्याओं और भावनात्मक संबल हेतु।',
    guidance: [
      'Provides assistance under Maintenance and Welfare of Parents and Senior Citizens Act.',
      'Can arrange physical field visits for destitute and abandoned senior citizens.',
      'Assistance available in regional Indian languages.'
    ],
    guidanceHi: [
      'माता-पिता एवं वरिष्ठ नागरिक भरण-पोषण कानून के अंतर्गत कानूनी सहायता प्रदान की जाती है।',
      'असहाय एवं बेघर बुजुर्गों के लिए फील्ड टीम मौके पर जाकर राहत पहुंचाती है।',
      'क्षेत्रीय भाषाओं में सम्मानपूर्वक मार्गदर्शन उपलब्ध है।'
    ],
    portalUrl: 'https://socialjustice.gov.in',
    tags: ['Senior Citizens', 'Elderline', 'Old Age Support', 'Pension Help', '14567', 'Toll Free']
  },
  {
    id: 'hl-108',
    number: '108',
    name: 'National Emergency Ambulance Service',
    nameHi: 'राष्ट्रीय आपातकालीन एम्बुलेंस सेवा १०८',
    category: 'health',
    authority: 'National Health Mission (Ministry of Health & Family Welfare)',
    authorityHi: 'राष्ट्रीय स्वास्थ्य मिशन, स्वास्थ्य एवं परिवार कल्याण मंत्रालय',
    hours: '24x7 All Days',
    hoursHi: '२४x७ सभी दिन',
    isTollFree: true,
    is24x7: true,
    purpose: 'Free emergency medical transport with Advanced Life Support (ALS) and Basic Life Support (BLS) ambulances for trauma, cardiac arrests, and deliveries.',
    purposeHi: 'सड़क दुर्घटना, हार्ट अटैक, गंभीर बीमारी अथवा प्रसव पीड़ा में जीवन रक्षक उपकरणों से युक्त सरकारी एम्बुलेंस तुरंत बुलाने हेतु।',
    guidance: [
      'Describe patient condition (conscious/unconscious, breathing status, severe bleeding).',
      'Give exact address with landmark for fastest driver navigation.',
      'Keep patient resting while paramedic team is en route.'
    ],
    guidanceHi: [
      'मरीज की स्थिति स्पष्ट बताएं (होश में है या बेहोश, सांस की स्थिति, रक्तस्राव)।',
      'चालक के शीघ्र पहुंचने हेतु सटीक पता व प्रमुख पहचान चिन्ह (लैंडमार्क) बताएं।',
      'पैरामेडिक टीम के पहुंचने तक मरीज को प्राथमिक उपचार की स्थिति में रखें।'
    ],
    portalUrl: 'https://nhm.gov.in',
    tags: ['Ambulance', 'Medical Emergency', 'Hospital Transport', '108', 'Free Lifesaver']
  },
  {
    id: 'hl-14416',
    number: '14416',
    name: 'Tele-MANAS: National Mental Health Assistance Helpline',
    nameHi: 'टेली-मानस १४४१६: राष्ट्रीय मानसिक स्वास्थ्य एवं परामर्श हेल्पलाइन',
    category: 'health',
    authority: 'Ministry of Health & Family Welfare & NIMHANS',
    authorityHi: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय एवं निमहंस (NIMHANS)',
    hours: '24x7 All Days',
    hoursHi: '२४x७ सभी दिन',
    isTollFree: true,
    is24x7: true,
    purpose: 'Free 24x7 confidential psychological counseling, exam stress management, anxiety, depression, and crisis intervention by licensed clinical psychologists.',
    purposeHi: 'परीक्षा तनाव, अवसाद, घबराहट, अत्यधिक चिंता एवं मानसिक तनाव से जूझ रहे युवाओं व नागरिकों को विशेषज्ञ डॉक्टरों द्वारा गोपनीय परामर्श।',
    guidance: [
      'Available in 20+ regional Indian languages.',
      'Completely free, judgment-free, and confidential.',
      'Students preparing for competitive exams can discuss study burnout and anxiety.'
    ],
    guidanceHi: [
      'देश की २०+ प्रमुख भाषाओं में परामर्श उपलब्ध है।',
      'पूरी तरह गोपनीय और निःशुल्क सेवा।',
      'प्रतियोगी परीक्षाओं की तैयारी कर रहे विद्यार्थी पढ़ाई के तनाव व चिंता पर खुलकर बात कर सकते हैं।'
    ],
    portalUrl: 'https://telemanas.mohfw.gov.in',
    tags: ['Mental Health', 'Exam Stress', 'Psychologist', 'Counseling', 'Tele MANAS', '14416']
  },
  {
    id: 'hl-kisan-call-center',
    number: '1800-180-1551',
    name: 'Kisan Call Centre (KCC): Free Agricultural Expert Advisory',
    nameHi: 'किसान कॉल सेंटर: कृषि वैज्ञानिकों द्वारा निःशुल्क कृषि परामर्श',
    category: 'farmer',
    authority: 'Ministry of Agriculture & Farmers Welfare',
    authorityHi: 'कृषि एवं किसान कल्याण मंत्रालय (भारत सरकार)',
    hours: '6:00 AM - 10:00 PM (All 7 Days)',
    hoursHi: 'प्रातः ६:०० से रात्रि १०:०० बजे तक (सातों दिन)',
    isTollFree: true,
    is24x7: false,
    purpose: 'Instant guidance on crop diseases, pest management, MSP rates, fertilizer application, seeds, weather forecasts, and PM-KISAN issues directly from agronomists.',
    purposeHi: 'फसलों में रोग व कीट नियंत्रण, खाद की मात्रा, उत्तम बीज, एमएसपी रेट, मौसम चेतावनी एवं पीएम-किसान किस्त समस्याओं पर कृषि वैज्ञानिकों की सीधी सलाह।',
    guidance: [
      'Call from any mobile or landline across India free of cost.',
      'Mention your crop name, soil type, and current symptoms on crops.',
      'Officers provide immediate answers in your local language/dialect.'
    ],
    guidanceHi: [
      'भारत के किसी भी कोने से बिना किसी शुल्क के मोबाइल से कॉल करें।',
      'अपनी फसल का नाम, मिट्टी का प्रकार और पत्तियों/पौधे में दिख रहे लक्षण बताएं।',
      'वैज्ञानिक आपकी स्थानीय बोली में तुरंत समाधान बताते हैं।'
    ],
    portalUrl: 'https://agricoop.nic.in',
    tags: ['Kisan Call Centre', 'Farmer Helpline', 'Crop Disease', 'MSP', 'PM Kisan Help', 'Agri Expert']
  },
  {
    id: 'hl-consumer-1915',
    number: '1915',
    name: 'National Consumer Helpline (NCH)',
    nameHi: 'राष्ट्रीय उपभोक्ता हेल्पलाइन १९१५ (उपभोक्ता शिकायत एवं ठगी निवारण)',
    category: 'citizen_services',
    authority: 'Department of Consumer Affairs (Govt of India)',
    authorityHi: 'उपभोक्ता मामले विभाग (भारत सरकार)',
    hours: '8:00 AM - 8:00 PM (Monday to Saturday)',
    hoursHi: 'प्रातः ८:०० से सायं ८:०० बजे तक (सोमवार से शनिवार)',
    isTollFree: true,
    is24x7: false,
    purpose: 'Resolution of complaints against defective products, e-commerce refund denials, fake warranties, overcharging, airline cancellation fees, and unfair trade practices.',
    purposeHi: 'ऑनलाइन शॉपिंग रिफंड न मिलने, दोषपूर्ण सामान, झूठी वारंटी, एमआरपी से अधिक वसूली एवं कंपनियों की मनमानी के खिलाफ त्वरित शिकायत व समाधान।',
    guidance: [
      'Keep invoice, bill copy, order number, and seller company name ready.',
      'Government mediator directly contacts the registered company for swift dispute resolution.',
      'You will receive an official grievance tracking docket number.'
    ],
    guidanceHi: [
      'खरीद की रसीद/बिल, आर्डर नंबर और कंपनी का नाम अपने पास रखें।',
      'सरकारी मध्यस्थ सीधे कंपनी से संपर्क करके आपके रिफंड या सामान बदलने की प्रक्रिया करवाते हैं।',
      'शिकायत दर्ज होते ही एसएमएस द्वारा आधिकारिक डॉकेट नंबर प्राप्त होता है।'
    ],
    portalUrl: 'https://consumerhelpline.gov.in',
    tags: ['Consumer Helpline', 'Ecommerce Refund', 'Defective Goods', '1915', 'Consumer Forum', 'Free Docket']
  },
  {
    id: 'hl-uidai-1947',
    number: '1947',
    name: 'UIDAI Aadhaar 24x7 National Citizen Helpline',
    nameHi: 'यूआईडीएआई आधार राष्ट्रीय नागरिक हेल्पलाइन १९४७',
    category: 'citizen_services',
    authority: 'Unique Identification Authority of India (UIDAI)',
    authorityHi: 'भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)',
    hours: '24x7 Interactive Voice Response (IVRS) / Agents: 7 AM - 11 PM',
    hoursHi: '२४x७ आईवीआरएस सेवा / प्रतिनिधि: प्रातः ७ से रात्रि ११ बजे',
    isTollFree: true,
    is24x7: true,
    purpose: 'Check Aadhaar update status, Enrolment ID (EID) retrieval, PVC card dispatch tracking, Aadhaar-mobile linkage verification, and biometric lock/unlock assistance.',
    purposeHi: 'आधार कार्ड अपडेट की स्थिति, नामांकन पर्ची (EID) नंबर खोजना, पीवीसी कार्ड ट्रैकिंग, मोबाइल लिंक जांच एवं बायोमेट्रिक लॉक/अनलॉक सहायता।',
    guidance: [
      'Keep your 28-digit Enrolment ID (EID) or 12-digit Aadhaar number ready.',
      'Assistance available in 12 major Indian languages.',
      'Use IVRS automated menu for instant 30-second status checking.'
    ],
    guidanceHi: [
      'अपनी २८ अंकों की नामांकन पर्ची (EID) संख्या अथवा १२ अंकों का आधार नंबर पास रखें।',
      'देश की १२ प्रमुख क्षेत्रीय भाषाओं में सहायता उपलब्ध है।',
      'तत्काल स्थिति जानने हेतु आईवीआरएस स्वचालित मेनू का उपयोग करें।'
    ],
    portalUrl: 'https://uidai.gov.in',
    tags: ['Aadhaar', 'UIDAI', 'Aadhaar Status', '1947', 'Aadhaar Mobile Link', 'EID Tracking']
  },
  {
    id: 'hl-upsc-exam',
    number: '1800-11-2020',
    name: 'UPSC Candidate Facilitation Counter & Helpline',
    nameHi: 'संघ लोक सेवा आयोग (UPSC) उम्मीदवार सुविधा केंद्र एवं हेल्पलाइन',
    category: 'citizen_services',
    authority: 'Union Public Service Commission (Govt of India)',
    authorityHi: 'संघ लोक सेवा आयोग (UPSC), भारत सरकार',
    hours: '10:00 AM - 5:00 PM (Working Days)',
    hoursHi: 'प्रातः १०:०० से सायं ५:०० बजे तक (कार्य दिवसों में)',
    isTollFree: true,
    is24x7: false,
    purpose: 'Official assistance regarding Civil Services (CSE), NDA, CDS, CAPF online registration forms, admit card errors, examination venue clarifications, and OTR issues.',
    purposeHi: 'सिविल सेवा परीक्षा (IAS/IPS), एनडीए, सीडीएस के ऑनलाइन फॉर्म, एडमिट कार्ड सुधार, परीक्षा केंद्र एवं वन-टाइम-रजिस्ट्रेशन (OTR) संबंधी आधिकारिक समाधान।',
    guidance: [
      'Keep your UPSC OTR Registration ID and Examination Roll Number handy.',
      'Only genuine UPSC helpline; never consult third-party coaching brokers for application rectifications.',
      'Direct in-person counter is also available at Dholpur House, Shahjahan Road, New Delhi.'
    ],
    guidanceHi: [
      'अपना यूपीएससी ओटीआर (OTR) रजिस्ट्रेशन आईडी और रोल नंबर पास रखें।',
      'यह यूपीएससी का एकमात्र आधिकारिक केंद्र है; फॉर्म त्रुटि सुधार हेतु किसी अनाधिकृत व्यक्ति को पैसे न दें।',
      'धौलपुर हाउस, शाहजहां रोड नई दिल्ली स्थित काउंटर पर भी व्यक्तिगत रूप से संपर्क किया जा सकता है।'
    ],
    portalUrl: 'https://upsc.gov.in',
    tags: ['UPSC Help', 'Admit Card', 'Civil Services', 'NDA CDS', 'OTR Registration', 'Official Counter']
  }
];
