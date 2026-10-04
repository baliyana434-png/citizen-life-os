'use client';

import React, { useState, useEffect } from 'react';
import { CitizenProfile, FamilyMember } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry } from '@/context/CountryContext';
import { GoogleAuthService, getGoogleAuthErrorMessage } from '@/services/googleAuth';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  AlertTriangle,
  Lock,
  User,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Briefcase,
  MapPin,
  CreditCard,
  Award,
  Sparkles,
  Check,
  LogIn,
  UserPlus,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CitizenProfile;
  onUpdateProfile: (updated: Partial<CitizenProfile>) => void;
  familyMembers?: FamilyMember[];
  activeMemberId?: string;
  onSwitchMember?: (id: string) => void;
  onLogout?: () => void;
  onOpenAuth?: (screen?: 'login' | 'signup', prefill?: { name: string; email: string; photoURL?: string; isGoogle?: boolean }) => void;
  onOpenLogin?: () => void;
  onOpenOnboarding?: () => void;
  onOpenSubscription?: () => void;
  onLoginSuccess?: (updated: Partial<CitizenProfile>) => void;
  onGoogleSuccess?: (googleUser: { name: string; email: string; photoURL?: string }) => void;
  onAddFamilyMember?: (member: FamilyMember) => void;
  onDeleteFamilyMember?: (id: string) => void;
  totalBenefitsUnlocked?: number;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onLogout,
  onOpenAuth,
  onOpenOnboarding,
  onOpenSubscription,
  onLoginSuccess,
  onGoogleSuccess,
  totalBenefitsUnlocked,
}) => {
  const { t, language } = useTranslation();
  const { country, countryMeta } = useCountry();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState<boolean>(false);
  const [googleLoginError, setGoogleLoginError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Sync theme with document class / localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('citizen_theme') === 'dark';
      setTheme(isDark ? 'dark' : 'light');
    }
  }, [isOpen]);

  const handleToggleTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('citizen_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('citizen_theme', 'light');
      }
      window.dispatchEvent(new Event('citizen_theme_changed'));
    }
  };

  const handleSignInGoogle = async () => {
    setIsGoogleLoggingIn(true);
    setGoogleLoginError(null);
    try {
      const result = await GoogleAuthService.signInWithGoogle();
      if (result.success) {
        // Look up registered citizen on server
        try {
          const res = await fetch(`/api/citizens/profile?email=${encodeURIComponent(result.email)}`);
          const data = await res.json();
          if (data.success && data.citizen && data.citizen.isOnboarded) {
            onClose();
            if (onLoginSuccess) {
              onLoginSuccess(data.citizen);
            } else {
              onUpdateProfile(data.citizen);
            }
            return;
          }
        } catch (fetchErr) {
          console.warn('Server lookup error:', fetchErr);
        }

        // If no registered profile found, route to Sign Up with verified Google account
        onClose();
        if (onOpenAuth) {
          onOpenAuth('signup', {
            name: result.name,
            email: result.email,
            photoURL: result.photoURL,
            isGoogle: true,
          });
        } else if (onGoogleSuccess) {
          onGoogleSuccess({
            name: result.name,
            email: result.email,
            photoURL: result.photoURL,
          });
        }
      } else {
        setGoogleLoginError(getGoogleAuthErrorMessage('auth/failed', language));
      }
    } catch (e: any) {
      setGoogleLoginError(getGoogleAuthErrorMessage(e?.code || e?.message, language));
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  // Reset logout confirmation when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setShowLogoutConfirm(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isVerified = profile.isAadhaarVerified;
  const roleName = profile.lifePhase ? t(`roles.${profile.lifePhase}`) : t('roles.college_student');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col max-h-[90vh] z-10 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400 font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                {t('profile.title')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isVerified ? profile.fullName : t('profile.guest_title')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 overscroll-contain">
          {!isVerified ? (
            /* Guest Mode: Unified Auth Access */
            <div className="space-y-4 py-2">
              <div className="text-center pb-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{countryMeta.flag} {countryMeta.name} • {t('hero.unverified_status')}</span>
                </span>
              </div>

              {googleLoginError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{googleLoginError}</span>
                  </div>
                </div>
              )}

              {/* Unified Auth Access Card */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800">
                <div>
                  <h4 className="text-base font-extrabold text-white leading-tight">
                    {language === 'hi' ? 'नागरिक लॉगिन व पंजीकरण' : 'Citizen Login & Sign Up'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {language === 'hi'
                      ? 'अपने खाते में लॉगिन करें या प्रामाणिक विवरण द्वारा नया खाता बनाएं।'
                      : 'Sign in to access your profile or register a new verified account.'}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {/* Open Auth Modal Button */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenAuth) onOpenAuth();
                      else if (onOpenOnboarding) onOpenOnboarding();
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                  >
                    <User className="w-4 h-4" />
                    <span>{language === 'hi' ? 'लॉगिन / नया खाता बनाएं' : 'Log In / Create Account'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>

                  {/* Or Continue with Google */}
                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      <span className="bg-slate-900 px-2">{language === 'hi' ? 'अथवा' : 'Or'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignInGoogle}
                    disabled={isGoogleLoggingIn}
                    className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60"
                  >
                    {isGoogleLoggingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-900 shrink-0" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    )}
                    <span>{language === 'hi' ? 'गूगल द्वारा जारी रखें' : 'Continue with Google'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Verified Citizen Mode */
            <>
              {/* Official Citizen Digital Identity Card */}
              <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl border border-slate-800 space-y-4">
                {/* ID Card Top Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{countryMeta.flag}</span>
                    <span className="text-xs font-mono font-bold tracking-wider text-emerald-400">
                      {countryMeta.alpha3 || country}
                    </span>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300">
                      {t('profile.title')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded-md bg-white/10 border border-white/10">
                    {profile.nationalIdMasked || `${countryMeta.alpha3 || country}-CIT-8921`}
                  </span>
                </div>

                {/* Identity Attributes Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {/* Role / Occupation */}
                  <div className="col-span-2 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                      {t('profile.occupation')}
                    </span>
                    <span className="text-emerald-400 font-bold text-sm mt-1 block">
                      {roleName}
                    </span>
                  </div>

                  {/* Age & DOB */}
                  <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                      {t('hero.age_label')}
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-white font-bold text-sm">
                        {profile.age || 21} {t('hero.years_suffix')}
                      </span>
                    </div>
                    {profile.dob && (
                      <span className="text-[10px] text-emerald-400/90 block font-mono">
                        {profile.dob}
                      </span>
                    )}
                  </div>

                  {/* Caste or Country Demographic Category */}
                  <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider truncate">
                      {countryMeta.hasCasteSystem 
                        ? (language === 'hi' ? 'जाति वर्ग' : 'Caste') 
                        : (language === 'hi' ? countryMeta.categoryLabelHi : countryMeta.categoryLabel)}
                    </span>
                    <span className="text-white font-bold text-sm mt-0.5 block truncate" title={profile.casteCategory || 'General'}>
                      {profile.casteCategory || 'General'}
                    </span>
                  </div>

                  {/* Resident State / Region */}
                  <div className="col-span-2 bg-white/5 p-2.5 rounded-2xl border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                      {countryMeta.administrativeLabel}
                    </span>
                    <span className="text-white font-bold text-sm mt-0.5 block truncate">
                      {profile.state || countryMeta.divisions[0] || 'State'}
                    </span>
                  </div>
                </div>

                {/* ID Card Footer */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{t('onboarding.locked_note').split('.')[0]}</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    {t('profile.aadhaar_badge')}
                  </span>
                </div>
              </div>

              {/* 1-Year Citizen Access Subscription Section */}
              <div className="rounded-2xl p-4 border transition-all space-y-2.5 bg-gradient-to-br from-slate-900 to-slate-950 text-white border-slate-800 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs font-extrabold text-white block">
                        {language === 'hi' ? '1-वर्षीय राष्ट्रीय नागरिक पास' : '1-Year Citizen Access Pass'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {profile.subscription?.status === 'active' 
                          ? (language === 'hi' ? `सक्रिय • वैधता: ${profile.subscription.validUntil}` : `Active • Valid until ${profile.subscription.validUntil}`)
                          : (language === 'hi' ? 'निष्क्रिय • केवल ₹19 / 1 वर्ष' : 'Inactive • Only ₹19 / 1 Year')}
                      </span>
                    </div>
                  </div>
                  {profile.subscription?.status === 'active' ? (
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{language === 'hi' ? 'सक्रिय' : 'Active'}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSubscription?.();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? '₹19 पास लें' : 'Get Pass'}</span>
                    </button>
                  )}
                </div>

                {profile.subscription?.status === 'active' && profile.subscription.transactionId && (
                  <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Txn: {profile.subscription.transactionId}</span>
                    <span className="text-emerald-400">365 Days Unlocked</span>
                  </div>
                )}
              </div>

              {/* Logout Button Section */}
              <div className="pt-2">
                {!showLogoutConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full py-3 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99]"
                  >
                    <LogOut className="w-4 h-4 text-red-700" />
                    <span>{t('profile.logout_btn')}</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-red-50/95 border border-red-300 space-y-3 shadow-sm animate-in fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight">
                          {t('profile.logout_confirm_title')}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                          {t('profile.logout_confirm_desc')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowLogoutConfirm(false);
                          onClose();
                          onLogout?.();
                        }}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-extrabold text-white cursor-pointer shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('profile.logout_confirm_yes')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowLogoutConfirm(false)}
                        className="py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                      >
                        {t('profile.logout_cancel')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Theme Switcher Section (Light / Dark) */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between transition-colors shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700/80 flex items-center justify-center text-slate-700 dark:text-amber-400">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  {language === 'hi' ? 'थीम प्राथमिकता (Theme)' : 'Theme Preference'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {theme === 'dark'
                    ? (language === 'hi' ? 'डार्क मोड सक्रिय' : 'Dark Mode Active')
                    : (language === 'hi' ? 'लाइट मोड सक्रिय' : 'Light Mode Active')}
                </span>
              </div>
            </div>

            <div className="inline-flex p-1 rounded-xl bg-slate-200/90 dark:bg-slate-900 border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleToggleTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'hi' ? 'लाइट' : 'Light'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'hi' ? 'डार्क' : 'Dark'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
