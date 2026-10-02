'use client';

import React, { useState } from 'react';
import { CitizenProfile, FamilyMember } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry } from '@/context/CountryContext';
import { GoogleAuthService, getGoogleAuthErrorMessage } from '@/services/googleAuth';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Smartphone,
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
        if (onGoogleSuccess) {
          onClose();
          onGoogleSuccess({
            name: result.name,
            email: result.email,
            photoURL: result.photoURL,
          });
        } else {
          setGoogleLoginError(
            language === 'hi'
              ? 'इस गूगल खाते से पंजीकृत नागरिक प्रोफाइल नहीं मिला। कृपया नीचे "साइन अप" द्वारा पंजीकरण करें।'
              : 'No registered citizen profile found for this Google account. Please use Sign Up below to register.'
          );
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

  const handleSignUpClick = () => {
    onClose();
    if (onOpenOnboarding) {
      onOpenOnboarding();
    }
  };

  const handleToggleWhatsApp = (enabled: boolean) => {
    onUpdateProfile({
      notificationsEnabled: {
        ...profile.notificationsEnabled,
        whatsApp: enabled,
      },
    });
  };

  const handleToggleWebPush = (enabled: boolean) => {
    onUpdateProfile({
      notificationsEnabled: {
        ...profile.notificationsEnabled,
        webPush: enabled,
      },
    });
  };

  if (!isOpen) return null;

  const isVerified = profile.isAadhaarVerified;
  const roleName = profile.lifePhase ? t(`roles.${profile.lifePhase}`) : t('roles.college_student');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col max-h-[90vh] z-10 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400 font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {t('profile.title')}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isVerified ? profile.fullName : t('profile.guest_title')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 overscroll-contain">
          {!isVerified ? (
            /* Guest Mode: Distinct Sign In vs Sign Up */
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

              {/* Action 1: Sign In for Returning Citizens */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <LogIn className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {language === 'hi' ? 'साइन इन (Sign In)' : 'Sign In'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {language === 'hi'
                        ? 'पहले से पंजीकृत नागरिक? सीधे Google से लॉगिन करें।'
                        : 'Returning citizen? Access your existing verified profile.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignInGoogle}
                  disabled={isGoogleLoggingIn}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-sm hover:shadow disabled:opacity-60 active:scale-[0.99]"
                >
                  {isGoogleLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  )}
                  <span>{language === 'hi' ? 'गूगल द्वारा साइन इन करें' : 'Sign In with Google'}</span>
                </button>
              </div>

              {/* Action 2: Sign Up for New Citizens */}
              <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                      {language === 'hi' ? 'साइन अप (Sign Up)' : 'Sign Up / Register'}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      {language === 'hi'
                        ? 'नए नागरिक? नाम, जन्म तिथि, आधार व वर्ग दर्ज कर खाता बनाएं।'
                        : 'New citizen? Register with real identity details to unlock matched schemes.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignUpClick}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99]"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>{language === 'hi' ? 'नया नागरिक पंजीकरण करें (Sign Up)' : 'Create New Citizen Account (Sign Up)'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
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

              {/* Total Unlocked Value Counter Card */}
              {totalBenefitsUnlocked !== undefined && totalBenefitsUnlocked > 0 && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/40 text-white shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'hi' ? 'कुल अनलॉक अवसर मूल्य' : 'Total Unlocked Benefits'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-md border border-emerald-600">
                      ₹19 Pass
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 my-1">
                    {countryMeta.currencySymbol}{totalBenefitsUnlocked.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {language === 'hi'
                      ? 'आपकी आयु एवं क्षेत्र के आधार पर सत्यापित छात्रवृत्तियां, सरकारी योजनाएं, स्वास्थ्य कवर एवं करियर अवसर।'
                      : 'Verified scholarships, subsidies, health coverage & career vacancies unlocked for your profile.'}
                  </p>
                </div>
              )}

              {/* Notification Preferences */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <span>{t('profile.direct_alerts')}</span>
                </h4>

                <div className="space-y-2">
                  {/* WhatsApp Alerts */}
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {t('settings.whatsapp_alerts')}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {t('settings.urgent_only')}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.notificationsEnabled?.whatsApp ?? true}
                      onChange={(e) => handleToggleWhatsApp(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
                    />
                  </label>

                  {/* Web Push Alerts */}
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {t('settings.push_alerts')}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {t('settings.push_subtext')}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.notificationsEnabled?.webPush ?? true}
                      onChange={(e) => handleToggleWebPush(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
                    />
                  </label>
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-2">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-700" />
                  <span>{t('profile.logout_btn')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <h4 className="font-extrabold text-slate-900 text-sm">
              {t('profile.logout_confirm_title')}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('profile.logout_confirm_desc')}
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t('profile.logout_cancel')}
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onClose();
                  onLogout?.();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white cursor-pointer shadow-xs"
              >
                {t('profile.logout_confirm_yes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
