'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/i18n/useTranslation';
import { BrandIconSvg } from '@/components/common/BrandLogo';
import { BrandSplashScreen } from '@/components/common/BrandSplashScreen';
import {
  GoogleAuthService,
  getGoogleAuthErrorMessage,
  isGoogleRedirectPending,
  getGoogleRedirectResultSafe,
} from '@/services/googleAuth';
import { validateRealEmail } from '@/utils/antiFraudValidation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { CitizenProfile } from '@/types';

type LoginStep = 'email' | 'password' | 'google' | 'unverified_otp' | 'forgot_password';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useTranslation();
  const isHi = language === 'hi';

  const nextParam = searchParams.get('next') || '/';
  const fromLogout = searchParams.get('from') === 'logout';

  // Component state
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [step, setStep] = useState<LoginStep>('email');

  // Input states
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');

  // Unverified account OTP state
  const [unverifiedOtp, setUnverifiedOtp] = useState<string>('');

  // Forgot password states
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotOtp, setForgotOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(
    fromLogout
      ? isHi
        ? 'सफलतापूर्वक लॉग आउट हो गया। नागरिक पोर्टल में प्रवेश हेतु पुनः लॉगिन करें।'
        : 'You have been logged out successfully. Please log in to continue.'
      : null
  );

  // Preload home route for instant navigation
  useEffect(() => {
    router.prefetch('/');
  }, [router]);

  // Initial session check on mount (instant, no 5s delay)
  useEffect(() => {
    let cancelled = false;

    async function checkInitialSession() {
      // 1. If returning from a mobile Google OAuth redirect
      if (isGoogleRedirectPending()) {
        try {
          const redirectResult = await getGoogleRedirectResultSafe();
          if (cancelled) return;
          if (redirectResult && redirectResult.email) {
            await handleGoogleSuccessCallback(redirectResult);
            return;
          }
        } catch (e) {
          console.warn('Google redirect notice:', e);
        }
      }

      // 2. Pre-fill remembered email if saved
      try {
        const remembered = localStorage.getItem('citizen_remember_email');
        if (remembered) {
          setEmail(remembered);
        }
      } catch (_) {}

      if (!cancelled) {
        setIsCheckingAuth(false);
      }
    }

    checkInitialSession();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Safe internal redirect validator
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

  const handlePostAuthSuccess = (citizen: Partial<CitizenProfile>, sessionToken?: string) => {
    try {
      localStorage.removeItem('citizen_logged_out');
      if (rememberMe && email) {
        localStorage.setItem('citizen_remember_email', email.trim().toLowerCase());
      } else {
        localStorage.removeItem('citizen_remember_email');
      }
      if (citizen && citizen.id) {
        localStorage.setItem('citizen_profile', JSON.stringify(citizen));
      }
      if (sessionToken) {
        localStorage.setItem('citizen_session_token', sessionToken);
      }
    } catch (_) {}

    const safeTarget = getSafeTargetUrl(nextParam);
    router.replace(safeTarget);
  };

  // STEP 1: Check Email
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const emailCheck = validateRealEmail(email, language);
    if (!emailCheck.valid) {
      setErrorMessage(
        emailCheck.error ||
          (isHi ? 'कृपया मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.')
      );
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

      if (!res.ok || !data.success) {
        setIsLoading(false);
        setErrorMessage(
          data.message || (isHi ? 'ईमेल सत्यापन विफल रहा।' : 'Email verification failed.')
        );
        return;
      }

      // Case A: Email DOES NOT exist -> Redirect to /register with prefilled email & friendly notice
      if (!data.exists) {
        setIsLoading(false);
        const registerUrl = `/register?email=${encodeURIComponent(emailCheck.cleanEmail)}&notice=no_account&next=${encodeURIComponent(nextParam)}`;
        router.replace(registerUrl);
        return;
      }

      // Case B: Email exists but is NOT verified -> Go to OTP verification step
      if (!data.verified) {
        setIsLoading(false);
        setStep('unverified_otp');
        setSuccessNotice(
          data.message ||
            (isHi
              ? `आपके ईमेल (${emailCheck.cleanEmail}) पर 6-अंकों का सत्यापन कोड भेजा गया है।`
              : `A 6-digit verification code has been sent to ${emailCheck.cleanEmail}.`)
        );
        return;
      }

      // Case C: Email exists and is verified
      setIsLoading(false);
      setUserName(data.fullName || '');

      if (data.isGoogleLinked) {
        setStep('google');
      } else {
        setStep('password');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(
        isHi
          ? 'नेटवर्क समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Network error. Please try again.'
      );
    }
  };

  // STEP 2: Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!password) {
      setErrorMessage(isHi ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          lang: language,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsLoading(false);
        if (data.errorType === 'GOOGLE_LINKED_ACCOUNT') {
          setStep('google');
          setErrorMessage(data.message);
        } else {
          setErrorMessage(
            data.message || (isHi ? 'अमान्य पासवर्ड या ईमेल।' : 'Invalid password or email.')
          );
        }
        return;
      }

      // Login success
      handlePostAuthSuccess(data.citizen, data.sessionToken);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(
        isHi
          ? 'लॉगिन प्रक्रिया में तकनीकी त्रुटि आई। कृपया पुनः प्रयास करें।'
          : 'Login failed due to a network error. Please try again.'
      );
    }
  };

  // STEP 2 (Unverified): Verify Email OTP
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!unverifiedOtp || unverifiedOtp.length !== 6) {
      setErrorMessage(isHi ? 'कृपया 6-अंकों का सत्यापन कोड दर्ज करें।' : 'Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: unverifiedOtp.trim(),
          lang: language,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsLoading(false);
        setErrorMessage(data.message || (isHi ? 'सत्यापन कोड अमान्य है।' : 'Invalid verification code.'));
        return;
      }

      // Verification success
      handlePostAuthSuccess(data.citizen, data.sessionToken);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(
        isHi
          ? 'सत्यापन प्रक्रिया में त्रुटि आई। कृपया पुनः प्रयास करें।'
          : 'Verification error. Please try again.'
      );
    }
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await GoogleAuthService.signInWithGoogle();
      if (!result) {
        setIsLoading(false);
        return;
      }
      await handleGoogleSuccessCallback(result);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(getGoogleAuthErrorMessage(err, language));
    }
  };

  const handleGoogleSuccessCallback = async (result: { name: string; email: string; photoURL?: string }) => {
    const cleanEmail = result.email.trim().toLowerCase();

    try {
      const checkRes = await fetch(`/api/citizens/profile?email=${encodeURIComponent(cleanEmail)}`, {
        cache: 'no-store',
      });
      const checkData = await checkRes.json();

      if (
        checkRes.ok &&
        checkData.success &&
        checkData.citizen &&
        checkData.citizen.isOnboarded &&
        checkData.citizen.dob
      ) {
        // Registered user -> establish session cookie
        const sessionRes = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            citizenId: checkData.citizen.id,
            email: cleanEmail,
          }),
        });
        const sessionData = await sessionRes.json();
        handlePostAuthSuccess(checkData.citizen, sessionData.sessionToken);
        return;
      }

      // NOT registered: Redirect to /register! Never assign dummy or random data!
      setIsLoading(false);
      const registerUrl = `/register?email=${encodeURIComponent(cleanEmail)}&notice=no_account&next=${encodeURIComponent(nextParam)}`;
      router.replace(registerUrl);
    } catch (e: any) {
      setIsLoading(false);
      setErrorMessage(
        isHi ? 'गूगल प्रमाणीकरण में त्रुटि आई।' : 'Error completing Google sign-in.'
      );
    }
  };

  // Forgot Password Step 1
  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const emailCheck = validateRealEmail(email, language);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || (isHi ? 'कृपया मान्य ईमेल दर्ज करें।' : 'Please enter a valid email address.'));
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
        setIsLoading(false);
        setErrorMessage(data.message || (isHi ? 'पासवर्ड रीसेट लिंक भेजने में त्रुटि आई।' : 'Failed to send reset code.'));
        return;
      }

      setIsLoading(false);
      setSuccessNotice(data.message);
      setForgotStep(2);
      if (data.devCode) {
        setForgotOtp(data.devCode);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(isHi ? 'तकनीकी त्रुटि आई। कृपया पुनः प्रयास करें।' : 'Network error. Please try again.');
    }
  };

  // Forgot Password Step 2 (Reset)
  const handleForgotPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (newPassword.length < 8) {
      setErrorMessage(isHi ? 'पासवर्ड कम से कम 8 वर्णों का होना चाहिए।' : 'Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage(isHi ? 'दोनों पासवर्ड समान होने चाहिए।' : 'Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: forgotOtp.trim(),
          newPassword,
          lang: language,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsLoading(false);
        setErrorMessage(data.message || (isHi ? 'पासवर्ड रीसेट विफल रहा।' : 'Failed to reset password.'));
        return;
      }

      // Reset success -> log in
      if (data.citizen) {
        handlePostAuthSuccess(data.citizen, data.sessionToken);
      } else {
        setIsLoading(false);
        setStep('password');
        setPassword('');
        setSuccessNotice(isHi ? 'पासवर्ड सफलतापूर्वक बदल गया! कृपया लॉगिन करें।' : 'Password updated successfully! Please log in.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(isHi ? 'तकनीकी समस्या आई। पुनः प्रयास करें।' : 'Network error. Please try again.');
    }
  };

  // Neutral skeleton/splash while session is loading (never renders login form first)
  if (isCheckingAuth) {
    return <BrandSplashScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 flex flex-col text-slate-900">
        {/* Top Navigation */}
        <div className="flex items-center justify-between pb-2">
          {step !== 'email' ? (
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setSuccessNotice(null);
                setStep('email');
              }}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
              <span>{isHi ? 'दूसरा ईमेल उपयोग करें' : 'Change Email'}</span>
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}

          <div className="text-xs font-bold text-slate-400">
            {step === 'email' ? (isHi ? 'चरण 1' : 'Step 1') : (isHi ? 'चरण 2' : 'Step 2')}
          </div>
        </div>

        {/* Brand Emblem */}
        <div className="flex justify-center -mt-1 mb-1">
          <BrandIconSvg sizePx={44} className="drop-shadow-xs" />
        </div>

        {/* Header Title */}
        <div className="text-center mt-0.5 mb-3">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {step === 'email'
              ? isHi
                ? 'नागरिक पोर्टल लॉगिन'
                : 'Citizen Portal Log In'
              : step === 'password'
              ? isHi
                ? 'पासवर्ड दर्ज करें'
                : 'Enter Password'
              : step === 'google'
              ? isHi
                ? 'Google खाता प्रमाणीकरण'
                : 'Google Sign-In'
              : step === 'unverified_otp'
              ? isHi
                ? 'ईमेल सत्यापन कोड'
                : 'Verify Email'
              : isHi
              ? 'पासवर्ड रीसेट करें'
              : 'Reset Password'}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {step === 'email'
              ? isHi
                ? 'प्रारंभ करने के लिए अपना ईमेल पता दर्ज करें।'
                : 'Enter your email address to continue.'
              : step === 'password'
              ? isHi
                ? `${userName ? userName + ', ' : ''}अपने खाते में प्रवेश हेतु पासवर्ड दर्ज करें।`
                : `Welcome back${userName ? ', ' + userName : ''}! Enter your password.`
              : step === 'google'
              ? isHi
                ? 'यह खाता Google से जुड़ा हुआ है।'
                : 'This account was created with Google.'
              : step === 'unverified_otp'
              ? isHi
                ? `Gmail (${email}) पर भेजा गया 6-अंकों का कोड दर्ज करें।`
                : `Enter the 6-digit code sent to ${email}.`
              : isHi
              ? 'अपना पासवर्ड सुरक्षित रूप से रीसेट करें।'
              : 'Safely reset your account password.'}
          </p>
        </div>

        {/* Success Notice */}
        {successNotice && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{successNotice}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-snug flex-1">{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: EMAIL INPUT */}
        {step === 'email' && (
          <form onSubmit={handleCheckEmail} className="space-y-3.5">
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
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center text-xs px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>{isHi ? 'इस डिवाइस पर याद रखें' : 'Remember me on this device'}</span>
              </label>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{isHi ? 'जारी रखें' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  {isHi ? 'या' : 'or'}
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>{isHi ? 'Google से जारी रखें' : 'Continue with Google'}</span>
            </button>

            {/* Direct Link to Register */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                <span>{isHi ? 'खाता नहीं है? ' : "Don't have an account? "}</span>
                <Link
                  href="/register"
                  className="font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {isHi ? 'नया खाता बनाएं (Sign Up)' : 'Sign Up'}
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* STEP 2: PASSWORD STEP */}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
            {/* Active Email Display */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 truncate">{email}</span>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('email');
                }}
                className="text-emerald-600 hover:text-emerald-700 font-bold ml-2 shrink-0 cursor-pointer"
              >
                {isHi ? 'बदलें' : 'Change'}
              </button>
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
                  autoFocus
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isHi ? 'अपना पासवर्ड दर्ज करें' : 'Enter your password'}
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

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between text-xs px-1">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessNotice(null);
                  setStep('email');
                }}
                className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                {isHi ? 'दूसरा ईमेल उपयोग करें' : 'Use a different email'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessNotice(null);
                  setForgotStep(1);
                  setStep('forgot_password');
                }}
                className="font-bold text-slate-700 hover:text-emerald-700 cursor-pointer"
              >
                {isHi ? 'पासवर्ड भूल गए?' : 'Forgot password?'}
              </button>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span>{isHi ? 'लॉगिन करें' : 'Log In'}</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: GOOGLE-LINKED ACCOUNT */}
        {step === 'google' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
              <p>
                {isHi
                  ? `ईमेल (${email}) Google प्रमाणीकरण के साथ पंजीकृत है। कृपया नीचे दिए गए Google बटन पर क्लिक करके सीधे प्रवेश करें।`
                  : `The email (${email}) is registered with Google Authentication. Please click the button below to continue.`}
              </p>
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
              ) : (
                <>
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
                  <span>{isHi ? 'Google से लॉगिन करें' : 'Continue with Google'}</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('email');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {isHi ? 'दूसरा ईमेल उपयोग करें' : 'Use a different email'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: UNVERIFIED ACCOUNT OTP */}
        {step === 'unverified_otp' && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? '6-अंकों का सत्यापन कोड (OTP) *' : '6-Digit Verification Code *'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={unverifiedOtp}
                  onChange={(e) => setUnverifiedOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold tracking-widest text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || unverifiedOtp.length !== 6}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span>{isHi ? 'सत्यापित करें व प्रवेश करें' : 'Verify & Enter'}</span>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep('email');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {isHi ? 'दूसरा ईमेल उपयोग करें' : 'Use a different email'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: FORGOT PASSWORD FLOW */}
        {step === 'forgot_password' && (
          <div>
            {forgotStep === 1 ? (
              <form onSubmit={handleForgotPasswordRequest} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'पंजीकृत ईमेल *' : 'Registered Email *'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      autoFocus
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>{isHi ? 'रीसेट कोड भेजें' : 'Send Reset Code'}</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotPasswordReset} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? '6-अंकों का वेरिफिकेशन कोड *' : '6-Digit Verification Code *'}
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold tracking-widest text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'नया पासवर्ड *' : 'New Password *'}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder={isHi ? 'न्यूनतम 8 वर्ण' : 'Minimum 8 characters'}
                      className="w-full pl-4 pr-10 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'नये पासवर्ड की पुष्टि करें *' : 'Confirm New Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder={isHi ? 'वही पासवर्ड पुनः दर्ज करें' : 'Re-enter new password'}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>{isHi ? 'पासवर्ड अपडेट करें व लॉगिन करें' : 'Update Password & Log In'}</span>
                  )}
                </button>
              </form>
            )}

            <div className="text-center pt-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessNotice(null);
                  setStep('email');
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                {isHi ? 'लॉगिन पर वापस जाएं' : 'Back to Login'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<BrandSplashScreen />}>
      <LoginForm />
    </Suspense>
  );
}
