'use client';

import React, { useState } from 'react';
import { CitizenProfile, FamilyMember } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { GoogleAuthService } from '@/services/googleAuth';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Smartphone,
  Sparkles,
  ExternalLink,
  LogOut,
  AlertTriangle,
  Lock,
  User,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';

const LIFE_PHASE_OPTIONS = [
  { id: 'college_student', labelEn: 'College Student', labelHi: '🎓 कॉलेज छात्र (College Student)' },
  { id: 'school_student', labelEn: 'School Student', labelHi: '🎒 स्कूली छात्र (School Student)' },
  { id: 'job_seeker', labelEn: 'Job Seeker', labelHi: '💼 नौकरी की तलाश (Job Seeker)' },
  { id: 'exam_aspirant', labelEn: 'Exam Aspirant', labelHi: '📚 प्रतियोगी परीक्षा (Govt Exams)' },
  { id: 'farmer', labelEn: 'Farmer (Kisan)', labelHi: '🌾 किसान (Farmer)' },
  { id: 'business_owner', labelEn: 'Business / Shop Owner', labelHi: '🏢 व्यापारी / स्व-रोजगार (Business)' },
  { id: 'employed', labelEn: 'Employed / Private Job', labelHi: '🛠️ नौकरीपेशा (Employed)' },
  { id: 'homemaker', labelEn: 'Homemaker / Housewife', labelHi: '🏠 गृहणी (Homemaker)' },
  { id: 'senior_citizen', labelEn: 'Senior Citizen', labelHi: '👴 वरिष्ठ नागरिक (Senior Citizen)' },
];

const getRoleLabel = (id?: string, lang: string = 'hi') => {
  const opt = LIFE_PHASE_OPTIONS.find((o) => o.id === id);
  if (!opt) return lang === 'hi' ? '🎓 कॉलेज छात्र (College Student)' : '🎓 College Student';
  return lang === 'hi' ? opt.labelHi : opt.labelEn;
};

const INDIAN_STATES = [
  'Uttar Pradesh',
  'Bihar',
  'Madhya Pradesh',
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
  'Maharashtra',
];

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
  onLoginSuccess,
  onGoogleSuccess,
}) => {
  const { t, language } = useTranslation();
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
      }
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setGoogleLoginError(err.message || (language === 'hi' ? 'Google लॉगिन विफल रहा।' : 'Google login failed.'));
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  // Lock background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isVerified = Boolean(profile.isAadhaarVerified);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/65 backdrop-blur-md animate-fade-in">
        {/* Click outside to close */}
        <div className="fixed inset-0" onClick={onClose} />

        <div className="relative w-full max-w-lg sm:max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col max-h-[90vh] z-10 overflow-hidden my-auto transition-all transform animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200/80 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-slate-50 to-white">
            <div className="flex items-center gap-3">
              {isVerified ? (
                profile.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.fullName}
                    className="w-11 h-11 rounded-2xl object-cover border border-emerald-300 shadow-2xs shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-base border border-emerald-300 shadow-2xs shrink-0">
                    {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'C'}
                  </div>
                )
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-base border border-slate-300 shadow-2xs shrink-0">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
              )}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {isVerified ? profile.fullName : t('profile.guest_title')}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  {isVerified ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-emerald-800">
                        {profile.email || profile.aadhaarNumberMasked || 'Google Verified Citizen'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                      <span>{language === 'hi' ? 'अतिथि नागरिक' : 'Guest Citizen'}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 overscroll-contain">
            {!isVerified ? (
              /* Guest / Logged Out View */
              <div className="space-y-4 py-2">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/80 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      {language === 'hi' ? 'नागरिक खाता लॉगिन' : 'Citizen Account Login'}
                    </h4>
                    <p className="text-xs text-emerald-800/90 mt-1 leading-relaxed">
                      {language === 'hi'
                        ? 'सरकारी योजनाओं, छात्रवृत्तियों व अवसरों की सटीक गणना हेतु Google से लॉगिन करें।'
                        : 'Login with Google to unlock personalized eligibility matching and document alerts.'}
                    </p>
                  </div>
                  {googleLoginError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span className="font-semibold leading-relaxed">{googleLoginError}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={handleDirectGoogleLogin}
                      disabled={isGoogleLoggingIn}
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 shadow-md shadow-emerald-700/20 active:scale-95 disabled:opacity-60 cursor-pointer"
                    >
                      {isGoogleLoggingIn ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                      ) : (
                        <svg className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                      )}
                      <span>
                        {isGoogleLoggingIn
                          ? (language === 'hi' ? 'Google खाता सूची खुल रही है...' : 'Opening Google account list...')
                          : (language === 'hi' ? 'Google से लॉगिन करें (Login with Google)' : 'Login with Google')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Public Citizen Benefits Info */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                  <h5 className="font-bold text-slate-800">
                    {language === 'hi' ? 'लॉगिन करने के फायदे:' : 'Benefits of Logging In:'}
                  </h5>
                  <ul className="space-y-1.5 text-slate-600 text-[11px]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'hi' ? 'उम्र और योग्यता के अनुसार सटीक फॉर्म मिलान' : 'Age & qualification matched opportunities'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'hi' ? 'सीधे आधिकारिक पोर्टल्स के डायरेक्ट आवेदन लिंक्स' : 'Direct official portal application links'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'hi' ? 'आपकी आयु व पात्रता के अनुसार सटीक योजनाएं' : 'Direct eligibility calculation matched for you'}</span>
                    </li>
                  </ul>
                </div>

              </div>
            ) : (
              /* Logged In / Verified Citizen View */
              <>
                {/* 1. Official Verified Citizen Digital Identity Card */}
                <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-5 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden space-y-4">
                  {/* Subtle Glow */}
                  <div className="absolute -top-10 -right-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* ID Card Top Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase text-emerald-300">
                        {language === 'hi' ? 'नागरिक डिजिटल पहचान पत्र' : 'CITIZEN DIGITAL ID'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-200/90 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/30">
                      {profile.id ? profile.id.toUpperCase().replace('CIT-', 'IN-CIT-') : 'IN-CIT-8921'}
                    </span>
                  </div>

                  {/* Real Registered Attributes Grid (Clean Badges, Real Base Details) */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {/* Role / Occupation */}
                    <div className="col-span-2 bg-white/5 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                        {language === 'hi' ? 'पंजीकृत कार्यक्षेत्र / पेशा (Role)' : 'Registered Role / Occupation'}
                      </span>
                      <span className="text-emerald-300 font-black text-sm mt-1 block">
                        {getRoleLabel(profile.lifePhase, language)}
                      </span>
                    </div>

                    {/* Age */}
                    <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                        {language === 'hi' ? 'आयु (Age)' : 'Age'}
                      </span>
                      <span className="text-white font-black text-sm mt-0.5 block">
                        {profile.age || 21} {language === 'hi' ? 'वर्ष' : 'Years'}
                      </span>
                    </div>

                    {/* Caste Category */}
                    <div className="bg-white/5 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                        {language === 'hi' ? 'सामाजिक वर्ग (Category)' : 'Category'}
                      </span>
                      <span className="text-white font-black text-sm mt-0.5 block">
                        {profile.casteCategory || 'General'}
                      </span>
                    </div>

                    {/* Resident State */}
                    <div className="col-span-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10">
                      <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
                        {language === 'hi' ? 'गृह राज्य (State)' : 'State'}
                      </span>
                      <span className="text-white font-black text-sm mt-0.5 block truncate">
                        {profile.state || 'Uttar Pradesh'}
                      </span>
                    </div>
                  </div>

                  {/* ID Card Footer: Locked Official Identity Status */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                      <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{language === 'hi' ? 'पंजीकृत विवरण सुरक्षित (Locked)' : 'Registered Details Locked'}</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {language === 'hi' ? 'स्थायी पहचान' : 'Permanent ID'}
                    </span>
                  </div>
                </div>

                {/* 2. Notification Preferences */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <span>{t('profile.direct_alerts')}</span>
                  </h4>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{t('settings.whatsapp_alerts')}</p>
                          <p className="text-[11px] text-slate-500">+91 {profile.phoneNumber || 'XXXXXXXXXX'}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.notificationsEnabled?.whatsApp ?? true}
                        onChange={(e) =>
                          onUpdateProfile({
                            notificationsEnabled: {
                              ...profile.notificationsEnabled,
                              whatsApp: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{t('settings.push_alerts')}</p>
                          <p className="text-[11px] text-slate-500">{t('settings.push_subtext')}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profile.notificationsEnabled?.webPush ?? true}
                        onChange={(e) =>
                          onUpdateProfile({
                            notificationsEnabled: {
                              ...profile.notificationsEnabled,
                              webPush: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                    </label>
                  </div>
                </div>

                {/* 5. Account Security & Log Out Section */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>{language === 'hi' ? 'सत्र एवं सुरक्षा' : 'Session & Security'}</span>
                    </h4>
                  </div>

                  {showLogoutConfirm ? (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3 animate-fade-in">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-red-950">
                            {t('profile.logout_confirm_title')}
                          </h4>
                          <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed">
                            {t('profile.logout_confirm_desc')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            setShowLogoutConfirm(false);
                            onLogout?.();
                            onClose();
                          }}
                          className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('profile.logout_confirm_yes')}</span>
                        </button>
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer"
                        >
                          {t('profile.logout_cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>{t('profile.logout_btn')}</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/90 flex items-center justify-between rounded-b-3xl">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{t('profile.encrypted_data')}</span>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {t('drawer.close')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
