'use client';

import React, { useState, useEffect } from 'react';
import { CitizenProfile, CountryCode } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry, COUNTRIES } from '@/context/CountryContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  Building2,
  Wrench,
  HeartHandshake,
  HeartPulse,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Globe,
  Mail,
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
    casteCategory: CitizenProfile['casteCategory'];
    state: string;
    gender: CitizenProfile['gender'];
    country?: CountryCode;
    nationalIdName?: string;
    nationalIdMasked?: string;
    administrativeDivision?: string;
  }) => void;
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
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
    </svg>
  );
}

const CATEGORIES: CitizenProfile['casteCategory'][] = [
  'General',
  'OBC',
  'SC',
  'ST',
  'EWS',
];

export const CitizenOnboardingModal: React.FC<CitizenOnboardingModalProps> = ({
  isOpen,
  onClose,
  googleUser,
  initialRole = 'college_student',
  onComplete,
}) => {
  const { t, language } = useTranslation();
  const { country, setCountry, countryMeta } = useCountry();

  const [selectedRole, setSelectedRole] = useState<CitizenProfile['lifePhase']>(initialRole);
  const [age, setAge] = useState<number>(21);
  const [casteCategory, setCasteCategory] = useState<CitizenProfile['casteCategory']>('General');
  const [division, setDivision] = useState<string>(countryMeta.divisions[0] || 'General');
  const [gender, setGender] = useState<CitizenProfile['gender']>('male');
  const [nationalIdInput, setNationalIdInput] = useState<string>('');
  const [manualName, setManualName] = useState<string>('');
  const [manualEmail, setManualEmail] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (countryMeta.divisions.length > 0) {
      setDivision(countryMeta.divisions[0]);
    }
  }, [country, countryMeta]);

  // Sync default age when role changes
  const handleRoleSelect = (roleId: CitizenProfile['lifePhase']) => {
    setSelectedRole(roleId);
    const roleOpt = ROLES_LIST.find((r) => r.id === roleId);
    if (roleOpt) {
      setAge(roleOpt.defaultAge);
    }
  };

  // Lock scroll when modal is open
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

  const displayName = googleUser?.name || manualName.trim() || (language === 'hi' ? 'नागरिक' : 'Citizen');
  const displayEmail = googleUser?.email || manualEmail.trim() || '';
  const photoURL = googleUser?.photoURL;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!googleUser) {
      if (!manualName.trim()) {
        setValidationError(
          language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.'
        );
        return;
      }
      if (!manualEmail.trim() || !manualEmail.includes('@')) {
        setValidationError(
          language === 'hi'
            ? 'कृपया एक मान्य ईमेल पता दर्ज करें।'
            : 'Please enter a valid email address.'
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      const generatedCitizenId = `${countryMeta.alpha3 || country}-CIT-2026-${randomSeq}`;
      const maskedId = nationalIdInput.trim()
        ? `***-${nationalIdInput.trim().slice(-4)}`
        : generatedCitizenId;

      onComplete({
        fullName: displayName,
        email: displayEmail || `${Date.now()}@citizen.local`,
        photoURL: photoURL,
        lifePhase: selectedRole,
        age: Number(age) || 21,
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col max-h-[92vh] z-10 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. Header Banner */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-slate-900 text-white relative">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-md shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 border-2 border-emerald-500/60 flex items-center justify-center text-lg font-black text-white shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                    {googleUser ? displayName : (manualName.trim() || (language === 'hi' ? 'नागरिक पंजीकरण' : 'Citizen Registration'))}
                  </h3>
                  <span className="p-0.5 rounded-full bg-emerald-500 text-slate-950">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <span>{displayEmail || (language === 'hi' ? 'प्रत्यक्ष सत्यापन' : 'Direct Verification')}</span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-400">
                    {t('onboarding.subtitle')}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Interactive Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 overscroll-contain">
          
          {/* Validation Error if any */}
          {validationError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
              {validationError}
            </div>
          )}

          {/* Direct Citizen Info (Full Name & Email) when not using Google Sign-in */}
          {!googleUser && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'नागरिक विवरण' : 'Citizen Details'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {language === 'hi' ? 'पूरा नाम' : 'Full Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. John Doe'}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'hi' ? 'ईमेल पता' : 'Email Address'} *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="citizen@example.com"
                    className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 1: Select Country */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>{t('onboarding.step_country')}</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {countryMeta.currencyCode}
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
                        ? 'border-emerald-600 bg-emerald-50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                      <span className="text-sm">{c.flag}</span>
                      <span className="text-[11px] font-bold text-slate-900 font-mono">{c.alpha3}</span>
                      <span className="truncate text-slate-600 text-[11px]">{c.name}</span>
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Occupation / Role */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>{t('onboarding.step_role')}</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
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

          {/* Step 3: Eligibility & National Identity */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
            <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>{t('onboarding.step_details')}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Age */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('onboarding.age_label')}</span>
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                >
                  {Array.from({ length: 65 }, (_, i) => i + 14).map((a) => (
                    <option key={a} value={a}>
                      {a} {t('hero.years_suffix')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Caste / Social Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('onboarding.category_label')}</span>
                </label>
                <select
                  value={casteCategory}
                  onChange={(e) => setCasteCategory(e.target.value as CitizenProfile['casteCategory'])}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* State / Province / Division */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{countryMeta.administrativeLabel}</span>
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                >
                  {countryMeta.divisions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {t('onboarding.gender_label')}
                </label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-1 rounded-lg text-[11px] font-bold transition-all ${
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
                    className={`py-1 rounded-lg text-[11px] font-bold transition-all ${
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
                    className={`py-1 rounded-lg text-[11px] font-bold transition-all ${
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

            {/* Step 4: National ID Input for Selected Country */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>{countryMeta.nationalIdName}</span>
              </label>
              <input
                type="text"
                value={nationalIdInput}
                onChange={(e) => setNationalIdInput(e.target.value)}
                placeholder={countryMeta.nationalIdPlaceholder}
                className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          </div>

          {/* Privacy & Locked Note */}
          <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 leading-relaxed">
            {t('onboarding.locked_note')}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {t('onboarding.complete_btn')}
          </button>
        </form>
      </div>
    </div>
  );
};
