/**
 * Anti-Fraud & Data Authenticity Validation Engine
 * 100% Free Lifetime Verification (UIDAI Verhoeff Checksum + TRAI Rules + India Post Rules)
 */

import { SupportedLanguage, CountryCode } from '@/types';

// 1. UIDAI Verhoeff Checksum Algorithm
// Dihedral group D5 multiplication and permutation matrices
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

export function validateVerhoeff(numStr: string): boolean {
  if (!/^\d+$/.test(numStr)) return false;
  let c = 0;
  const invertedArray = numStr.split('').map(Number).reverse();
  for (let i = 0; i < invertedArray.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][invertedArray[i]]];
  }
  return c === 0;
}

// 2. Full Name Validation
export function validateRealName(name: string, lang: SupportedLanguage = 'en'): { valid: boolean; error?: string } {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return {
      valid: false,
      error: lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.',
    };
  }
  if (trimmed.length < 3) {
    return {
      valid: false,
      error: lang === 'hi' ? 'पूरा नाम कम से कम 3 अक्षरों का होना चाहिए।' : 'Full name must be at least 3 characters.',
    };
  }
  if (trimmed.length > 60) {
    return {
      valid: false,
      error: lang === 'hi' ? 'नाम अधिकतम 60 अक्षरों का हो सकता है।' : 'Name cannot exceed 60 characters.',
    };
  }
  // Must contain letters, spaces, dots, hyphens only
  if (!/^[\p{L}\s.'-]+$/u.test(trimmed)) {
    return {
      valid: false,
      error: lang === 'hi'
        ? 'नाम में केवल वास्तविक अक्षर (Letters) होने चाहिए, अंक या विशेष चिह्न नहीं।'
        : 'Name must only contain valid alphabetic characters.',
    };
  }

  // Check for dummy spam keywords
  const lower = trimmed.toLowerCase();
  const fakeKeywords = [
    'test', 'testing', 'fake', 'demo', 'asdf', 'qwerty', 'user', 'admin',
    'administrator', 'null', 'undefined', 'aadhaar', 'dummy', 'sample',
    'unknown', 'temp', 'random', 'none', 'guest', 'abcd', 'xyz', 'naam',
    'name', 'check', 'na', 'n/a', 'no name', 'tester', 'bot', 'fakeuser'
  ];
  const words = lower.split(/[\s.'-]+/).filter(Boolean);
  for (const word of words) {
    if (fakeKeywords.includes(word)) {
      return {
        valid: false,
        error: lang === 'hi'
          ? 'कृपया अपना वास्तविक नाम दर्ज करें (डमी/टेस्ट नाम मान्य नहीं है)।'
          : 'Please enter your genuine legal name (test/dummy names not allowed).',
      };
    }
  }

  // Reject 3+ identical consecutive letters like 'aaaa' or 'zzzz'
  if (/(.)\1{2,}/i.test(trimmed)) {
    return {
      valid: false,
      error: lang === 'hi'
        ? 'अमान्य नाम: दोहराए गए अक्षर पाए गए। कृपया सही नाम लिखें।'
        : 'Invalid name pattern detected. Please enter a genuine name.',
    };
  }

  return { valid: true };
}

// 3. Indian Mobile Number Validation (TRAI Standards)
export function validateRealPhone(phone: string, lang: SupportedLanguage = 'en'): { valid: boolean; cleanPhone: string; error?: string } {
  const clean = (phone || '').replace(/\D/g, '').slice(-10);
  if (!clean || clean.length !== 10) {
    return {
      valid: false,
      cleanPhone: clean,
      error: lang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a 10-digit mobile number.',
    };
  }

  // TRAI rule: Indian mobile numbers must start with 6, 7, 8, or 9
  if (!/^[6-9]/.test(clean)) {
    return {
      valid: false,
      cleanPhone: clean,
      error: lang === 'hi'
        ? 'भारतीय मोबाइल नंबर 6, 7, 8 या 9 से शुरू होना चाहिए।'
        : 'Indian mobile numbers must start with 6, 7, 8, or 9.',
    };
  }

  // Reject all identical digits (9999999999, 8888888888, etc.)
  if (/^(\d)\1{9}$/.test(clean)) {
    return {
      valid: false,
      cleanPhone: clean,
      error: lang === 'hi'
        ? 'अमान्य मोबाइल नंबर: सभी अंक समान नहीं हो सकते।'
        : 'Invalid phone number: all digits cannot be identical.',
    };
  }

  // Reject 6 or more identical consecutive digits (e.g. 9800000000)
  if (/(\d)\1{5,}/.test(clean)) {
    return {
      valid: false,
      cleanPhone: clean,
      error: lang === 'hi'
        ? 'अमान्य मोबाइल नंबर: डमी दोहराव पैटर्न पाया गया।'
        : 'Invalid phone number: dummy repetition pattern detected.',
    };
  }

  // Known dummy test numbers blacklist
  const dummyNumbers = [
    '9876543210', '9123456789', '9012345678', '6789012345', '7890123456',
    '8901234567', '9898989898', '9191919191', '9090909090', '8989898989',
    '9900990099', '9111111111', '9222222222', '9333333333', '9000000000',
    '9800000000', '9812345678', '9876500000', '9900000000', '9899999999',
    '9876543211', '9876543212'
  ];
  if (dummyNumbers.includes(clean)) {
    return {
      valid: false,
      cleanPhone: clean,
      error: lang === 'hi'
        ? 'कृपया अपना वास्तविक मोबाइल नंबर दर्ज करें (परीक्षण/डमी नंबर अस्वीकृत)।'
        : 'Please enter your genuine mobile number (dummy number rejected).',
    };
  }

  return { valid: true, cleanPhone: clean };
}

// 4. UIDAI 12-Digit Aadhaar Card Validation
export function validateRealAadhaar(aadhaar: string, lang: SupportedLanguage = 'en'): { valid: boolean; cleanAadhaar: string; error?: string } {
  const clean = (aadhaar || '').replace(/[\s-]/g, '').trim();
  if (!clean) {
    return {
      valid: false,
      cleanAadhaar: '',
      error: lang === 'hi' ? 'आधार कार्ड नंबर दर्ज करना अनिवार्य है।' : 'Aadhaar number is required.',
    };
  }

  if (clean.length !== 12 || !/^\d{12}$/.test(clean)) {
    return {
      valid: false,
      cleanAadhaar: clean,
      error: lang === 'hi' ? 'आधार नंबर ठीक 12 अंकों का होना चाहिए।' : 'Aadhaar number must be exactly 12 digits.',
    };
  }

  // UIDAI Standard: Aadhaar number NEVER starts with 0 or 1
  if (clean.startsWith('0') || clean.startsWith('1')) {
    return {
      valid: false,
      cleanAadhaar: clean,
      error: lang === 'hi'
        ? 'UIDAI नियम: आधार नंबर 0 या 1 से शुरू नहीं हो सकता (2-9 से शुरू होना चाहिए)।'
        : 'UIDAI standard: Aadhaar cannot start with 0 or 1.',
    };
  }

  // Reject all same digits (222222222222, etc.)
  if (/^(\d)\1{11}$/.test(clean)) {
    return {
      valid: false,
      cleanAadhaar: clean,
      error: lang === 'hi'
        ? 'अमान्य आधार नंबर: सभी 12 अंक समान नहीं हो सकते।'
        : 'Invalid Aadhaar: all 12 digits cannot be identical.',
    };
  }

  // Reject obvious dummy sequences
  const dummyAadhaar = [
    '234567890123', '987654321098', '223344556677', '998877665544',
    '234567890124', '345678901234'
  ];
  if (dummyAadhaar.includes(clean)) {
    return {
      valid: false,
      cleanAadhaar: clean,
      error: lang === 'hi'
        ? 'कृपया अपना वास्तविक 12-अंकीय आधार नंबर दर्ज करें (डमी नंबर अमान्य)।'
        : 'Please enter your genuine Aadhaar number.',
    };
  }

  // UIDAI Mathematical Verhoeff Checksum Check
  if (!validateVerhoeff(clean)) {
    return {
      valid: false,
      cleanAadhaar: clean,
      error: lang === 'hi'
        ? 'अमान्य आधार नंबर (UIDAI Verhoeff चेकसम विफल)। कृपया अपने आधार कार्ड का सही 12-अंकीय नंबर जांचें।'
        : 'Invalid Aadhaar checksum (UIDAI Verhoeff failed). Please check your 12-digit number.',
    };
  }

  return { valid: true, cleanAadhaar: clean };
}

// 5. Date of Birth & Age Validation
export function validateRealDob(dobStr: string, lang: SupportedLanguage = 'en'): { valid: boolean; age: number; error?: string } {
  if (!dobStr) {
    return {
      valid: false,
      age: 0,
      error: lang === 'hi' ? 'कृपया अपनी जन्म तिथि (DOB) चुनें।' : 'Please select your Date of Birth.',
    };
  }

  const birthDate = new Date(dobStr);
  const now = new Date();
  if (isNaN(birthDate.getTime())) {
    return {
      valid: false,
      age: 0,
      error: lang === 'hi' ? 'अमान्य जन्म तिथि प्रारूप।' : 'Invalid Date of Birth format.',
    };
  }

  if (birthDate >= now) {
    return {
      valid: false,
      age: 0,
      error: lang === 'hi' ? 'जन्म तिथि भविष्य की या आज की नहीं हो सकती।' : 'Birth date cannot be today or in the future.',
    };
  }

  let age = now.getFullYear() - birthDate.getFullYear();
  const m = now.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 14) {
    return {
      valid: false,
      age,
      error: lang === 'hi'
        ? 'नागरिक की न्यूनतम आयु 14 वर्ष होनी चाहिए (सरकारी योजना पात्रता हेतु)।'
        : 'Citizen must be at least 14 years of age for government portal eligibility.',
    };
  }

  if (age > 100) {
    return {
      valid: false,
      age,
      error: lang === 'hi'
        ? 'कृपया अपनी वास्तविक जन्म तिथि दर्ज करें (अधिकतम आयु 100 वर्ष)।'
        : 'Please enter a genuine birth date (maximum age 100 years).',
    };
  }

  return { valid: true, age };
}

// 6. India Post Pincode Validation
export function validateRealPincode(pincode: string, lang: SupportedLanguage = 'en'): { valid: boolean; cleanPincode: string; error?: string } {
  const clean = (pincode || '').replace(/\D/g, '').trim();
  if (!clean || clean.length !== 6) {
    return {
      valid: false,
      cleanPincode: clean,
      error: lang === 'hi' ? 'पिनकोड ठीक 6 अंकों का होना चाहिए।' : 'Pincode must be exactly 6 digits.',
    };
  }

  // India Post rules: Postal zones are 1 to 8 (never 0 or 9)
  if (!/^[1-8]/.test(clean)) {
    return {
      valid: false,
      cleanPincode: clean,
      error: lang === 'hi'
        ? 'भारतीय डाक पिनकोड 1 से 8 से शुरू होना चाहिए (0 या 9 मान्य नहीं है)।'
        : 'Indian postal pincode must start with digits 1 through 8.',
    };
  }

  // Reject dummy repeating pincodes
  if (/^(\d)\1{5}$/.test(clean) || ['123456', '654321', '121212', '112233', '100000', '800000'].includes(clean)) {
    return {
      valid: false,
      cleanPincode: clean,
      error: lang === 'hi'
        ? 'अमान्य पिनकोड: कृपया अपने क्षेत्र का सही 6-अंकीय डाक पिनकोड दर्ज करें।'
        : 'Invalid pincode: please enter your genuine postal code.',
    };
  }

  return { valid: true, cleanPincode: clean };
}

// 7. District Validation
export function validateRealDistrict(district: string, lang: SupportedLanguage = 'en'): { valid: boolean; error?: string } {
  const trimmed = (district || '').trim();
  if (!trimmed || trimmed.length < 3) {
    return {
      valid: false,
      error: lang === 'hi' ? 'जिले का नाम कम से कम 3 अक्षरों का होना चाहिए।' : 'District name must be at least 3 characters.',
    };
  }
  if (!/^[\p{L}\s.'-]+$/u.test(trimmed)) {
    return {
      valid: false,
      error: lang === 'hi' ? 'जिले के नाम में केवल अक्षर होने चाहिए।' : 'District name must contain letters only.',
    };
  }

  const lower = trimmed.toLowerCase();
  const fakeDistricts = ['test', 'demo', 'fake', 'asdf', 'qwerty', 'none', 'xxx', 'city', 'na', 'district'];
  if (fakeDistricts.includes(lower)) {
    return {
      valid: false,
      error: lang === 'hi'
        ? 'कृपया अपने वास्तविक जिले का नाम दर्ज करें।'
        : 'Please enter your genuine district name.',
    };
  }

  return { valid: true };
}

// 8. Annual Family Income Validation
export function validateRealIncome(income: number, lang: SupportedLanguage = 'en'): { valid: boolean; error?: string } {
  const val = Number(income);
  if (isNaN(val) || val < 10000) {
    return {
      valid: false,
      error: lang === 'hi'
        ? 'वार्षिक पारिवारिक आय कम से कम ₹10,000 होनी चाहिए।'
        : 'Annual family income must be at least ₹10,000.',
    };
  }
  if (val > 50000000) {
    return {
      valid: false,
      error: lang === 'hi'
        ? 'कृपया वास्तविक वार्षिक आय दर्ज करें (अधिकतम सीमा ₹5 करोड़)।'
        : 'Please enter a genuine annual income.',
    };
  }
  return { valid: true };
}

// 9. Exact Age Calculation from Date of Birth
export function calculateExactAge(dobString: string): number {
  if (!dobString) return 0;
  const birth = new Date(dobString);
  if (isNaN(birth.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

// 10. Multi-Country National Identity Anti-Fraud Validation
export function validateRealNationalId(
  idValue: string,
  country: CountryCode = 'IN',
  lang: SupportedLanguage = 'en'
): { valid: boolean; cleanId: string; error?: string } {
  const raw = (idValue || '').trim();
  if (!raw) {
    return {
      valid: false,
      cleanId: '',
      error: lang === 'hi' ? 'राष्ट्रीय पहचान पत्र नंबर दर्ज करना अनिवार्य है।' : 'National Identity Number is required.',
    };
  }

  // India - Strict 12-Digit UIDAI Verhoeff Checksum
  if (country === 'IN') {
    const res = validateRealAadhaar(raw, lang);
    return { valid: res.valid, cleanId: res.cleanAadhaar, error: res.error };
  }

  // United States - 9-digit SSN
  if (country === 'US') {
    const cleanSSN = raw.replace(/\D/g, '');
    if (cleanSSN.length !== 9) {
      return {
        valid: false,
        cleanId: cleanSSN,
        error: lang === 'hi' ? 'अमेरिकी एसएसएन ठीक 9 अंकों का होना चाहिए।' : 'US SSN must be exactly 9 digits.',
      };
    }
    const area = cleanSSN.slice(0, 3);
    const group = cleanSSN.slice(3, 5);
    const serial = cleanSSN.slice(5, 9);
    if (area === '000' || area === '666' || Number(area) >= 900 || group === '00' || serial === '0000') {
      return {
        valid: false,
        cleanId: cleanSSN,
        error: lang === 'hi' ? 'अमान्य अमेरिकी एसएसएन संरचना।' : 'Invalid US SSN format according to Social Security rules.',
      };
    }
    return { valid: true, cleanId: `${area}-${group}-${serial}` };
  }

  // United Kingdom - NINO
  if (country === 'GB') {
    const cleanNino = raw.replace(/\s/g, '').toUpperCase();
    const ninoRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/;
    if (!ninoRegex.test(cleanNino)) {
      return {
        valid: false,
        cleanId: cleanNino,
        error: lang === 'hi' ? 'अमान्य ब्रिटेन NINO नंबर (प्रारूप: QQ 12 34 56 A)।' : 'Invalid UK National Insurance Number format (e.g. QQ 12 34 56 A).',
      };
    }
    return { valid: true, cleanId: cleanNino };
  }

  // Canada - 9-digit SIN with Luhn Checksum
  if (country === 'CA') {
    const cleanSin = raw.replace(/\D/g, '');
    if (cleanSin.length !== 9) {
      return {
        valid: false,
        cleanId: cleanSin,
        error: lang === 'hi' ? 'कनाडा एसआईएन ठीक 9 अंकों का होना चाहिए।' : 'Canada SIN must be exactly 9 digits.',
      };
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = Number(cleanSin[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    if (sum % 10 !== 0) {
      return {
        valid: false,
        cleanId: cleanSin,
        error: lang === 'hi' ? 'अमान्य कनाडा एसआईएन चेकसम (Luhn Checksum Failed)।' : 'Invalid Canada SIN checksum.',
      };
    }
    return { valid: true, cleanId: cleanSin };
  }

  // Brazil - 11-digit CPF with dual modulus checksum
  if (country === 'BR') {
    const cleanCpf = raw.replace(/\D/g, '');
    if (cleanCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanCpf)) {
      return {
        valid: false,
        cleanId: cleanCpf,
        error: lang === 'hi' ? 'ब्राजील सीपीएफ ठीक 11 अंकों का होना चाहिए।' : 'Brazil CPF must be exactly 11 digits.',
      };
    }
    let sum1 = 0;
    for (let i = 0; i < 9; i++) sum1 += Number(cleanCpf[i]) * (10 - i);
    let rev1 = 11 - (sum1 % 11);
    if (rev1 >= 10) rev1 = 0;
    if (rev1 !== Number(cleanCpf[9])) {
      return { valid: false, cleanId: cleanCpf, error: lang === 'hi' ? 'अमान्य ब्राजील सीपीएफ चेकसम।' : 'Invalid Brazil CPF checksum.' };
    }
    let sum2 = 0;
    for (let i = 0; i < 10; i++) sum2 += Number(cleanCpf[i]) * (11 - i);
    let rev2 = 11 - (sum2 % 11);
    if (rev2 >= 10) rev2 = 0;
    if (rev2 !== Number(cleanCpf[10])) {
      return { valid: false, cleanId: cleanCpf, error: lang === 'hi' ? 'अमान्य ब्राजील सीपीएफ चेकसम।' : 'Invalid Brazil CPF checksum.' };
    }
    return { valid: true, cleanId: cleanCpf };
  }

  // Generic national ID for other countries
  const cleanGeneric = raw.replace(/[^a-zA-Z0-9-]/g, '');
  if (cleanGeneric.length < 5 || cleanGeneric.length > 25) {
    return {
      valid: false,
      cleanId: cleanGeneric,
      error: lang === 'hi' ? 'राष्ट्रीय पहचान संख्या 5 से 25 वर्णों की होनी चाहिए।' : 'National Identity Number must be between 5 and 25 characters.',
    };
  }

  return { valid: true, cleanId: cleanGeneric };
}

