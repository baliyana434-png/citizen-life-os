'use client';

import React, { useState } from 'react';
import { CitizenProfile, FamilyMember } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry } from '@/context/CountryContext';
import { GoogleAuthService } from '@/services/googleAuth';
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
  onLoginSuccess?: (updated: Partial<CitizenProfile>) => void;
  onGoogleSuccess?: (googleUser: { name: string; email: string; photoURL?: string }) => void;
  onAddFamilyMember?: (member: FamilyMember) => void;
  onDeleteFamilyMember?: (id: string) => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onLogout,
  onOpenOnboarding,
  onLoginSuccess,
  onGoogleSuccess,
}) => {
  const { t, language } = useTranslation();
  const { country, countryMeta } = useCountry();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState<boolean>(false);
  const [googleLoginError, setGoogleLoginError] = useState<string | null>(null);

  const handleDirectGoogleLogin = async () => {
    setIsGoogleLoggingIn(true);
    setGoogleLoginError(null);
    try {
      const result = await GoogleAuthService.signInWithGoogle();
      if (result.success) {
        if (onGoogleSuccess) {
          onClose();
          onGoogleSuccess({
            name: result.name,
            email: result.email,
            photoURL: result.photoURL,
          });
        } else {
          const updated: Partial<CitizenProfile> = {
            fullName: result.name,
            email: result.email,
            photoURL: result.photoURL,
            isAadhaarVerified: true,
          };

          fetch('/api/citizens/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          }).catch((e) => console.warn('Profile sync warning:', e));

          if (onLoginSuccess) {
            onLoginSuccess(updated);
          } else {
            onUpdateProfile(updated);
          }
        }
      } else {
        setGoogleLoginError(t('auth.err_failed'));
      }
    } catch (e: any) {
      setGoogleLoginError(e?.message || t('auth.err_failed'));
    } finally {
      setIsGoogleLoggingIn(false);
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
            /* Guest Mode */
            <div className="space-y-4 py-2">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {t('profile.guest_title')}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t('profile.guest_desc')}
                  </p>
                </div>

                {googleLoginError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{googleLoginError}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleDirectGoogleLogin}
                    disabled={isGoogleLoggingIn}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isGoogleLoggingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span>{t('profile.login_btn')}</span>
                  </button>

                  {onOpenOnboarding && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenOnboarding();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'hi' ? 'प्रत्यक्ष नागरिक पंजीकरण' : 'Direct Citizen Registration'}</span>
                    </button>
                  )}
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
                    <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
                      {t('profile.title')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded-md bg-white/10 border border-white/10">
                    {profile.nationalIdMasked || `${country}-CIT-8921`}
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

                  {/* Age */}
                  <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                      {t('hero.age_label')}
                    </span>
                    <span className="text-white font-bold text-sm mt-0.5 block">
                      {profile.age || 21} {t('hero.years_suffix')}
                    </span>
                  </div>

                  {/* Caste Category */}
                  <div className="bg-white/5 p-2.5 rounded-2xl border border-white/10">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                      {t('profile.category')}
                    </span>
                    <span className="text-white font-bold text-sm mt-0.5 block">
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
