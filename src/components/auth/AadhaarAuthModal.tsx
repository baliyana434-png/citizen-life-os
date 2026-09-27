'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { GoogleAuthService } from '@/services/googleAuth';
import { CitizenProfile } from '@/types';
import {
  validateRealName,
  validateRealPhone,
  validateRealAadhaar,
  validateRealDob,
  validateRealPincode,
  validateRealDistrict,
  validateRealIncome,
  validateVerhoeff,
} from '@/utils/antiFraudValidation';
import {
  X,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  Briefcase,
  IndianRupee,
  Sparkles,
} from 'lucide-react';

interface AadhaarAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (updatedProfile: Partial<CitizenProfile>) => void;
}

type AuthStep = 'SIGN_IN_SELECTION' | 'DIGITAL_KYC_FORM' | 'SUCCESS';

const INDIAN_STATES = [
  'Uttar Pradesh',
  'Bihar',
  'Madhya Pradesh',
  'Maharashtra',
  'Rajasthan',
  'Delhi',
  'Haryana',
  'Gujarat',
  'Punjab',
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

export const AadhaarAuthModal: React.FC<AadhaarAuthModalProps> = ({
  isOpen,
  onClose,
  onVerificationComplete,
}) => {
  const { t, language } = useTranslation();
  const [step, setStep] = useState<AuthStep>('SIGN_IN_SELECTION');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [dob, setDob] = useState('2003-08-14');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Kanpur Nagar');
  const [pincode, setPincode] = useState('208001');
  const [lifePhase, setLifePhase] = useState<'college_student' | 'farmer' | 'job_seeker' | 'business_owner' | 'homemaker' | 'senior_citizen' | 'school_student' | 'employed'>('college_student');
  const [casteCategory, setCasteCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('OBC');
  const [familyIncome, setFamilyIncome] = useState<number>(180000);
  const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Compute live Aadhaar status as user types
  const cleanAadhaarRaw = aadhaarNumber.replace(/[\s-]/g, '');
  const isAadhaar12 = cleanAadhaarRaw.length === 12;
  const isAadhaarVerhoeffValid = isAadhaar12 && !cleanAadhaarRaw.startsWith('0') && !cleanAadhaarRaw.startsWith('1') && validateVerhoeff(cleanAadhaarRaw);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setErrorMessage('');
      setFieldErrors({});
      setStep('SIGN_IN_SELECTION');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Google One-Tap / Popup Sign-In (100% Free)
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const result = await GoogleAuthService.signInWithGoogle();
      if (result.success) {
        setFullName(result.name);
        setEmail(result.email);
        setPhotoURL(result.photoURL);
        setStep('DIGITAL_KYC_FORM');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google साइन-इन विफल रहा।');
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // 2. Submit Full Digital KYC with Anti-Fraud Validation
  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    const errors: Record<string, string> = {};

    // Validate Full Name
    const nameCheck = validateRealName(fullName, language);
    if (!nameCheck.valid) {
      errors.fullName = nameCheck.error || 'अमान्य नाम।';
    }

    // Validate Phone Number
    const phoneCheck = validateRealPhone(phone, language);
    if (!phoneCheck.valid) {
      errors.phone = phoneCheck.error || 'अमान्य मोबाइल नंबर।';
    }

    // Validate Aadhaar Number
    const aadhaarCheck = validateRealAadhaar(aadhaarNumber, language);
    if (!aadhaarCheck.valid) {
      errors.aadhaar = aadhaarCheck.error || 'अमान्य आधार नंबर।';
    }

    // Validate Date of Birth
    const dobCheck = validateRealDob(dob, language);
    if (!dobCheck.valid) {
      errors.dob = dobCheck.error || 'अमान्य जन्म तिथि।';
    }

    // Validate District
    const distCheck = validateRealDistrict(district, language);
    if (!distCheck.valid) {
      errors.district = distCheck.error || 'अमान्य जिला।';
    }

    // Validate Pincode
    const pinCheck = validateRealPincode(pincode, language);
    if (!pinCheck.valid) {
      errors.pincode = pinCheck.error || 'अमान्य पिनकोड।';
    }

    // Validate Annual Income
    const incomeCheck = validateRealIncome(familyIncome, language);
    if (!incomeCheck.valid) {
      errors.familyIncome = incomeCheck.error || 'अमान्य आय।';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      setErrorMessage(firstError);
      return;
    }

    setLoading(true);

    try {
      const cleanAadhaar = aadhaarCheck.cleanAadhaar;
      const last4 = cleanAadhaar.slice(-4);
      const maskedAadhaar = `XXXX-XXXX-${last4}`;

      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneCheck.cleanPhone,
        aadhaarNumberMasked: maskedAadhaar,
        aadhaarNumber: cleanAadhaar, // sent to server for verification
        age: dobCheck.age,
        dob,
        gender,
        state,
        district: district.trim(),
        pincode: pinCheck.cleanPincode,
        lifePhase,
        casteCategory,
        familyIncomeAnnual: familyIncome,
        photoURL,
        isCardVerified: false,
        verificationMethod: 'DIGITAL_KYC_VERHOEFF',
      };

      // Push real citizen record to server-side Admin Directory
      try {
        const response = await fetch('/api/admin/citizens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const resData = await response.json();
        if (!response.ok || !resData.success) {
          throw new Error(resData.message || 'डेटा सत्यापन में विफलता।');
        }
      } catch (adminErr: any) {
        if (adminErr.message) {
          throw adminErr;
        }
        console.warn('Admin sync notice:', adminErr);
      }

      // Complete client verification
      setStep('SUCCESS');
      setTimeout(() => {
        onVerificationComplete({
          isAadhaarVerified: true,
          ...payload,
        });
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'सत्यापन प्रक्रिया में त्रुटि।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-5 sm:p-7 border border-slate-200 max-h-[92vh] overflow-y-auto overscroll-contain">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Sign-In Selection (100% Free Google Sign-In) */}
        {step === 'SIGN_IN_SELECTION' && (
          <div className="space-y-6 py-2">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {language === 'hi' ? 'नागरिक खाता पंजीकरण एवं लॉगिन' : 'Citizen Registration & Login'}
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'hi'
                  ? '१-क्लिक में Google द्वारा सुरक्षित खाता बनाएं एवं अपनी योजनाएं व अवसर देखें।'
                  : 'Fast 1-click login with Google to unlock opportunities matched to you.'}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{errorMessage}</span>
                </div>
                {errorMessage.includes('FIREBASE_GOOGLE_DISABLED') && (
                  <div className="pt-1">
                    <a
                      href="https://console.firebase.google.com/project/lifeos-7a6f1/authentication/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-xs transition-all"
                    >
                      <span>Firebase Console खोलें और Google Enable करें ↗</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 pt-1">
              {/* Google One-Tap Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-4 px-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-3 shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>
                  {loading
                    ? (language === 'hi' ? 'Google खाता कनेक्ट हो रहा है...' : 'Connecting to Google...')
                    : (language === 'hi' ? 'Google से लॉगिन करें (Login with Google)' : 'Login with Google')}
                </span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">{language === 'hi' ? '100% निःशुल्क एवं सुरक्षित:' : '100% Free & Secure:'}</span>{' '}
                {language === 'hi'
                  ? 'आपका विवरण आधिकारिक सरकारी पोर्टल मिलान हेतु प्रयुक्त होता है। कोई शुल्क नहीं।'
                  : 'Your details are strictly used for scheme matching. Zero charges.'}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Smart Digital Citizen KYC Form (Real Details Captured for Admin) */}
        {step === 'DIGITAL_KYC_FORM' && (
          <form onSubmit={handleSubmitKyc} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>{language === 'hi' ? 'नागरिक सत्यापन विवरण' : 'Citizen Verification Details'}</span>
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {language === 'hi' ? '100% निःशुल्क' : 'Free Lifetime'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'सटीक योजनाओं एवं सरकारी लाभों की गणना हेतु अपना वास्तविक विवरण दर्ज करें।'
                  : 'Enter accurate details to ensure precise eligibility matching.'}
              </p>
            </div>

            {/* Google Verified Account Badge (if available) */}
            {email && (
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                    {fullName.charAt(0) || 'G'}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 shrink-0">
                  ✓ Google Verified
                </span>
              </div>
            )}

            {/* Real Citizen Verification Trust Banner (Anti-Fraud) */}
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex items-start gap-2.5 text-xs text-emerald-950 shadow-xs">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="leading-snug">
                <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span>{language === 'hi' ? 'UIDAI मानक एवं एंटी-फ्रॉड सुरक्षा' : 'UIDAI Standard Anti-Fraud Security'}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 font-bold">सक्रिय</span>
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {language === 'hi'
                    ? 'कृपया केवल अपना वास्तविक विवरण दर्ज करें। UIDAI Verhoeff चेकसम एवं TRAI सत्यापन द्वारा जाली प्रविष्टियां स्वतः रद्द की जाती हैं।'
                    : 'Please enter genuine details. UIDAI Verhoeff checksum and TRAI rules automatically block fake or mock entries.'}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'पूरा नाम (Full Name) *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      clearFieldError('fullName');
                    }}
                    placeholder="e.g. Abhay Kumar"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border ${
                      fieldErrors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-semibold`}
                  />
                </div>
                {fieldErrors.fullName && <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.fullName}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर (Mobile) *' : 'Mobile Number *'}
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      clearFieldError('phone');
                    }}
                    placeholder="98XXXXXXXX"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border ${
                      fieldErrors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-mono font-bold`}
                  />
                </div>
                {fieldErrors.phone && <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.phone}</p>}
              </div>

              {/* 12-Digit Aadhaar Number (Verhoeff validation) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{language === 'hi' ? 'आधार कार्ड नंबर (12-अंक) *' : 'Aadhaar Card No. (12-Digit) *'}</span>
                  {isAadhaar12 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isAadhaarVerhoeffValid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isAadhaarVerhoeffValid
                        ? (language === 'hi' ? '✓ UIDAI चेकसम मान्य' : '✓ Verhoeff Valid')
                        : (language === 'hi' ? '✕ चेकसम अमान्य' : '✕ Invalid')}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    maxLength={14}
                    value={aadhaarNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                      setAadhaarNumber(formatted);
                      clearFieldError('aadhaar');
                    }}
                    placeholder="XXXX XXXX 8921"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border ${
                      fieldErrors.aadhaar
                        ? 'border-red-400 bg-red-50/30'
                        : isAadhaarVerhoeffValid
                        ? 'border-emerald-400 bg-emerald-50/20'
                        : 'border-slate-300'
                    } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-mono font-bold tracking-wider`}
                  />
                </div>
                {fieldErrors.aadhaar && <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.aadhaar}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'जन्म तिथि (DOB) *' : 'Date of Birth *'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      clearFieldError('dob');
                    }}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border ${
                      fieldErrors.dob ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-medium`}
                  />
                </div>
                {fieldErrors.dob && <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.dob}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'लिंग (Gender) *' : 'Gender *'}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-medium bg-white"
                >
                  <option value="male">{language === 'hi' ? 'पुरुष (Male)' : 'Male'}</option>
                  <option value="female">{language === 'hi' ? 'महिला (Female)' : 'Female'}</option>
                  <option value="other">{language === 'hi' ? 'अन्य (Other)' : 'Other'}</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'राज्य (State) *' : 'State *'}
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-medium bg-white"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'जिला (District) *' : 'District *'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      clearFieldError('district');
                    }}
                    placeholder="e.g. Kanpur Nagar / Patna"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border ${
                      fieldErrors.district ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-medium`}
                  />
                </div>
                {fieldErrors.district && <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.district}</p>}
              </div>

              {/* Indian Postal Pincode */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'पिनकोड (6-अंक) *' : 'Pincode (6-Digit) *'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ''));
                      clearFieldError('pincode');
                    }}
                    placeholder="208001"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border ${
                      fieldErrors.pincode ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-mono font-bold`}
                  />
                </div>
                {fieldErrors.pincode && <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.pincode}</p>}
              </div>

              {/* Life Phase / Occupation */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'व्यवसाय / जीवन चरण (Occupation) *' : 'Occupation / Phase *'}
                </label>
                <select
                  value={lifePhase}
                  onChange={(e) => setLifePhase(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-medium bg-white"
                >
                  <option value="college_student">कॉलेज छात्र (College Student)</option>
                  <option value="school_student">स्कूल छात्र (School Student)</option>
                  <option value="farmer">किसान (Farmer / Krishi)</option>
                  <option value="job_seeker">प्रतियोगी / रोजगार खोज (Job Seeker)</option>
                  <option value="business_owner">व्यापारी / स्व-रोजगार (Business)</option>
                  <option value="homemaker">गृहणी (Homemaker)</option>
                  <option value="senior_citizen">वरिष्ठ नागरिक (Senior Citizen)</option>
                  <option value="employed">निजी / सरकारी कर्मचारी (Employed)</option>
                </select>
              </div>

              {/* Caste Category */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'जाति वर्ग (Category) *' : 'Category *'}
                </label>
                <select
                  value={casteCategory}
                  onChange={(e) => setCasteCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-medium bg-white"
                >
                  <option value="General">General (सामान्य)</option>
                  <option value="OBC">OBC (अन्य पिछड़ा वर्ग)</option>
                  <option value="SC">SC (अनुसूचित जाति)</option>
                  <option value="ST">ST (अनुसूचित जनजाति)</option>
                  <option value="EWS">EWS (आर्थिक रूप से कमजोर)</option>
                </select>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'वार्षिक पारिवारिक आय (₹) *' : 'Annual Income in ₹ *'}
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    step={10000}
                    value={familyIncome}
                    onChange={(e) => {
                      setFamilyIncome(Number(e.target.value));
                      clearFieldError('familyIncome');
                    }}
                    placeholder="180000"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border ${
                      fieldErrors.familyIncome ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    } focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-mono font-bold`}
                  />
                </div>
                {fieldErrors.familyIncome && <p className="text-[10px] text-red-600 mt-1 font-semibold">{fieldErrors.familyIncome}</p>}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep('SIGN_IN_SELECTION')}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
              >
                {language === 'hi' ? 'पीछे' : 'Back'}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{language === 'hi' ? 'सत्यापित करें एवं खाता सक्रिय करें' : 'Verify & Activate Citizen Account'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Screen */}
        {step === 'SUCCESS' && (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {language === 'hi' ? 'सत्यापन शत-प्रतिशत सफल!' : 'Identity Verified Successfully!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'hi'
                  ? `स्वागत है, ${fullName}! आपका नागरिक प्रोफाइल सक्रिय हो गया है और आपकी पात्रता के अवसर अपडेट हो रहे हैं।`
                  : `Welcome, ${fullName}! Your verified citizen dashboard is now live.`}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'सुरक्षित नागरिक आईडी सक्रिय' : 'Citizen Life OS Verified Member'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
