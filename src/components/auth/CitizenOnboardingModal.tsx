'use client';

import React, { useState, useEffect } from 'react';
import { CitizenProfile } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
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
  }) => void;
}

interface RoleOption {
  id: CitizenProfile['lifePhase'];
  titleHi: string;
  titleEn: string;
  descHi: string;
  descEn: string;
  icon: React.ElementType;
  defaultAge: number;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'college_student',
    titleHi: 'कॉलेज छात्र',
    titleEn: 'College Student',
    descHi: 'डिग्री, इंटर्नशिप, फ्री गैजेट्स व स्कॉलरशिप',
    descEn: 'Degrees, paid internships, free devices & scholarships',
    icon: GraduationCap,
    defaultAge: 21,
  },
  {
    id: 'school_student',
    titleHi: 'स्कूली छात्र (9वीं-12वीं)',
    titleEn: 'School Student',
    descHi: 'स्कूल छात्रवृत्ति, मेधावी योजना व साइकिल/टैबलेट',
    descEn: 'Pre-matric scholarships, merit awards & educational kits',
    icon: BookOpen,
    defaultAge: 16,
  },
  {
    id: 'exam_aspirant',
    titleHi: 'प्रतियोगी परीक्षा (Govt Exams)',
    titleEn: 'Exam Aspirant',
    descHi: 'UPSC, SSC, Railway, State PCS व फ्री कोचिंग',
    descEn: 'Govt recruitments, SSC/UPSC, exam fee waivers & coaching',
    icon: Award,
    defaultAge: 23,
  },
  {
    id: 'job_seeker',
    titleHi: 'नौकरी की तलाश (Private Jobs)',
    titleEn: 'Job Seeker',
    descHi: 'प्राइवेट नौकरियां, वॉक-इन इंटरव्यू व रोजगार मेले',
    descEn: 'Direct corporate hiring, remote roles & placement drives',
    icon: Briefcase,
    defaultAge: 24,
  },
  {
    id: 'farmer',
    titleHi: 'किसान (Farmer)',
    titleEn: 'Farmer (Kisan)',
    descHi: 'PM किसान ₹6000, फसल बीमा, सोलर पम्प व कृषि यंत्र',
    descEn: 'Direct farm subsidy, equipment grants & crop insurance',
    icon: SproutIcon,
    defaultAge: 42,
  },
  {
    id: 'business_owner',
    titleHi: 'व्यापारी / स्व-रोजगार',
    titleEn: 'Business / Shop Owner',
    descHi: 'मुद्रा लोन, PMEGP 35% सब्सिडी व MSME ग्रांट',
    descEn: 'Collateral-free loans, startup seed funds & MSME grants',
    icon: Building2,
    defaultAge: 35,
  },
  {
    id: 'employed',
    titleHi: 'नौकरीपेशा (Employed)',
    titleEn: 'Employed / Corporate',
    descHi: 'कौशल विकास, टैक्स बचत व सर्टिफिकेशन सब्सिडी',
    descEn: 'Career upskilling, government certifications & tax perks',
    icon: Wrench,
    defaultAge: 29,
  },
  {
    id: 'homemaker',
    titleHi: 'गृहणी / महिला',
    titleEn: 'Homemaker / Women',
    descHi: 'लाडली बहना, फ्री सिलाई मशीन व स्वयं सहायता समूह',
    descEn: 'Direct DBT assistance, free sewing kits & micro-credit',
    icon: HeartHandshake,
    defaultAge: 32,
  },
  {
    id: 'senior_citizen',
    titleHi: 'वरिष्ठ नागरिक (60+)',
    titleEn: 'Senior Citizen',
    descHi: 'आयुष्मान वय वंदना ₹5 लाख फ्री इलाज व वृद्धावस्था पेंशन',
    descEn: 'Ayushman health cover ₹5 Lakh & state pension schemes',
    icon: HeartPulse,
    defaultAge: 63,
  },
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

const INDIAN_STATES = [
  'Uttar Pradesh',
  'Bihar',
  'Madhya Pradesh',
  'Rajasthan',
  'Delhi',
  'Haryana',
  'Gujarat',
  'Punjab',
  'Maharashtra',
  'West Bengal',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Himachal Pradesh',
  'Assam',
  'Odisha',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
];

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
  const { language } = useTranslation();

  const [selectedRole, setSelectedRole] = useState<CitizenProfile['lifePhase']>(initialRole);
  const [age, setAge] = useState<number>(21);
  const [casteCategory, setCasteCategory] = useState<CitizenProfile['casteCategory']>('General');
  const [state, setState] = useState<string>('Uttar Pradesh');
  const [gender, setGender] = useState<CitizenProfile['gender']>('male');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync default age when role changes
  const handleRoleSelect = (roleId: CitizenProfile['lifePhase']) => {
    setSelectedRole(roleId);
    const roleOpt = ROLE_OPTIONS.find((r) => r.id === roleId);
    if (roleOpt) {
      setAge(roleOpt.defaultAge);
    }
  };

  // Lock scroll when open
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

  const displayName = googleUser?.name || 'Citizen';
  const displayEmail = googleUser?.email || '';
  const photoURL = googleUser?.photoURL;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      onComplete({
        fullName: displayName,
        email: displayEmail,
        photoURL: photoURL,
        lifePhase: selectedRole,
        age: Number(age) || 21,
        casteCategory,
        state,
        gender,
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
        <div className="p-4 sm:p-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white relative">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white/80 shadow-md shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/80 flex items-center justify-center text-lg font-black text-white shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                    {language === 'hi' ? `नमस्ते, ${displayName}!` : `Welcome, ${displayName}!`}
                  </h3>
                  <span className="p-0.5 rounded-full bg-emerald-400 text-emerald-950">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 flex items-center gap-1 mt-0.5">
                  <span>{displayEmail}</span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-200">
                    {language === 'hi' ? 'Google द्वारा सत्यापित' : 'Google Verified'}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/15 text-xs text-emerald-50/95 leading-relaxed">
            {language === 'hi'
              ? '🎯 अपनी पात्रता के 100% सही सरकारी व निजी अवसर पाने के लिए केवल अपना कार्यक्षेत्र चुनें:'
              : '🎯 Select your role & basic details to unlock customized opportunities and eligibility:'}
          </div>
        </div>

        {/* 2. Interactive Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 overscroll-contain">
          
          {/* A. Select Occupation / Role */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                  १
                </span>
                <span>{language === 'hi' ? 'अपना मुख्य कार्यक्षेत्र / पेशा चुनें:' : 'Select Your Primary Role / Occupation:'}</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {language === 'hi' ? 'अनिवार्य' : 'Required'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              {ROLE_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = selectedRole === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => handleRoleSelect(opt.id)}
                    className={`text-left p-3 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
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
                        {language === 'hi' ? opt.titleHi : opt.titleEn}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {language === 'hi' ? opt.descHi : opt.descEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* B. Secondary Details: Age, Category, State, Gender */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3.5">
            <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                २
              </span>
              <span>{language === 'hi' ? 'पात्रता विवरण (Eligibility Criteria):' : 'Eligibility Criteria:'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Age */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? 'आपकी आयु (वर्ष)' : 'Age (Years)'}</span>
                </label>
                <select
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                >
                  {Array.from({ length: 65 }, (_, i) => i + 14).map((a) => (
                    <option key={a} value={a}>
                      {a} {language === 'hi' ? 'वर्ष' : 'Yrs'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Caste Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? 'सामाजिक वर्ग' : 'Category'}</span>
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

              {/* State */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? 'राज्य' : 'State'}</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {language === 'hi' ? 'लिंग' : 'Gender'}
                </label>
                <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-1 rounded-lg text-[11px] font-bold transition-all ${
                      gender === 'male'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {language === 'hi' ? 'पुरुष' : 'Male'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-1 rounded-lg text-[11px] font-bold transition-all ${
                      gender === 'female'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {language === 'hi' ? 'महिला' : 'Female'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('other')}
                    className={`py-1 rounded-lg text-[11px] font-bold transition-all ${
                      gender === 'other'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {language === 'hi' ? 'अन्य' : 'Other'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* C. Action Bar */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>
                {language === 'hi'
                  ? 'अवसर अनलॉक करें (Complete & Unlock Opportunities) 🚀'
                  : 'Unlock Verified Opportunities 🚀'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-center text-slate-500">
              {language === 'hi'
                ? '🔒 यह विवरण केवल आपकी सही सरकारी योजनाएं व अवसर प्रदर्शित करने के लिए सुरक्षित रहता है।'
                : '🔒 This information is securely kept to match genuine government and career opportunities.'}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
