'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Loader2,
  Info,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export type AuthScreen = 'login' | 'signup' | 'forgot_password';

export interface AuthPrefillData {
  name?: string;
  email?: string;
  photoURL?: string;
  isGoogle?: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScreen?: AuthScreen;
  initialNotice?: string;
  prefillData?: AuthPrefillData | null;
  onLoginSuccess: (profile: Partial<CitizenProfile>) => void;
  onGoogleSuccess?: (googleUser: { name: string; email: string; photoURL?: string }) => void;
  onOpenGoogleChooser?: () => void;
  isFullPageGate?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialScreen = 'login',
  initialNotice,
  prefillData = null,
  onLoginSuccess,
  onGoogleSuccess,
  isFullPageGate = false,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const { country, setCountry, countryMeta } = useCountry();

  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState<boolean>(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState<boolean>(false);

  const [screen, setScreen] = useState<AuthScreen>(initialScreen);
  const [signUpStep, setSignUpStep] = useState<1 | 2>(1);
  const [isGoogleRegistration, setIsGoogleRegistration] = useState<boolean>(false);
  const [googlePhotoURL, setGooglePhotoURL] = useState<string>('');

  // Common credentials fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Sign up credentials fields (Step 1)
  const [name, setName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Sign up profile details fields (Step 2 - Details Page)
  const [dob, setDob] = useState<string>('2002-05-18');
  const [calculatedAge, setCalculatedAge] = useState<number>(24);
  const [nationalIdInput, setNationalIdInput] = useState<string>('');
  const [casteCategory, setCasteCategory] = useState<string>('General');
  const [division, setDivision] = useState<string>(countryMeta.divisions[0] || 'General');
  const [selectedRole, setSelectedRole] = useState<CitizenProfile['lifePhase']>('college_student');
  const [gender, setGender] = useState<CitizenProfile['gender']>('male');

  // UI state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [accountNotFoundNotice, setAccountNotFoundNotice] = useState<boolean>(false);
  const [showLocalIpGooglePrompt, setShowLocalIpGooglePrompt] = useState<boolean>(false);
  const [googleFallbackEmail, setGoogleFallbackEmail] = useState<string>('');

  // Initialize or reset when modal opens or initialScreen/prefillData changes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessNotice(initialNotice || null);
      setAccountNotFoundNotice(false);
      setShowLocalIpGooglePrompt(false);

      if (prefillData) {
        if (prefillData.name) setName(prefillData.name);
        if (prefillData.email) {
          setEmail(prefillData.email);
          setGoogleFallbackEmail(prefillData.email);
        }
        if (prefillData.photoURL) setGooglePhotoURL(prefillData.photoURL);
        if (prefillData.isGoogle) {
          setIsGoogleRegistration(true);
          setScreen('signup');
          setSignUpStep(2);
          setSuccessNotice(
            language === 'hi'
              ? `Google खाता सत्यापित: ${prefillData.email}। कृपया नीचे प्रोफ़ाइल विवरण भरें।`
              : `Google account verified: ${prefillData.email}. Please fill profile details below.`
          );
          return;
        }
      }

      setScreen(initialScreen);
      setSignUpStep(1);
      setIsGoogleRegistration(false);
    }
  }, [isOpen, initialScreen, prefillData, language]);

  // Instantly cancel loading without delay if user switches back from Google window/popup
  useEffect(() => {
    if (!isOpen) return;

    let timer: any = null;
    const handleReturn = () => {
      if (isLoading) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 900);
      }
    };

    window.addEventListener('focus', handleReturn);
    document.addEventListener('visibilitychange', handleReturn);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('focus', handleReturn);
      document.removeEventListener('visibilitychange', handleReturn);
    };
  }, [isOpen, isLoading]);

  // Lock background scroll when open as modal dialog
  useEffect(() => {
    if (isOpen && !isFullPageGate) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen, isFullPageGate]);

  // Dynamic age calculation from DOB
  useEffect(() => {
    if (dob) {
      const computed = calculateExactAge(dob);
      setCalculatedAge(computed);
    }
  }, [dob]);

  // Dynamic DOB boundaries
  const { maxDob, minDob } = useMemo(() => {
    const today = new Date();
    const max = `${today.getFullYear() - 14}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const min = `${today.getFullYear() - 100}-01-01`;
    return { maxDob: max, minDob: min };
  }, []);

  // Available social categories for selected country
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

  // Sync state division and category when country changes
  useEffect(() => {
    if (countryMeta.divisions.length > 0 && !countryMeta.divisions.includes(division)) {
      setDivision(countryMeta.divisions[0]);
    }
    if (availableCategories.length > 0 && !availableCategories.some((c) => c.id === casteCategory)) {
      setCasteCategory(availableCategories[0].id);
    }
  }, [country, countryMeta, availableCategories]);

  // Live anti-fraud validations for credentials
  const nameValidation = useMemo(() => {
    if (!name.trim()) return null;
    return validateRealName(name.trim(), language);
  }, [name, language]);

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

  const dobValidation = useMemo(() => {
    if (!dob) return null;
    return validateRealDob(dob, language);
  }, [dob, language]);

  const nationalIdValidation = useMemo(() => {
    if (!nationalIdInput.trim()) return null;
    return validateRealNationalId(nationalIdInput.trim(), country, language);
  }, [nationalIdInput, country, language]);

  if (!isOpen) return null;

  // Real Google Sign-In & Registration handler
  // Opens official Google OAuth popup (GIS / Firebase) displaying real Gmail accounts
  const handleGoogleAuthAction = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessNotice(null);
    setAccountNotFoundNotice(false);

    try {
      const result = await GoogleAuthService.signInWithGoogle();
      if (!result.success) {
        throw new Error('Google authentication unsuccessful.');
      }

      const googleEmail = result.email.toLowerCase().trim();
      const googleName = result.name.trim();

      // Check if this Google account is already registered in our database
      try {
        const res = await fetch(`/api/citizens/profile?email=${encodeURIComponent(googleEmail)}`);
        const data = await res.json();

        if (data.success && data.citizen && data.citizen.isOnboarded) {
          // Case 1: Account already registered - Log in immediately!
          onClose();
          onLoginSuccess(data.citizen);
          return;
        }
      } catch (checkErr) {
        console.warn('Citizen lookup note:', checkErr);
      }

      // Case 2: Account is NOT registered yet!
      // As requested: Route them directly to Sign Up -> Step 2 (Details Fill Page) with prefilled Google Name & Email
      setName(googleName);
      setEmail(googleEmail);
      setGooglePhotoURL(result.photoURL || '');
      setIsGoogleRegistration(true);
      setScreen('signup');
      setSignUpStep(2);
      setSuccessNotice(
        language === 'hi'
          ? `Google खाता सत्यापित: ${googleEmail}। यह खाता अभी पंजीकृत नहीं है। कृपया नीचे प्रोफ़ाइल विवरण भरकर पंजीकरण पूर्ण करें।`
          : `Google account verified: ${googleEmail}. Not registered yet. Please complete profile details below to finish registration.`
      );
    } catch (err: any) {
      console.warn('Google Auth notice:', err);
      const code = (err?.code || err?.message || '').toLowerCase();
      if (
        code.includes('unauthorized-domain') ||
        code.includes('origin_mismatch') ||
        code.includes('redirect_uri_mismatch') ||
        code.includes('auth/failed') ||
        code.includes('not-configured')
      ) {
        setShowLocalIpGooglePrompt(true);
      }
      setErrorMessage(getGoogleAuthErrorMessage(err?.code || err?.message, language));
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Google Connect for local Wi-Fi IP / private network testing
  const handleGoogleDirectConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const emailCheck = validateRealEmail(googleFallbackEmail, language);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || 'Invalid email');
      return;
    }

    const cleanEmail = emailCheck.cleanEmail;
    const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const derivedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/citizens/profile?email=${encodeURIComponent(cleanEmail)}`);
      const data = await res.json();

      if (data.success && data.citizen && data.citizen.isOnboarded) {
        // Case 1: Account already registered - Log in immediately!
        onClose();
        onLoginSuccess(data.citizen);
        return;
      }

      // Case 2: Not registered yet - Route to Step 2 (Details Page)
      setName(derivedName);
      setEmail(cleanEmail);
      setIsGoogleRegistration(true);
      setScreen('signup');
      setSignUpStep(2);
      setShowLocalIpGooglePrompt(false);
      setSuccessNotice(
        language === 'hi'
          ? `Google खाता सत्यापित: ${cleanEmail}। कृपया नीचे प्रोफ़ाइल विवरण भरकर खाता निर्माण पूरा करें।`
          : `Google account verified: ${cleanEmail}. Please complete profile details below to finish registration.`
      );
    } catch (err: any) {
      setErrorMessage(
        language === 'hi'
          ? 'तकनीकी समस्या आई। पुनः प्रयास करें।'
          : 'Network error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Handler for Email/Password Login (Strict registered accounts only)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);
    setAccountNotFoundNotice(false);

    // 1. Email format check
    const emailCheck = validateRealEmail(email, language);
    if (!emailCheck.valid) {
      setErrorMessage(
        emailCheck.error ||
          (language === 'hi' ? 'कृपया मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.')
      );
      return;
    }

    if (!password) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
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
        if (data.errorType === 'ACCOUNT_NOT_FOUND') {
          setAccountNotFoundNotice(true);
          setErrorMessage(
            language === 'hi'
              ? 'यह ईमेल पंजीकृत नहीं है। कृपया पहले नया खाता बनाएं (Sign Up)।'
              : 'No account found with this email. Please sign up first.'
          );
        } else if (data.errorType === 'GOOGLE_LINKED_ACCOUNT') {
          setErrorMessage(
            language === 'hi'
              ? 'यह खाता Google द्वारा पंजीकृत है। कृपया नीचे "गूगल द्वारा जारी रखें" बटन का उपयोग करें।'
              : 'This account is linked to Google. Please use the Google sign-in button below.'
          );
        } else {
          setErrorMessage(
            data.message || (language === 'hi' ? 'अमान्य ईमेल अथवा पासवर्ड।' : 'Invalid email or password.')
          );
        }
        return;
      }

      // Successful login
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

  // Sign Up Step 1 -> Step 2 Transition (Validates credentials then moves to Details Page)
  const handleProceedToDetailsStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    // 1. Real Legal Name Check
    const nameCheck = validateRealName(name, language);
    if (!nameCheck.valid) {
      setErrorMessage(nameCheck.error || 'Invalid name');
      return;
    }

    // 2. Real Email Check (Blocks fake, burner, disposable emails)
    const emailCheck = validateRealEmail(email, language);
    if (!emailCheck.valid) {
      setErrorMessage(emailCheck.error || 'Invalid email');
      return;
    }

    // 3. Real Password Check
    const passwordCheck = validateRealPassword(password, name, emailCheck.cleanEmail, language);
    if (!passwordCheck.valid) {
      setErrorMessage(passwordCheck.error || 'Weak password');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(language === 'hi' ? 'दोनों पासवर्ड समान होने चाहिए।' : 'Passwords do not match.');
      return;
    }

    // 4. Quick check if this email already exists in DB
    setIsLoading(true);
    try {
      const res = await fetch(`/api/citizens/profile?email=${encodeURIComponent(emailCheck.cleanEmail)}`);
      const data = await res.json();
      if (data.success && data.citizen) {
        setErrorMessage(
          language === 'hi'
            ? 'यह ईमेल पहले से पंजीकृत है! कृपया लॉगिन करें या दूसरा ईमेल उपयोग करें।'
            : 'This email is already registered! Please log in or use another email.'
        );
        setIsLoading(false);
        return;
      }
    } catch (e) {
      // Proceed if network check errors
    } finally {
      setIsLoading(false);
    }

    // Credentials verified! Advance directly to Details Page (Step 2)
    setIsGoogleRegistration(false);
    setSignUpStep(2);
    setSuccessNotice(
      language === 'hi'
        ? 'क्रेडेंशियल सत्यापित! कृपया अब नीचे अपना प्रोफ़ाइल विवरण भरें।'
        : 'Credentials verified! Please fill in your profile details below.'
    );
  };

  // Sign Up Step 2 Submit Handler (Finalizes Account Creation in Database)
  const handleFinalSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    // 1. Validate DOB
    const dobCheck = validateRealDob(dob, language);
    if (!dobCheck.valid) {
      setErrorMessage(dobCheck.error || 'Invalid Date of Birth');
      return;
    }

    // 2. Validate National ID if provided
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
          email: email.trim().toLowerCase(),
          password: isGoogleRegistration ? undefined : password,
          isGoogleLinked: isGoogleRegistration,
          dob,
          nationalId: nationalIdInput.trim(),
          country,
          casteCategory,
          gender,
          administrativeDivision: division,
          lifePhase: selectedRole,
          nationalIdName: countryMeta.nationalIdName,
          photoURL: googlePhotoURL,
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

  // Submit Handler for Forgot Password
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

  const renderAuthCard = () => {
    return (
      <div className={`w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-7 flex flex-col z-10 text-slate-900 ${
      isFullPageGate ? 'relative' : 'relative my-auto max-h-[94vh] overflow-y-auto'
    }`}>
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-1">
        {screen === 'forgot_password' ? (
          <button
            type="button"
            onClick={() => {
              setIsLoading(false);
              setScreen('login');
              setErrorMessage(null);
              setSuccessNotice(null);
              setAccountNotFoundNotice(false);
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
        ) : screen === 'signup' && signUpStep === 2 ? (
          <button
            type="button"
            onClick={() => {
              setIsLoading(false);
              setSignUpStep(1);
              setErrorMessage(null);
              setSuccessNotice(null);
            }}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
            aria-label="Back to Step 1"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
            <span>{language === 'hi' ? 'कदम 1 (क्रेडेंशियल)' : 'Step 1 (Credentials)'}</span>
          </button>
        ) : screen === 'signup' && signUpStep === 1 ? (
          <button
            type="button"
            onClick={() => {
              setIsLoading(false);
              setScreen('login');
              setErrorMessage(null);
              setSuccessNotice(null);
              setAccountNotFoundNotice(false);
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Back to Login"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}

        {!isFullPageGate ? (
          <button
            type="button"
            onClick={() => {
              setIsLoading(false);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
      </div>

        {/* Header Title & Subtitle */}
        <div className="text-center mt-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {screen === 'login'
              ? (language === 'hi' ? 'नागरिक लॉगिन' : 'Citizen Log In')
              : screen === 'signup' && signUpStep === 1
              ? (language === 'hi' ? 'खाता बनाएं (कदम 1/2)' : 'Create Account (Step 1/2)')
              : screen === 'signup' && signUpStep === 2
              ? (language === 'hi' ? 'नागरिक प्रोफ़ाइल विवरण (कदम 2/2)' : 'Profile Details (Step 2/2)')
              : (language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password')}
          </h2>

          {/* Stepper Indicator for Sign Up */}
          {screen === 'signup' && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold transition-all ${
                  signUpStep === 1
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                1. {language === 'hi' ? 'खाता क्रेडेंशियल' : 'Credentials'}
              </span>
              <span className="text-slate-300 font-bold">•</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold transition-all ${
                  signUpStep === 2
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                2. {language === 'hi' ? 'नागरिक विवरण' : 'Details Page'}
              </span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-slate-500 mt-2 px-1 leading-relaxed">
            {screen === 'login'
              ? (language === 'hi'
                  ? 'अपने खाते में सुरक्षित प्रवेश के लिए ईमेल व पासवर्ड दर्ज करें।'
                  : 'Enter your registered email and password to securely access your profile.')
              : screen === 'signup' && signUpStep === 1
              ? (language === 'hi'
                  ? 'पहले अपना नाम, वैध ईमेल व पासवर्ड दर्ज करें या गूगल से जारी रखें।'
                  : 'Enter your legal name, real email and password, or use Google.')
              : screen === 'signup' && signUpStep === 2
              ? (language === 'hi'
                  ? 'सटीक सरकारी योजनाएं व अवसर पाने के लिए अपनी नागरिक जानकारी भरें।'
                  : 'Fill in your personal profile details to unlock all eligible opportunities.')
              : (language === 'hi'
                  ? 'अपना ईमेल पता दर्ज करें, हम पासवर्ड रीसेट लिंक भेजेंगे।'
                  : 'Enter your email address to receive a reset link.')}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-3.5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span>{errorMessage}</span>
              {accountNotFoundNotice && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setScreen('signup');
                      setSignUpStep(1);
                      setErrorMessage(null);
                      setAccountNotFoundNotice(false);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-all cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'नया खाता बनाएं (Sign Up Now)' : 'Sign Up Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="mt-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{successNotice}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* SCREEN 1: LOGIN                                          */}
        {/* ======================================================== */}
        {screen === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-4 space-y-3.5">
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
                  placeholder={language === 'hi' ? 'पंजीकृत ईमेल पता' : 'Registered email address'}
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
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
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
                  setAccountNotFoundNotice(false);
                }}
                className="font-bold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password'}
              </button>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-3"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span>{language === 'hi' ? 'लॉगिन करें' : 'Login'}</span>
              )}
            </button>

            {/* Switch to Sign Up */}
            <div className="text-center pt-1.5">
              <p className="text-xs text-slate-500">
                <span>{language === 'hi' ? 'खाता नहीं है? ' : "Don't have an account? "}</span>
                <button
                  type="button"
                  onClick={() => {
                    setScreen('signup');
                    setSignUpStep(1);
                    setErrorMessage(null);
                    setSuccessNotice(null);
                    setAccountNotFoundNotice(false);
                  }}
                  className="font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  {language === 'hi' ? 'साइन अप करें (Sign Up here)' : 'Sign Up here'}
                </button>
              </p>
            </div>

            {/* Divider: Or Continue With Google */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] font-semibold text-slate-400">
                <span className="bg-white px-3">
                  {language === 'hi' ? 'अथवा गूगल द्वारा' : 'Or Continue With Google'}
                </span>
              </div>
            </div>

            {/* Google OAuth Button (Authentic Google Popup) */}
            <div className="flex justify-center pb-1">
              <button
                type="button"
                onClick={handleGoogleAuthAction}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-98 disabled:opacity-60"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {language === 'hi' ? 'गूगल से लॉगिन करें' : 'Continue with Google'}
                </span>
              </button>
            </div>

            {/* Local IP Google Direct Connect Fallback */}
            {showLocalIpGooglePrompt && (
              <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <p className="font-bold leading-tight">
                      {language === 'hi'
                        ? 'लोकल वाई-फाई IP पर Google सत्यापन'
                        : 'Local Network IP Google Verification'}
                    </p>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      {language === 'hi'
                        ? 'Google सुरक्षा नीति लोकल IP पर पॉप-अप नहीं खोलती। नीचे अपना Google ईमेल दर्ज करके सीधे आगे बढ़ें:'
                        : 'Google OAuth prohibits popups on private IPs. Enter your Google email to continue:'}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <input
                        type="email"
                        value={googleFallbackEmail}
                        onChange={(e) => setGoogleFallbackEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-slate-900 outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleGoogleDirectConnect}
                        disabled={isLoading}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {language === 'hi' ? 'सत्यापित करें' : 'Verify'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Immediate Cancel Button if Waiting */}
            {isLoading && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(false);
                    setErrorMessage(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  {language === 'hi' ? 'प्रतीक्षा रद्द करें (Cancel)' : 'Cancel Processing'}
                </button>
              </div>
            )}
          </form>
        )}

        {/* ======================================================== */}
        {/* SCREEN 2: SIGN UP - STEP 1 (CREDENTIALS)                 */}
        {/* ======================================================== */}
        {screen === 'signup' && signUpStep === 1 && (
          <form onSubmit={handleProceedToDetailsStep} className="mt-4 space-y-3">
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
                  placeholder={language === 'hi' ? 'पूरा नाम (Full Legal Name)' : 'Full Legal Name'}
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

            {/* Email Address (Strict Real Email Validation) */}
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
                  placeholder={language === 'hi' ? 'वास्तविक ईमेल पता (उदा. name@gmail.com)' : 'Real email address (e.g. name@gmail.com)'}
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
                  placeholder={language === 'hi' ? 'पासवर्ड (8+ वर्ण, A-Z, a-z, 0-9, @#$)' : 'Password (8+ chars, A-Z, a-z, 0-9, @#$)'}
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
                    <span>{language === 'hi' ? 'पासवर्ड सुरक्षित है' : 'Strong & secure password'}</span>
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

            {/* Continue to Details Page Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{language === 'hi' ? 'विवरण भरें (Continue to Details)' : 'Continue to Profile Details'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch to Sign In */}
            <div className="text-center pt-1.5">
              <p className="text-xs text-slate-500">
                <span>{language === 'hi' ? 'पहले से खाता है? ' : 'Already have an account? '}</span>
                <button
                  type="button"
                  onClick={() => {
                    setScreen('login');
                    setErrorMessage(null);
                    setSuccessNotice(null);
                    setAccountNotFoundNotice(false);
                  }}
                  className="font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  {language === 'hi' ? 'साइन इन करें (Sign In here)' : 'Sign In here'}
                </button>
              </p>
            </div>

            {/* Divider: Or Continue With Google */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] font-semibold text-slate-400">
                <span className="bg-white px-3">
                  {language === 'hi' ? 'अथवा गूगल द्वारा सीधा पंजीकरण' : 'Or 1-Click Google Sign Up'}
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <div className="flex justify-center pb-1">
              <button
                type="button"
                onClick={handleGoogleAuthAction}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-98 disabled:opacity-60"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {language === 'hi' ? 'गूगल से खाता बनाएं (Google Sign Up)' : 'Sign up with Google'}
                </span>
              </button>
            </div>

            {/* Local IP Google Direct Connect Fallback */}
            {showLocalIpGooglePrompt && (
              <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <p className="font-bold leading-tight">
                      {language === 'hi'
                        ? 'Google खाता सीधा सत्यापन (Local IP)'
                        : 'Google Account Direct Connect (Local IP)'}
                    </p>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      {language === 'hi'
                        ? 'लोकल वाई-फाई IP पर Google सुरक्षा नीति पॉप-अप नहीं खोलती। नीचे अपना Google ईमेल दर्ज करके सीधे आगे बढ़ें:'
                        : 'Google OAuth prohibits popups on private IPs. Enter your Google email to continue:'}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <input
                        type="email"
                        value={googleFallbackEmail}
                        onChange={(e) => setGoogleFallbackEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-slate-900 outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleGoogleDirectConnect}
                        disabled={isLoading}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {language === 'hi' ? 'सत्यापित करें' : 'Verify'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Immediate Cancel Button if Waiting */}
            {isLoading && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(false);
                    setErrorMessage(null);
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  {language === 'hi' ? 'प्रतीक्षा रद्द करें (Cancel)' : 'Cancel Processing'}
                </button>
              </div>
            )}
          </form>
        )}

        {/* ======================================================== */}
        {/* SCREEN 2: SIGN UP - STEP 2 (THE DETAILS PAGE)             */}
        {/* ======================================================== */}
        {screen === 'signup' && signUpStep === 2 && (
          <form onSubmit={handleFinalSignUpSubmit} className="mt-4 space-y-3.5">
            {/* Verified Account Identification Banner */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {isGoogleRegistration ? 'G' : <User className="w-4 h-4" />}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-900 truncate">{name}</div>
                  <div className="text-[11px] font-medium text-slate-500 truncate">{email}</div>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{isGoogleRegistration ? 'Google Verified' : 'Verified'}</span>
              </span>
            </div>

            {/* Country Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 px-1 flex items-center justify-between">
                <span>{language === 'hi' ? 'देश / राष्ट्र (Country) *' : 'Country / Region *'}</span>
                <span className="text-emerald-700 font-mono font-bold">{countryMeta.name} ({countryMeta.alpha3 || country})</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto p-1.5 border border-slate-200 rounded-2xl bg-slate-50">
                {Object.values(COUNTRIES).map((c) => (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => setCountry(c.code as CountryCode)}
                    className={`py-1 px-1.5 rounded-xl text-center text-[10px] font-bold border transition-all cursor-pointer truncate ${
                      country === c.code
                        ? 'border-emerald-600 bg-white text-emerald-950 shadow-2xs font-black'
                        : 'border-transparent text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    <span>{c.code}</span> - <span className="font-mono">{c.alpha3}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date of Birth & Live Calculated Age */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between px-1">
                <span>{language === 'hi' ? 'जन्म तिथि (Date of Birth) *' : 'Date of Birth *'}</span>
                {calculatedAge >= 14 && (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
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
                  required
                  value={dob}
                  max={maxDob}
                  min={minDob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border text-xs font-bold text-slate-900 focus:bg-white outline-none ${
                    dobValidation && !dobValidation.valid ? 'border-red-400' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
              </div>
              {dobValidation && !dobValidation.valid && (
                <p className="text-[10px] font-semibold text-red-600 mt-1 pl-2">
                  {dobValidation.error}
                </p>
              )}
            </div>

            {/* State / Administrative Division */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 px-1">
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

            {/* Demographic / Caste Category */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 px-1">
                {language === 'hi' ? countryMeta.categoryLabelHi : countryMeta.categoryLabel} *
              </label>
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

            {/* Life Phase / Role Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 px-1 flex items-center justify-between">
                <span>{language === 'hi' ? 'वर्तमान भूमिका / पेशा (Occupation) *' : 'Occupation / Role *'}</span>
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

            {/* Gender Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 px-1">
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
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-extrabold shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'hi' ? g.labelHi : g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* National ID / Aadhaar */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between px-1">
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

            {/* Two-Button Bottom Navigation */}
            <div className="pt-2 flex items-center gap-2.5">
              {!isGoogleRegistration && (
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(false);
                    setSignUpStep(1);
                  }}
                  className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>{language === 'hi' ? 'खाता बनाएं (Create Account)' : 'Create Account'}</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* SCREEN 3: FORGOT PASSWORD                                */}
        {/* ======================================================== */}
        {screen === 'forgot_password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="mt-4 space-y-4">
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
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <span>{language === 'hi' ? 'पासवर्ड रीसेट लिंक भेजें' : 'Send Reset Link'}</span>
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-1.5">
              <button
                type="button"
                onClick={() => {
                  setScreen('login');
                  setErrorMessage(null);
                  setSuccessNotice(null);
                  setAccountNotFoundNotice(false);
                }}
                className="font-extrabold text-xs text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
              >
                {language === 'hi' ? 'वापस लॉगिन पर जाएं' : 'Back to Login'}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  if (isFullPageGate) {
    return (
      <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
        {/* Subtle Ambient Light Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/70 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-teal-100/70 rounded-full blur-3xl pointer-events-none" />

        {/* Top Sovereign Bar */}
        <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between relative z-20 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-black shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-tight text-slate-900">CITIZEN LIFE OS</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">
                  SOVEREIGN CIVIC OS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                {language === 'hi' ? 'सत्यापित राष्ट्रीय व वैश्विक अवसर पोर्टल' : 'Verified Civic & Opportunity Platform'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher (All 6 Languages) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="h-8 sm:h-9 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase">{language}</span>
              </button>
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50">
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'hi', label: 'हिन्दी' },
                      { code: 'es', label: 'Español' },
                      { code: 'fr', label: 'Français' },
                      { code: 'de', label: 'Deutsch' },
                      { code: 'ar', label: 'العربية' },
                    ].map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code as any);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-bold rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                          language === l.code ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{l.label}</span>
                        <span className="font-mono text-[10px] uppercase opacity-70">{l.code}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Split Section */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 relative z-10 my-auto">
          {/* Left Column: Platform Branding & Highlights */}
          <div className="w-full lg:w-1/2 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>SOVEREIGN CIVIC INTELLIGENCE 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {language === 'hi' ? (
                <>
                  सभी राष्ट्रीय व वैश्विक अवसरों हेतु{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    एक सुरक्षित नागरिक खाता
                  </span>
                </>
              ) : (
                <>
                  One Secure Citizen Account for{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    All National & Global Opportunities
                  </span>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              {language === 'hi'
                ? 'बिना किसी फर्जीवाड़े के 250+ सत्यापित सरकारी योजनाएं, प्रतियोगी परीक्षाएं, छात्रवृत्तियां, इंटर्नशिप और रोजगार अवसर सीधे आधिकारिक सरकारी पोर्टलों से।'
                : 'Zero-scam civic discovery platform. Access 250+ verified government schemes, competitive exams, national scholarships, and career roadmaps directly from official sources.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {language === 'hi' ? '100% सत्यापित पोर्टल' : '100% Verified Portals'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'hi' ? 'केवल आधिकारिक डायरेक्ट लिंक्स' : 'Direct official application URLs'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {language === 'hi' ? 'आयु व पात्रता ऑटो-मैच' : 'Instant Eligibility Match'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'hi' ? 'राज्य व श्रेणी अनुसार फिल्टर' : 'Auto-filtered by state and role'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {language === 'hi' ? '1-वर्षीय नागरिक पास' : '1-Year Citizen Pass'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'hi' ? 'केवल ₹19 में असीमित पहुंच' : 'Full access for just ₹19/year'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {language === 'hi' ? '24x7 नागरिक हेल्पलाइन' : '24x7 Citizen Helplines'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'hi' ? 'आपातकालीन सहायता नंबर' : 'National emergency & youth lines'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Auth Card */}
          <div className="w-full lg:w-1/2 flex justify-center">
            {renderAuthCard()}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-slate-200 bg-white/90 px-4 py-4 text-center text-xs text-slate-500 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p>Citizen Life OS • Sovereign Civic Platform</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500">
              <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy</Link>
              <Link href="/refund" className="hover:text-slate-900 transition-colors">Refund Policy</Link>
              <Link href="/helpline" className="hover:text-slate-900 transition-colors">Helpline</Link>
              <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
              <Link href="/disclaimer" className="hover:text-slate-900 transition-colors">Disclaimer</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md">
      <div className="fixed inset-0" onClick={() => { setIsLoading(false); onClose(); }} />
      {renderAuthCard()}
    </div>
  );
};
