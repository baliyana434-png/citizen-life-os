'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CitizenProfile, CountryCode } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry, COUNTRIES } from '@/context/CountryContext';
import { GoogleAuthService, getGoogleAuthErrorMessage } from '@/services/googleAuth';
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
  ChevronDown,
  ChevronUp,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  CreditCard,
  Globe,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Loader2,
  Info,
} from 'lucide-react';

export type AuthScreen = 'login' | 'signup' | 'forgot_password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScreen?: AuthScreen;
  onLoginSuccess: (profile: Partial<CitizenProfile>) => void;
  onGoogleSuccess?: (googleUser: { name: string; email: string; photoURL?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialScreen = 'login',
  onLoginSuccess,
  onGoogleSuccess,
}) => {
  const { t, language } = useTranslation();
  const { country, setCountry, countryMeta } = useCountry();

  const [screen, setScreen] = useState<AuthScreen>(initialScreen);

  // Common fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Sign up fields
  const [name, setName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [dob, setDob] = useState<string>('2002-05-18');
  const [calculatedAge, setCalculatedAge] = useState<number>(24);
  const [nationalIdInput, setNationalIdInput] = useState<string>('');
  const [casteCategory, setCasteCategory] = useState<string>('General');
  const [division, setDivision] = useState<string>(countryMeta.divisions[0] || 'General');
  const [selectedRole, setSelectedRole] = useState<CitizenProfile['lifePhase']>('college_student');
  const [gender, setGender] = useState<CitizenProfile['gender']>('male');
  const [showOptionalProfile, setShowOptionalProfile] = useState<boolean>(false);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sync initial screen when opened
  useEffect(() => {
    if (isOpen) {
      setScreen(initialScreen);
      setErrorMessage(null);
      setSuccessNotice(null);
    }
  }, [isOpen, initialScreen]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  // Auto calculate age from DOB
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

  // Social categories for selected country
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

  // Sync category and division when country changes
  useEffect(() => {
    if (countryMeta.divisions.length > 0 && !countryMeta.divisions.includes(division)) {
      setDivision(countryMeta.divisions[0]);
    }
    if (availableCategories.length > 0 && !availableCategories.some((c) => c.id === casteCategory)) {
      setCasteCategory(availableCategories[0].id);
    }
  }, [country, countryMeta, availableCategories]);

  // Live anti-fraud validations for Sign Up
  const nameValidation = useMemo(() => {
    if (!name.trim()) return null;
    return validateRealName(name.trim(), language);
  }, [name, language]);

  const dobValidation = useMemo(() => {
    if (!dob) return null;
    return validateRealDob(dob, language);
  }, [dob, language]);

  const nationalIdValidation = useMemo(() => {
    if (!nationalIdInput.trim()) return null;
    return validateRealNationalId(nationalIdInput.trim(), country, language);
  }, [nationalIdInput, country, language]);

  const emailValidation = useMemo(() => {
    if (!email.trim()) return null;
    return validateRealEmail(email.trim(), language);
  }, [email, language]);

  const passwordValidation = useMemo(() => {
    if (!password) return null;
    return validateRealPassword(password, name, email, language);
  }, [password, name, email, language]);

  const confirmPasswordValidation = useMemo(() => {
    if (!confirmPassword) return null;
    if (confirmPassword !== password) {
      return {
        valid: false,
        error: language === 'hi' ? 'दोनों पासवर्ड समान होने चाहिए।' : 'Passwords do not match.',
      };
    }
    return { valid: true };
  }, [confirmPassword, password, language]);

  if (!isOpen) return null;

  // Google OAuth Sign In (Single Official Google Provider)
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await GoogleAuthService.signInWithGoogle();
      if (result.success) {
        // Check if user already registered on server
        try {
          const res = await fetch(`/api/citizens/profile?email=${encodeURIComponent(result.email)}`);
          const data = await res.json();
          if (data.success && data.citizen && data.citizen.isOnboarded) {
            onClose();
            onLoginSuccess(data.citizen);
            return;
          }
        } catch (e) {
          console.warn('Server lookup error:', e);
        }

        // If onGoogleSuccess callback is provided, transition to the full onboarding wizard
        if (onGoogleSuccess) {
          onClose();
          onGoogleSuccess({
            name: result.name,
            email: result.email,
            photoURL: result.photoURL,
          });
          return;
        }

        // If new user and no external onboarding, populate signup with verified Google details
        setName(result.name);
        setEmail(result.email);
        setScreen('signup');
        setSuccessNotice(
          language === 'hi'
            ? `Google खाता सत्यापित: ${result.email}। कृपया पंजीकरण पूर्ण करें।`
            : `Verified Google: ${result.email}. Complete registration to finish.`
        );
      }
    } catch (e: any) {
      setErrorMessage(getGoogleAuthErrorMessage(e?.code || e?.message, language));
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Handler for Email/Password Login (Strict Real Account Check)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Client-Side Real Email Validation
    const emailCheck = validateRealEmail(email, language);
    if (!emailCheck.valid) {
      setErrorMessage(
        emailCheck.error ||
          (language === 'hi'
            ? 'कृपया मान्य एवं सक्रिय ईमेल पता दर्ज करें।'
            : 'Please enter a valid, active email address.')
      );
      return;
    }

    if (!password) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      // Authenticate against /api/auth/login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailCheck.cleanEmail,
          password,
          rememberMe,
          lang: language,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.message || (language === 'hi' ? 'अमान्य ईमेल अथवा पासवर्ड।' : 'Invalid email or password.')
        );
        return;
      }

      // Valid account and verified credentials!
      try {
        if (rememberMe) {
          localStorage.setItem('citizen_remember_email', emailCheck.cleanEmail);
        } else {
          localStorage.removeItem('citizen_remember_email');
        }
        if (data.sessionToken) {
          localStorage.setItem('citizen_session_token', data.sessionToken);
        }
      } catch (e) {}

      onClose();
      onLoginSuccess(data.citizen);
    } catch (err: any) {
      setErrorMessage(
        language === 'hi'
          ? 'लॉगिन प्रक्रिया में तकनीकी त्रुटि आई। कृपया पुनः प्रयास करें।'
          : 'Login failed due to a network error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Handler for Create Account (Sign Up) with Real Base Validation
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Real Legal Name Validation
    const nameCheck = validateRealName(name, language);
    if (!nameCheck.valid) {
      setErrorMessage(nameCheck.error || 'Invalid name');
      return;
    }

    // 2. Real Email (Anti-Fake, Anti-Disposable Burner Domain)
    const emailCheck = validateRealEmail(email, language);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || 'Invalid email');
      return;
    }

    // 3. Real Password (Anti-Dummy, High Complexity)
    const passwordCheck = validateRealPassword(password, name, emailCheck.cleanEmail, language);
    if (!passwordCheck.valid) {
      setErrorMessage(passwordCheck.error || 'Weak password');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(language === 'hi' ? 'दोनों पासवर्ड समान होने चाहिए।' : 'Passwords do not match.');
      return;
    }

    // 4. DOB & Exact Age Verification (optional - validate if provided)
    if (dob) {
      const dobCheck = validateRealDob(dob, language);
      if (!dobCheck.valid) {
        setErrorMessage(dobCheck.error || 'Invalid date of birth');
        return;
      }
    }

    // 5. National ID Checksum (optional - validate if provided)
    if (nationalIdInput.trim()) {
      const idCheck = validateRealNationalId(nationalIdInput.trim(), country, language);
      if (!idCheck.valid) {
        setErrorMessage(idCheck.error || 'Invalid National ID');
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
          email: emailCheck.cleanEmail,
          password,
          dob,
          nationalId: nationalIdInput,
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
        setErrorMessage(
          data.message || (language === 'hi' ? 'पंजीकरण विफल रहा।' : 'Registration failed.')
        );
        return;
      }

      try {
        if (data.sessionToken) {
          localStorage.setItem('citizen_session_token', data.sessionToken);
        }
      } catch (e) {}

      onClose();
      onLoginSuccess(data.citizen);
    } catch (err: any) {
      setErrorMessage(
        language === 'hi'
          ? 'तकनीकी समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Registration failed due to a network error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Handler for Forgot Password (Real Account Verification)
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const emailCheck = validateRealEmail(email, language);
    if (!emailCheck.valid) {
      setErrorMessage(
        emailCheck.error ||
          (language === 'hi' ? 'कृपया मान्य ईमेल दर्ज करें।' : 'Please enter a valid email address.')
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailCheck.cleanEmail, lang: language }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.message ||
            (language === 'hi' ? 'पासवर्ड रीसेट लिंक भेजने में समस्या आई।' : 'Failed to send reset link.')
        );
        return;
      }

      setSuccessNotice(data.message);
    } catch (err: any) {
      setErrorMessage(
        language === 'hi' ? 'तकनीकी समस्या आई। पुनः प्रयास करें।' : 'Network error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-5 sm:p-8 flex flex-col my-auto max-h-[94vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Navigation Row: Circular Back Button & Close Button */}
        <div className="flex items-center justify-between">
          {screen === 'forgot_password' ? (
            <button
              type="button"
              onClick={() => {
                setScreen('login');
                setErrorMessage(null);
                setSuccessNotice(null);
              }}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
          ) : screen === 'signup' ? (
            <button
              type="button"
              onClick={() => {
                setScreen('login');
                setErrorMessage(null);
                setSuccessNotice(null);
              }}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Back to Login"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header Title & Subtitle */}
        <div className="text-center mt-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {screen === 'login'
              ? (language === 'hi' ? 'लॉगिन' : 'Log in')
              : screen === 'signup'
              ? (language === 'hi' ? 'खाता बनाएं' : 'Create Account')
              : (language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 px-1 leading-relaxed">
            {screen === 'login'
              ? (language === 'hi'
                  ? 'अपने खाते में सुरक्षित प्रवेश के लिए ईमेल व पासवर्ड दर्ज करें।'
                  : 'Enter your email and password to securely access your account and manage your services.')
              : screen === 'signup'
              ? (language === 'hi'
                  ? 'प्रमाणित अवसरों व सुविधाओं के लिए वास्तविक विवरण से खाता बनाएं।'
                  : 'Create a new account to get started and enjoy seamless access to our features.')
              : (language === 'hi'
                  ? 'अपना ईमेल पता दर्ज करें, हम पासवर्ड रीसेट लिंक भेजेंगे।'
                  : 'Enter your email address to receive a reset link and regain access to your account.')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{successNotice}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 1: LOG IN                                         */}
        {/* ======================================================== */}
        {screen === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-3.5">
            {/* Email Address */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'hi' ? 'ईमेल पता' : 'Email address'}
                  className={`w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-50 border text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white outline-none transition-all ${
                    emailValidation && !emailValidation.valid
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'
                  }`}
                />
              </div>
              {emailValidation && !emailValidation.valid && (
                <p className="text-[10px] font-semibold text-red-600 mt-1 pl-2">
                  {emailValidation.error}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'hi' ? 'पासवर्ड' : 'Password'}
                className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1 px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>{language === 'hi' ? 'याद रखें' : 'Remember me'}</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setScreen('forgot_password');
                  setErrorMessage(null);
                  setSuccessNotice(null);
                }}
                className="font-bold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password'}
              </button>
            </div>

            {/* Emerald Green Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span>{language === 'hi' ? 'लॉगिन करें' : 'Login'}</span>
              )}
            </button>

            {/* Switch to Sign Up */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                <span>{language === 'hi' ? 'खाता नहीं है? ' : "Don't have an account? "}</span>
                <button
                  type="button"
                  onClick={() => {
                    setScreen('signup');
                    setErrorMessage(null);
                    setSuccessNotice(null);
                  }}
                  className="font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  {language === 'hi' ? 'साइन अप करें (Sign Up here)' : 'Sign Up here'}
                </button>
              </p>
            </div>

            {/* Divider: Or Continue With Account */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] font-semibold text-slate-400">
                <span className="bg-white px-3">
                  {language === 'hi' ? 'अथवा गूगल द्वारा' : 'Or Continue With Account'}
                </span>
              </div>
            </div>

            {/* Social Login: ONLY GOOGLE (No Facebook, No Apple) */}
            <div className="flex justify-center pb-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                title={language === 'hi' ? 'गूगल से जारी रखें' : 'Continue with Google'}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* SCREEN 2: CREATE ACCOUNT (SIGN UP)                       */}
        {/* ======================================================== */}
        {screen === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="mt-4 space-y-3">
            {/* Full Legal Name */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'hi' ? 'पूरा नाम (Name)' : 'Name'}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white outline-none transition-all ${
                    nameValidation && !nameValidation.valid ? 'border-red-400' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
              </div>
              {nameValidation && !nameValidation.valid && (
                <p className="text-[10px] font-semibold text-red-600 mt-1 pl-2">
                  {nameValidation.error}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'hi' ? 'ईमेल पता (उदा. name@gmail.com)' : 'Email address (e.g. name@gmail.com)'}
                  className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white outline-none transition-all ${
                    emailValidation && !emailValidation.valid
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
              </div>
              {emailValidation && !emailValidation.valid && (
                <p className="text-[10px] font-semibold text-red-600 mt-1 pl-2">
                  {emailValidation.error}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'hi' ? 'सुरक्षित पासवर्ड (8+ वर्ण, A-Z, a-z, 0-9, @#$)' : 'Secure Password (8+ chars, A-Z, a-z, 0-9, @#$)'}
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white outline-none transition-all ${
                    passwordValidation && !passwordValidation.valid
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordValidation && !passwordValidation.valid ? (
                <p className="text-[10px] font-semibold text-red-600 mt-1 pl-2 leading-tight">
                  {passwordValidation.error}
                </p>
              ) : (
                password && (
                  <p className="text-[10px] font-semibold text-emerald-600 mt-1 pl-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{language === 'hi' ? 'पासवर्ड मजबूत एवं सुरक्षित है' : 'Strong & secure password'}</span>
                  </p>
                )
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={language === 'hi' ? 'पासवर्ड पुष्टि (Confirm Password)' : 'Confirm Password'}
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white outline-none transition-all ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-[10px] font-semibold text-red-600 mt-1 pl-2">
                  {language === 'hi' ? 'दोनों पासवर्ड समान होने चाहिए।' : 'Passwords do not match.'}
                </p>
              )}
            </div>

            {/* Optional Profile Customization Accordion */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowOptionalProfile(!showOptionalProfile)}
                className="w-full flex items-center justify-between py-2 px-1 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <span>
                  {language === 'hi'
                    ? 'अतिरिक्त प्रोफ़ाइल विवरण (वैकल्पिक)'
                    : 'Additional Profile Details (Optional)'}
                </span>
                {showOptionalProfile ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showOptionalProfile && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 px-1">
                    <span>{language === 'hi' ? 'नागरिक पहचान व प्राथमिकताएं' : 'Citizen Preferences'}</span>
                    <span className="text-emerald-700">{countryMeta.flag} {countryMeta.name}</span>
                  </div>

              {/* Country Picker */}
              <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
                {Object.values(COUNTRIES).map((c) => (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => setCountry(c.code as CountryCode)}
                    className={`py-1 px-1.5 rounded-lg text-center text-[10px] font-bold border transition-all cursor-pointer truncate ${
                      country === c.code
                        ? 'border-emerald-600 bg-white text-emerald-950 shadow-2xs'
                        : 'border-transparent text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    <span>{c.flag}</span> <span className="font-mono">{c.alpha3}</span>
                  </button>
                ))}
              </div>

              {/* DOB & Auto-Calculated Age Badge */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between px-1">
                  <span>{language === 'hi' ? 'जन्म तिथि (DOB) (वैकल्पिक)' : 'Date of Birth (Optional)'}</span>
                  {calculatedAge >= 14 && (
                    <span className="text-emerald-700 font-bold">
                      {language === 'hi' ? `आयु: ${calculatedAge} वर्ष` : `Age: ${calculatedAge} yrs`}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={dob}
                    max={maxDob}
                    min={minDob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* National ID / Aadhaar with live Checksum Badge */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between px-1">
                  <span>{countryMeta.nationalIdName} ({language === 'hi' ? 'वैकल्पिक' : 'Optional'})</span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{countryMeta.alpha3 || country}</span>
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
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border text-xs font-bold text-slate-900 focus:bg-white outline-none ${
                      nationalIdValidation && !nationalIdValidation.valid
                        ? 'border-red-400'
                        : nationalIdValidation && nationalIdValidation.valid
                        ? 'border-emerald-500'
                        : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {nationalIdValidation && nationalIdValidation.valid && (
                  <p className="text-[10px] font-bold text-emerald-700 mt-1 pl-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>
                      {country === 'IN'
                        ? (language === 'hi' ? 'UIDAI Verhoeff चेकसम सत्यापित' : 'UIDAI Verhoeff Checksum Verified')
                        : (language === 'hi' ? `मान्य ${countryMeta.nationalIdName} प्रारूप` : `Valid ${countryMeta.nationalIdName} format`)}
                    </span>
                  </p>
                )}
                {nationalIdValidation && !nationalIdValidation.valid && (
                  <p className="text-[10px] font-semibold text-red-600 mt-1 pl-2">
                    {nationalIdValidation.error}
                  </p>
                )}
              </div>

              {/* Country-Specific Caste / Demographic Category */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 px-1">
                  {language === 'hi' ? countryMeta.categoryLabelHi : countryMeta.categoryLabel} *
                </label>
                {!countryMeta.hasCasteSystem && (
                  <div className="p-2 mb-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[10px] flex items-center gap-1.5 font-medium">
                    <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>
                      {language === 'hi'
                        ? `${countryMeta.name} में जाति व्यवस्था नहीं है • आधिकारिक समानता वर्ग लागू:`
                        : `Caste system does not exist in ${countryMeta.name} • Official equity category:`}
                    </span>
                  </div>
                )}
                <select
                  value={casteCategory}
                  onChange={(e) => setCasteCategory(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none cursor-pointer"
                >
                  {availableCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'hi' ? c.labelHi : c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* State / Administrative Division */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 px-1">
                  {countryMeta.administrativeLabel} *
                </label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none cursor-pointer"
                >
                  {countryMeta.divisions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 px-1">
                  {language === 'hi' ? 'लिंग (Gender) *' : 'Gender *'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'male', label: 'Male', labelHi: 'पुरुष' },
                    { id: 'female', label: 'Female', labelHi: 'महिला' },
                    { id: 'other', label: 'Other', labelHi: 'अन्य' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id as CitizenProfile['gender'])}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        gender === g.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-2xs font-extrabold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {language === 'hi' ? g.labelHi : g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Citizen Life Phase / Role Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 px-1 flex items-center justify-between">
                  <span>{language === 'hi' ? 'वर्तमान भूमिका / पेशा (Role) *' : 'Occupation / Role *'}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {language === 'hi' ? 'अवसर अनुकूलन' : 'Customized Feed'}
                  </span>
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as CitizenProfile['lifePhase'])}
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none cursor-pointer"
                >
                  <option value="school_student">{language === 'hi' ? 'स्कूली छात्र (School Student)' : 'School Student'}</option>
                  <option value="college_student">{language === 'hi' ? 'कॉलेज छात्र / डिग्री (College Student)' : 'College Student'}</option>
                  <option value="exam_aspirant">{language === 'hi' ? 'प्रतियोगी परीक्षा अभ्यर्थी (Exam Aspirant)' : 'Exam Aspirant'}</option>
                  <option value="job_seeker">{language === 'hi' ? 'नौकरी तलाशकर्ता (Job Seeker)' : 'Job Seeker'}</option>
                  <option value="employed">{language === 'hi' ? 'कार्यरत / कर्मचारी (Employed)' : 'Employed'}</option>
                  <option value="business_owner">{language === 'hi' ? 'व्यवसायी / उद्यमी (Business Owner / Startup)' : 'Business Owner / Startup'}</option>
                  <option value="farmer">{language === 'hi' ? 'किसान / कृषि (Farmer)' : 'Farmer'}</option>
                  <option value="homemaker">{language === 'hi' ? 'गृहणी (Homemaker)' : 'Homemaker'}</option>
                  <option value="senior_citizen">{language === 'hi' ? 'वरिष्ठ नागरिक (Senior Citizen 60+)' : 'Senior Citizen (60+)'}</option>
                </select>
              </div>
            </div>
          )}
        </div>

            {/* Emerald Green Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span>{language === 'hi' ? 'खाता बनाएं (Create Account)' : 'Create Account'}</span>
              )}
            </button>

            {/* Switch to Sign In */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                <span>{language === 'hi' ? 'पहले से खाता है? ' : 'Already have an account? '}</span>
                <button
                  type="button"
                  onClick={() => {
                    setScreen('login');
                    setErrorMessage(null);
                    setSuccessNotice(null);
                  }}
                  className="font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  {language === 'hi' ? 'साइन इन करें (Sign In here)' : 'Sign In here'}
                </button>
              </p>
            </div>

            {/* Divider: Or Continue With Account */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] font-semibold text-slate-400">
                <span className="bg-white px-3">
                  {language === 'hi' ? 'अथवा गूगल द्वारा' : 'Or Continue With Account'}
                </span>
              </div>
            </div>

            {/* Social Login: ONLY GOOGLE (No Facebook, No Apple) */}
            <div className="flex justify-center pb-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white shadow-sm hover:shadow-md hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                title={language === 'hi' ? 'गूगल से जारी रखें' : 'Continue with Google'}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* SCREEN 3: FORGOT PASSWORD                                */}
        {/* ======================================================== */}
        {screen === 'forgot_password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="mt-5 space-y-4">
            {/* Email Address */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'hi' ? 'ईमेल पता' : 'Email address'}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              />
            </div>

            {/* Emerald Green Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span>{language === 'hi' ? 'पासवर्ड रीसेट लिंक भेजें' : 'Continue'}</span>
              )}
            </button>

            {/* Back to Login link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setScreen('login');
                  setErrorMessage(null);
                  setSuccessNotice(null);
                }}
                className="font-extrabold text-xs text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                {language === 'hi' ? 'वापस लॉगिन पर जाएं' : 'Back to Login'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
