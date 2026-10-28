'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry } from '@/context/CountryContext';
import { BrandIconSvg } from '@/components/common/BrandLogo';
import {
  validateRealName,
  validateRealDob,
  calculateExactAge,
  validateRealNationalId,
  validateRealEmail,
  validateRealPassword,
} from '@/utils/antiFraudValidation';
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { CitizenProfile, CountryCode } from '@/types';

const DRAFT_STORAGE_KEY = 'citzos_register_draft';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useTranslation();
  const { country, countryMeta } = useCountry();

  const isHi = language === 'hi';
  const queryEmail = searchParams.get('email') || '';
  const queryNotice = searchParams.get('notice');
  const nextParam = searchParams.get('next') || '/';

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>(queryEmail);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Step 2 fields
  const [dob, setDob] = useState<string>('');
  const [calculatedAge, setCalculatedAge] = useState<number>(0);
  const [nationalIdInput, setNationalIdInput] = useState<string>('');
  const [casteCategory, setCasteCategory] = useState<string>('General');
  const [division, setDivision] = useState<string>(countryMeta.divisions[0] || 'General');
  const [selectedRole, setSelectedRole] = useState<CitizenProfile['lifePhase']>('college_student');
  const [gender, setGender] = useState<CitizenProfile['gender']>('male');

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [friendlyNotice, setFriendlyNotice] = useState<string | null>(
    queryNotice === 'no_account'
      ? isHi
        ? 'इस ईमेल से कोई खाता नहीं मिला। आइए एक नया खाता बनाएं।'
        : "No account found with this email. Let's create one."
      : null
  );

  // Preload home route for instant post-auth navigation
  useEffect(() => {
    router.prefetch('/');
  }, [router]);

  // Load draft progress from sessionStorage on mount
  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const d = JSON.parse(savedDraft);
        if (d.name) setName(d.name);
        if (d.email && !queryEmail) setEmail(d.email);
        if (d.step === 2) setStep(2);
        if (d.dob) setDob(d.dob);
        if (d.nationalIdInput) setNationalIdInput(d.nationalIdInput);
        if (d.casteCategory) setCasteCategory(d.casteCategory);
        if (d.division) setDivision(d.division);
        if (d.selectedRole) setSelectedRole(d.selectedRole);
        if (d.gender) setGender(d.gender);
      }
    } catch (_) {}
  }, [queryEmail]);

  // Save draft progress to sessionStorage on field updates (never saves password)
  useEffect(() => {
    try {
      const draft = {
        name,
        email,
        step,
        dob,
        nationalIdInput,
        casteCategory,
        division,
        selectedRole,
        gender,
      };
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (_) {}
  }, [name, email, step, dob, nationalIdInput, casteCategory, division, selectedRole, gender]);

  // Calculate age dynamically from DOB
  useEffect(() => {
    if (dob) {
      const computed = calculateExactAge(dob);
      setCalculatedAge(computed);
    } else {
      setCalculatedAge(0);
    }
  }, [dob]);

  // Dynamic DOB boundaries (14 to 100 years old)
  const { maxDob, minDob } = useMemo(() => {
    const today = new Date();
    const max = `${today.getFullYear() - 14}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const min = `${today.getFullYear() - 100}-01-01`;
    return { maxDob: max, minDob: min };
  }, []);

  const availableCategories = useMemo(() => {
    if (countryMeta.socialCategories && countryMeta.socialCategories.length > 0) {
      return countryMeta.socialCategories;
    }
    return [
      { id: 'General', label: 'General', labelHi: 'सामान्य वर्ग' },
      { id: 'OBC', label: 'OBC', labelHi: 'अन्य पिछड़ा वर्ग (OBC)' },
      { id: 'SC', label: 'SC', labelHi: 'अनुसूचित जाति (SC)' },
      { id: 'ST', label: 'ST', labelHi: 'अनुसूचित जनजाति (ST)' },
      { id: 'EWS', label: 'EWS', labelHi: 'ई.डब्ल्यू.एस. (EWS)' },
    ];
  }, [countryMeta]);

  // Validate internal redirect path
  const getSafeTargetUrl = (target: string): string => {
    const trimmed = target.trim();
    if (
      trimmed.startsWith('/') &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('/\\') &&
      !trimmed.includes(':')
    ) {
      return trimmed;
    }
    return '/';
  };

  // Step 1: Validate credentials and advance to Step 2
  const handleProceedToStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const nameCheck = validateRealName(name, language);
    if (!nameCheck.valid) {
      setErrorMessage(nameCheck.error || (isHi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full legal name.'));
      return;
    }

    const emailCheck = validateRealEmail(email, language);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || (isHi ? 'कृपया मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.'));
      return;
    }

    const passwordCheck = validateRealPassword(password, name, emailCheck.cleanEmail, language);
    if (!passwordCheck.valid) {
      setErrorMessage(passwordCheck.error || (isHi ? 'कमजोर पासवर्ड।' : 'Weak password.'));
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(isHi ? 'दोनों पासवर्ड समान होने चाहिए।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailCheck.cleanEmail, lang: language }),
      });
      const data = await res.json();
      if (res.ok && data.exists) {
        setErrorMessage(
          isHi
            ? 'यह ईमेल पहले से पंजीकृत है! कृपया सीधे लॉगिन करें।'
            : 'This email is already registered! Please log in instead.'
        );
        setIsLoading(false);
        return;
      }
    } catch (_) {
      // Proceed on network edge check
    } finally {
      setIsLoading(false);
    }

    setStep(2);
  };

  // Step 2: Final Submission - creates DB record, sets session cookie, redirects instantly
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const nameCheck = validateRealName(name, language);
    if (!nameCheck.valid) {
      setErrorMessage(nameCheck.error || (isHi ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.'));
      return;
    }

    const dobCheck = validateRealDob(dob, language);
    if (!dobCheck.valid) {
      setErrorMessage(dobCheck.error || (isHi ? 'अमान्य जन्म तिथि।' : 'Invalid Date of Birth.'));
      return;
    }

    if (nationalIdInput.trim()) {
      const idCheck = validateRealNationalId(nationalIdInput.trim(), country, language);
      if (!idCheck.valid) {
        setErrorMessage(idCheck.error || (isHi ? 'अमान्य पहचान पत्र।' : 'Invalid National ID.'));
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          dob,
          nationalId: nationalIdInput.trim(),
          country,
          casteCategory,
          gender,
          administrativeDivision: division,
          lifePhase: selectedRole,
          nationalIdName: countryMeta.nationalIdName,
          lang: language,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || (isHi ? 'पंजीकरण विफल रहा।' : 'Registration failed.'));
        setIsLoading(false);
        return;
      }

      // Success: clean up draft
      try {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
        localStorage.removeItem('citizen_logged_out');
        if (data.citizen) {
          localStorage.setItem('citizen_profile', JSON.stringify(data.citizen));
        }
        if (data.sessionToken) {
          localStorage.setItem('citizen_session_token', data.sessionToken);
        }
      } catch (_) {}

      // Instant entry without delay or setTimeout
      const safeTarget = getSafeTargetUrl(nextParam);
      router.replace(safeTarget);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(
        isHi
          ? 'पंजीकरण प्रक्रिया में तकनीकी त्रुटि आई। कृपया पुनः प्रयास करें।'
          : 'Registration failed due to a network error. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 flex flex-col text-slate-900">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setStep(1);
              }}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
              <span>{isHi ? 'कदम 1 (क्रेडेंशियल)' : 'Step 1 (Credentials)'}</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
              <span>{isHi ? 'लॉगिन' : 'Log In'}</span>
            </Link>
          )}

          <div className="text-xs font-bold text-slate-400">
            {step === 1 ? (isHi ? 'चरण 1 / 2' : 'Step 1 of 2') : (isHi ? 'चरण 2 / 2' : 'Step 2 of 2')}
          </div>
        </div>

        {/* Brand Emblem */}
        <div className="flex justify-center -mt-1 mb-1">
          <BrandIconSvg sizePx={44} className="drop-shadow-xs" />
        </div>

        {/* Title */}
        <div className="text-center mt-0.5 mb-3">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {step === 1
              ? isHi
                ? 'नया नागरिक खाता बनाएं'
                : 'Create Citizen Account'
              : isHi
              ? 'वास्तविक प्रोफ़ाइल विवरण'
              : 'Profile & Demographic Details'}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {step === 1
              ? isHi
                ? 'सुरक्षित नागरिक पोर्टल में प्रवेश हेतु अपनी जानकारी दर्ज करें।'
                : 'Enter your credentials to access verified opportunities.'
              : isHi
              ? 'सटीक योजनाओं व अवसरों से मिलान हेतु वास्तविक विवरण भरें।'
              : 'Real details ensure 100% accurate opportunities matching.'}
          </p>
        </div>

        {/* Friendly Notice */}
        {friendlyNotice && (
          <div className="mb-4 p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{friendlyNotice}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-snug flex-1">{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: CREDENTIALS */}
        {step === 1 && (
          <form onSubmit={handleProceedToStep2} className="space-y-3.5">
            {/* Legal Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'पूरा कानूनी नाम (Full Legal Name) *' : 'Full Legal Name *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isHi ? 'जैसे: राहुल कुमार (पहचान पत्र अनुसार)' : 'e.g. Rahul Kumar'}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'ईमेल पता (Email Address) *' : 'Email Address *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'पासवर्ड (Password) *' : 'Password *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isHi ? 'न्यूनतम 8 वर्ण, 1 अक्षर व 1 संख्या' : 'Min 8 chars, 1 letter & 1 number'}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'पासवर्ड की पुष्टि करें (Confirm Password) *' : 'Confirm Password *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={isHi ? 'वही पासवर्ड पुनः दर्ज करें' : 'Re-enter password'}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Step 1 Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{isHi ? 'विवरण भरने हेतु आगे बढ़ें' : 'Continue to Details'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Link to Login */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                <span>{isHi ? 'पहले से खाता है? ' : 'Already have an account? '}</span>
                <Link
                  href="/login"
                  className="font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {isHi ? 'लॉगिन करें (Log In)' : 'Log In'}
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* STEP 2: PROFILE DETAILS */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-3.5">
            {/* Real Date of Birth */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {isHi ? 'वास्तविक जन्म तिथि (Date of Birth) *' : 'Real Date of Birth *'}
                </label>
                {calculatedAge > 0 && (
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {calculatedAge} {isHi ? 'वर्ष' : 'years old'}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  required
                  autoFocus
                  autoComplete="bday"
                  min={minDob}
                  max={maxDob}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* National ID (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {countryMeta.nationalIdName} {isHi ? '(वैकल्पिक)' : '(Optional)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={nationalIdInput}
                  onChange={(e) => setNationalIdInput(e.target.value)}
                  placeholder={countryMeta.nationalIdPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'लिंग (Gender) *' : 'Gender *'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      gender === g
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g === 'male'
                      ? isHi
                        ? 'पुरुष (Male)'
                        : 'Male'
                      : g === 'female'
                      ? isHi
                        ? 'महिला (Female)'
                        : 'Female'
                      : isHi
                      ? 'अन्य (Other)'
                      : 'Other'}
                  </button>
                ))}
              </div>
            </div>

            {/* Social / Caste Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'सामाजिक वर्ग (Category) *' : 'Social Category *'}
              </label>
              <select
                value={casteCategory}
                onChange={(e) => setCasteCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
              >
                {availableCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isHi ? c.labelHi : c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* State / Division */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'राज्य / प्रांत (State / Division) *' : 'State / Administrative Division *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                >
                  {countryMeta.divisions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role / Life Phase */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'वर्तमान भूमिका / लक्ष्य (Primary Role) *' : 'Current Primary Role *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                >
                  <option value="school_student">{isHi ? 'स्कूली छात्र (School Student)' : 'School Student'}</option>
                  <option value="college_student">{isHi ? 'कॉलेज छात्र (College Student)' : 'College Student'}</option>
                  <option value="exam_aspirant">{isHi ? 'प्रतियोगी परीक्षा अभ्यर्थी (Exam Aspirant)' : 'Exam Aspirant'}</option>
                  <option value="job_seeker">{isHi ? 'नौकरी की तलाश में (Job Seeker)' : 'Job Seeker'}</option>
                  <option value="employed">{isHi ? 'रोजगाररत (Employed)' : 'Employed Professional'}</option>
                  <option value="business_owner">{isHi ? 'व्यवसायी / उद्यमी (Business Owner / MSME)' : 'Business Owner / MSME'}</option>
                  <option value="farmer">{isHi ? 'किसान (Farmer)' : 'Farmer'}</option>
                  <option value="homemaker">{isHi ? 'गृहणी (Homemaker)' : 'Homemaker'}</option>
                  <option value="senior_citizen">{isHi ? 'वरिष्ठ नागरिक (Senior Citizen)' : 'Senior Citizen'}</option>
                </select>
              </div>
            </div>

            {/* Submit Step 2 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isHi ? 'पंजीकरण पूरा करें (Complete Registration)' : 'Complete Registration'}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
