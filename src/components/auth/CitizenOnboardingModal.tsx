'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CitizenProfile, CountryCode } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry, COUNTRIES } from '@/context/CountryContext';
import {
  validateRealName,
  validateRealDob,
  calculateExactAge,
  validateRealNationalId,
} from '@/utils/antiFraudValidation';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  CreditCard,
  Globe,
  Mail,
  User,
  MapPin,
  Sparkles,
  Info,
  Lock,
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  Building2,
  Wrench,
  HeartHandshake,
  HeartPulse,
} from 'lucide-react';

interface CitizenOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleUser: {
    name: string;
    email: string;
    photoURL?: string;
  } | null;
  initialRole?: CitizenProfile['lifePhase'];
  onComplete: (data: {
    fullName: string;
    email: string;
    photoURL?: string;
    lifePhase: CitizenProfile['lifePhase'];
    age: number;
    dob?: string;
    casteCategory: CitizenProfile['casteCategory'];
    state: string;
    gender: CitizenProfile['gender'];
    country?: CountryCode;
    nationalIdName?: string;
    nationalIdMasked?: string;
    administrativeDivision?: string;
  }) => void;
  onSwitchToSignIn?: () => void;
}

interface RoleConfig {
  id: CitizenProfile['lifePhase'];
  icon: React.ElementType;
  defaultAge: number;
}

const ROLES_LIST: RoleConfig[] = [
  { id: 'college_student', icon: GraduationCap, defaultAge: 21 },
  { id: 'school_student', icon: BookOpen, defaultAge: 16 },
  { id: 'exam_aspirant', icon: Award, defaultAge: 23 },
  { id: 'job_seeker', icon: Briefcase, defaultAge: 24 },
  { id: 'farmer', icon: SproutIcon, defaultAge: 42 },
  { id: 'employed', icon: Wrench, defaultAge: 29 },
  { id: 'business_owner', icon: Building2, defaultAge: 35 },
  { id: 'homemaker', icon: HeartHandshake, defaultAge: 32 },
  { id: 'senior_citizen', icon: HeartPulse, defaultAge: 63 },
];

function SproutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}

export const CitizenOnboardingModal: React.FC<CitizenOnboardingModalProps> = ({
  isOpen,
  onClose,
  googleUser,
  initialRole = 'college_student',
  onComplete,
  onSwitchToSignIn,
}) => {
  const { t, language } = useTranslation();
  const { country, setCountry, countryMeta } = useCountry();

  // Core Real Base Form State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  // Default DOB ~ 2002-05-18 (24 years old)
  const [dob, setDob] = useState<string>('2002-05-18');
  const [calculatedAge, setCalculatedAge] = useState<number>(24);
  const [selectedRole, setSelectedRole] = useState<CitizenProfile['lifePhase']>(initialRole);
  const [casteCategory, setCasteCategory] = useState<CitizenProfile['casteCategory']>('General');
  const [division, setDivision] = useState<string>(countryMeta.divisions[0] || 'General');
  const [gender, setGender] = useState<CitizenProfile['gender']>('male');
  const [nationalIdInput, setNationalIdInput] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync Google user details when modal opens
  useEffect(() => {
    if (googleUser) {
      if (googleUser.name && !fullName) setFullName(googleUser.name);
      if (googleUser.email && !email) setEmail(googleUser.email);
    }
  }, [googleUser]);

  // Available Social / Caste Categories for the current country
  const availableCategories = useMemo(() => {
    if (countryMeta.socialCategories && countryMeta.socialCategories.length > 0) {
      return countryMeta.socialCategories;
    }
    return [
      { id: 'General', label: 'General', labelHi: 'सामान्य वर्ग (General)' },
      { id: 'OBC', label: 'OBC (Other Backward Class)', labelHi: 'अन्य पिछड़ा वर्ग (OBC)' },
      { id: 'SC', label: 'SC (Scheduled Caste)', labelHi: 'अनुसूचित जाति (SC)' },
      { id: 'ST', label: 'ST (Scheduled Tribe)', labelHi: 'अनुसूचित जनजाति (ST)' },
      { id: 'EWS', label: 'EWS (Economically Weaker Section)', labelHi: 'आर्थिक कमजोर वर्ग (EWS)' },
    ];
  }, [countryMeta]);

  // Sync Country changes: reset division and casteCategory to valid options of the selected country
  useEffect(() => {
    if (countryMeta.divisions.length > 0) {
      const divExists = countryMeta.divisions.includes(division);
      if (!divExists) {
        setDivision(countryMeta.divisions[0]);
      }
    }
    if (availableCategories.length > 0) {
      const catExists = availableCategories.some((c) => c.id === casteCategory);
      if (!catExists) {
        setCasteCategory(availableCategories[0].id);
      }
    }
  }, [country, countryMeta, availableCategories]);

  // Auto-calculate exact age whenever Date of Birth changes (eliminates fake age mismatches)
  useEffect(() => {
    if (dob) {
      const computed = calculateExactAge(dob);
      setCalculatedAge(computed);
    }
  }, [dob]);

  // Dynamic DOB boundaries (min 14 years old, max 100 years old)
  const { maxDob, minDob } = useMemo(() => {
    const today = new Date();
    const max = `${today.getFullYear() - 14}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const min = `${today.getFullYear() - 100}-01-01`;
    return { maxDob: max, minDob: min };
  }, []);

  // Live Anti-Fraud Validations
  const nameValidation = useMemo(() => {
    const val = fullName.trim() || (googleUser?.name || '');
    if (!val) return null;
    return validateRealName(val, language);
  }, [fullName, googleUser, language]);

  const dobValidation = useMemo(() => {
    if (!dob) return null;
    return validateRealDob(dob, language);
  }, [dob, language]);

  const nationalIdValidation = useMemo(() => {
    const raw = nationalIdInput.trim();
    if (!raw) return null;
    return validateRealNationalId(raw, country, language);
  }, [nationalIdInput, country, language]);

  // Role select helper
  const handleRoleSelect = (roleId: CitizenProfile['lifePhase']) => {
    setSelectedRole(roleId);
    const roleOpt = ROLES_LIST.find((r) => r.id === roleId);
    if (roleOpt && !dob) {
      // Set an approximate birth year if dob was empty
      const targetYear = new Date().getFullYear() - roleOpt.defaultAge;
      setDob(`${targetYear}-06-15`);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const photoURL = googleUser?.photoURL;
  const effectiveName = fullName.trim() || (googleUser?.name || '');
  const effectiveEmail = email.trim() || (googleUser?.email || '');

  // Form Submit Handler with strict real-base verification
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Validate Real Name
    const nameCheck = validateRealName(effectiveName, language);
    if (!nameCheck.valid) {
      setValidationError(nameCheck.error || (language === 'hi' ? 'कृपया अपना वास्तविक पूरा नाम दर्ज करें।' : 'Please enter a valid legal name.'));
      return;
    }

    // 2. Validate Email
    if (!effectiveEmail || !effectiveEmail.includes('@') || !effectiveEmail.includes('.')) {
      setValidationError(
        language === 'hi' ? 'कृपया एक मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.'
      );
      return;
    }

    // 3. Validate Date of Birth & Age
    const dobCheck = validateRealDob(dob, language);
    if (!dobCheck.valid) {
      setValidationError(dobCheck.error || (language === 'hi' ? 'अमान्य जन्म तिथि दर्ज की गई है।' : 'Invalid Date of Birth.'));
      return;
    }

    // 4. Validate National Identity Number (Aadhaar UIDAI Verhoeff Checksum / SSN / SIN / CPF)
    const idCheck = validateRealNationalId(nationalIdInput, country, language);
    if (!idCheck.valid) {
      setValidationError(idCheck.error || (language === 'hi' ? 'अमान्य पहचान पत्र नंबर दर्ज किया गया है।' : 'Invalid National ID number.'));
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate clean masked national ID string
      const cleanDigits = idCheck.cleanId;
      let maskedId = '';
      if (country === 'IN' && cleanDigits.length === 12) {
        maskedId = `XXXX-XXXX-${cleanDigits.slice(-4)}`;
      } else if (country === 'US' && cleanDigits.length === 9) {
        maskedId = `XXX-XX-${cleanDigits.slice(-4)}`;
      } else {
        const lastDigits = cleanDigits.slice(-4);
        maskedId = `***-${lastDigits}`;
      }

      onComplete({
        fullName: effectiveName,
        email: effectiveEmail,
        photoURL,
        lifePhase: selectedRole,
        age: dobCheck.age,
        dob,
        casteCategory,
        state: division,
        gender,
        country,
        nationalIdName: countryMeta.nationalIdName,
        nationalIdMasked: maskedId,
        administrativeDivision: division,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col max-h-[94vh] z-10 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. Header Banner: Distinct Sign Up Designation */}
        <div className="p-4 sm:p-5 border-b border-emerald-900/20 bg-slate-950 text-white relative">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={effectiveName || 'User'}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 border-2 border-emerald-400/60 flex items-center justify-center text-lg font-black text-white shrink-0 shadow-md">
                  {effectiveName ? effectiveName.charAt(0).toUpperCase() : <ShieldCheck className="w-6 h-6 text-white" />}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-tight">
                    {language === 'hi' ? 'नागरिक साइन अप (नया पंजीकरण)' : 'Citizen Sign Up (Registration)'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    Sign Up
                  </span>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <span className="text-emerald-400 font-semibold">
                    {language === 'hi' ? 'वास्तविक पहचान व पात्रता सत्यापन' : 'Verified Real Identity & Eligibility'}
                  </span>
                  <span>•</span>
                  <span className="text-slate-400">{countryMeta.flag} {countryMeta.name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Interactive Sign Up Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain">
          
          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{validationError}</div>
            </div>
          )}

          {/* Google Linked Notice if active */}
          {googleUser && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {language === 'hi'
                    ? `Google खाता लिंक किया गया: ${googleUser.email}`
                    : `Linked Google Account: ${googleUser.email}`}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-950">
                Verified Google
              </span>
            </div>
          )}

          {/* Section 1: Real Legal Identity (Full Name & Email) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? '1. वास्तविक व्यक्तिगत विवरण' : '1. Legal Personal Details'}</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'दस्तावेज़ अनुसार' : 'As per official ID'}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'पूरा कानूनी नाम (Full Name) *' : 'Full Legal Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. राहुल कुमार शर्मा' : 'e.g. Johnathan Smith'}
                  className={`w-full py-2.5 px-3 rounded-xl bg-white border text-xs font-bold text-slate-900 outline-none transition-all ${
                    nameValidation && !nameValidation.valid
                      ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                      : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
                {nameValidation && !nameValidation.valid && (
                  <p className="text-[10px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{nameValidation.error}</span>
                  </p>
                )}
                {nameValidation && nameValidation.valid && (
                  <p className="text-[10px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{language === 'hi' ? 'नाम प्रारूप वैध है' : 'Valid legal name format'}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? 'ईमेल पता (Email) *' : 'Email Address *'}</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@gmail.com"
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  {language === 'hi' ? 'महत्वपूर्ण सूचनाएं इसी ईमेल पर भेजी जाएंगी।' : 'Official updates will be sent to this email.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Country Selection (Determines National ID & Social Categories) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? '2. देश चुनें (Select Country)' : '2. Select Country'}</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {countryMeta.currencyCode} ({countryMeta.currencySymbol})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(COUNTRIES).map((c) => {
                const isSelected = country === c.code;
                return (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => setCountry(c.code as CountryCode)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/90 shadow-sm ring-1 ring-emerald-500/30 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs text-slate-800 min-w-0">
                      <span className="text-sm shrink-0">{c.flag}</span>
                      <span className="text-[11px] font-mono font-bold text-slate-900 shrink-0">{c.alpha3}</span>
                      <span className="truncate text-slate-600 text-[11px]">{c.name}</span>
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Date of Birth, Auto-Computed Age & National ID */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'hi'
                    ? '3. जन्म तिथि, आयु एवं राष्ट्रीय पहचान पत्र'
                    : '3. Date of Birth, Age & National ID'}
                </span>
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                {language === 'hi' ? 'नो फेक डेटा सत्यापन' : 'Zero Fake Policy'}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Date of Birth Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'hi' ? 'जन्म तिथि (Date of Birth) *' : 'Date of Birth *'}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">YYYY-MM-DD</span>
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  max={maxDob}
                  min={minDob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                />

                {/* Auto-Calculated Age Badge (Prevents fake age input) */}
                <div className="mt-1.5">
                  {dobValidation && dobValidation.valid ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>
                        {language === 'hi'
                          ? `आयु: ${calculatedAge} वर्ष (जन्म तिथि अनुसार स्वतः सत्यापित)`
                          : `Age: ${calculatedAge} years (Auto-calculated from DOB)`}
                      </span>
                    </div>
                  ) : dobValidation && !dobValidation.valid ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 border border-red-300 text-red-900 text-[11px] font-bold">
                      <AlertCircle className="w-3.5 h-3.5 text-red-700 shrink-0" />
                      <span>{dobValidation.error}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* National Identity Input with Live Anti-Fraud Verification */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{countryMeta.nationalIdName} *</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                    {countryMeta.alpha3 || country}
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={nationalIdInput}
                  onChange={(e) => setNationalIdInput(e.target.value)}
                  placeholder={countryMeta.nationalIdPlaceholder}
                  className={`w-full py-2.5 px-3 rounded-xl bg-white border text-xs font-bold text-slate-900 outline-none transition-all ${
                    nationalIdValidation && !nationalIdValidation.valid
                      ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                      : nationalIdValidation && nationalIdValidation.valid
                      ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />

                {/* Real-time National ID Checksum Status Badge */}
                <div className="mt-1.5">
                  {nationalIdValidation && nationalIdValidation.valid ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>
                        {country === 'IN'
                          ? (language === 'hi' ? 'UIDAI Verhoeff चेकसम सत्यापित (वैध आधार कार्ड)' : 'UIDAI Verhoeff Checksum Valid (Aadhaar)')
                          : (language === 'hi' ? `मान्य ${countryMeta.nationalIdName} प्रारूप` : `Valid ${countryMeta.nationalIdName} format`)}
                      </span>
                    </div>
                  ) : nationalIdValidation && !nationalIdValidation.valid ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-100 border border-red-300 text-red-900 text-[11px] font-bold">
                      <AlertCircle className="w-3.5 h-3.5 text-red-700 shrink-0" />
                      <span className="truncate">{nationalIdValidation.error}</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500">
                      {country === 'IN'
                        ? (language === 'hi' ? '12 अंकों का वैध आधार नंबर (UIDAI Verhoeff गणितीय जांच लागू)' : '12-digit Aadhaar (UIDAI Verhoeff check enforced)')
                        : (language === 'hi' ? `इस देश का आधिकारिक ${countryMeta.nationalIdName} दर्ज करें` : `Enter official ${countryMeta.nationalIdName}`)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Country-Specific Caste / Social Equity Category Feature */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
            <h4 className="text-xs font-extrabold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'hi' ? '4. सामाजिक / जाति वर्ग एवं राज्य' : '4. Social / Caste Category & Region'}
                </span>
              </span>
              <span className="text-[10px] font-bold text-slate-500">
                {countryMeta.hasCasteSystem ? 'Caste System (India)' : 'Social Equity & Demographics'}
              </span>
            </h4>

            {/* Country-Specific Notice Banner */}
            {countryMeta.hasCasteSystem ? (
              <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 font-medium">
                <span className="text-base shrink-0">🇮🇳</span>
                <span className="leading-tight">
                  {language === 'hi'
                    ? 'भारत सरकार आधिकारिक जाति वर्ग प्रणाली: सरकारी योजनाओं, छात्रवृत्ति व आरक्षण हेतु लागू।'
                    : 'Government of India Official Caste Categories: Applicable for constitutional affirmative action & schemes.'}
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-900 text-xs flex items-center gap-2 font-medium">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="leading-tight">
                  {language === 'hi'
                    ? `${countryMeta.name} में जाति व्यवस्था नहीं है। इसके स्थान पर आधिकारिक जनसांख्यिकी / समानता वर्ग लागू है:`
                    : `The caste system does not exist in ${countryMeta.name}. Official equity & demographic categories apply:`}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Dynamic Category Dropdown (Country-specific) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>
                    {language === 'hi' ? countryMeta.categoryLabelHi : countryMeta.categoryLabel} *
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {countryMeta.hasCasteSystem ? 'Caste' : 'Equity'}
                  </span>
                </label>
                <select
                  value={casteCategory}
                  onChange={(e) => setCasteCategory(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {language === 'hi' ? cat.labelHi : cat.label} {cat.desc ? `(${cat.desc})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1 truncate">
                  {availableCategories.find((c) => c.id === casteCategory)?.descHi ||
                    availableCategories.find((c) => c.id === casteCategory)?.desc ||
                    'Official category for targeted scholarships and benefits'}
                </p>
              </div>

              {/* Administrative Division / State */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{countryMeta.administrativeLabel} *</span>
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                >
                  {countryMeta.divisions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  {language === 'hi' ? 'राज्य स्तरीय योजना पात्रता हेतु' : 'For state/regional scheme eligibility'}
                </p>
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                {language === 'hi' ? 'लिंग (Gender) *' : 'Gender *'}
              </label>
              <div className="grid grid-cols-3 gap-2 bg-white p-1 rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('onboarding.male')}
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('onboarding.female')}
                </button>
                <button
                  type="button"
                  onClick={() => setGender('other')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    gender === 'other'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t('onboarding.other')}
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Occupation / Role Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? '5. वर्तमान भूमिका / व्यवसाय चुनें' : '5. Select Current Role'}</span>
              </label>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Targeted AI Matching
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {ROLES_LIST.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = selectedRole === opt.id;
                const roleTitle = t(`roles.${opt.id}`);
                const roleDesc = t(`roles.${opt.id}_desc`);

                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => handleRoleSelect(opt.id)}
                    className={`text-left p-3 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>

                    <div className="mt-2.5">
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          isSelected ? 'text-emerald-950 font-black' : 'text-slate-800'
                        }`}
                      >
                        {roleTitle}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {roleDesc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy & Anti-Fraud Guarantee Note */}
          <div className="p-3.5 rounded-2xl bg-slate-100/90 border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">
                {language === 'hi' ? 'गोपनीयता एवं कानूनी सुरक्षा' : 'Data Privacy & Legal Guarantee'}
              </span>
              <span>
                {language === 'hi'
                  ? 'आपका पहचान पत्र नंबर एन्क्रिप्टेड और सुरक्षित रहता है। केवल प्रामाणिक सरकारी योजनाओं व छात्रवृत्ति मिलान हेतु उपयोग किया जाता है।'
                  : 'Your ID is masked and encrypted. Used solely for genuine eligibility matching with official government portals.'}
              </span>
            </div>
          </div>

          {/* Submit Sign Up Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>
              {isSubmitting
                ? (language === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying...')
                : (language === 'hi' ? 'सत्यापित साइन अप पूर्ण करें (Complete Sign Up)' : 'Complete Verified Sign Up')}
            </span>
          </button>

          {/* Switch to Sign In if already registered */}
          <div className="text-center pt-1 pb-1">
            <p className="text-xs text-slate-500">
              <span>{language === 'hi' ? 'पहले से पंजीकृत नागरिक हैं? ' : 'Already registered? '}</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onSwitchToSignIn) {
                    onSwitchToSignIn();
                  }
                }}
                className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer ml-1"
              >
                {language === 'hi' ? 'साइन इन करें (Sign In)' : 'Sign In'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
