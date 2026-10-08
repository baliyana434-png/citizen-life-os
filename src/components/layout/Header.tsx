'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Landmark, Search, PhoneCall, Star, User, Globe, LogIn, UserPlus, ShieldCheck, LogOut, GraduationCap, X, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry } from '@/context/CountryContext';
import { CitizenProfile, SupportedLanguage } from '@/types';

interface HeaderProps {
  profile: CitizenProfile;
  onOpenAuth?: () => void;
  onOpenProfile: () => void;
  onOpenOnboarding?: () => void;
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  favoriteCount?: number;
  onOpenFavorites?: () => void;
  isFavoritesActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenAuth,
  onOpenProfile,
  onOpenOnboarding,
  onLogout,
  searchQuery = '',
  onSearchChange,
  favoriteCount = 0,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const { country, countryMeta } = useCountry();
  const [liveFavCount, setLiveFavCount] = useState<number>(favoriteCount);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      try {
        const saved = localStorage.getItem('citizen_favorites');
        if (saved) {
          setLiveFavCount(JSON.parse(saved).length);
        } else {
          setLiveFavCount(0);
        }
      } catch (e) {
        setLiveFavCount(0);
      }
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('favorites_updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('favorites_updated', updateCount);
    };
  }, [favoriteCount]);

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all relative">
      {/* Mobile Full-Width Search Bar Overlay (Covers Header completely for effortless typing) */}
      {isMobileSearchOpen && (
        <div className="absolute inset-0 bg-white px-3 flex items-center gap-2 z-50 sm:hidden animate-in fade-in duration-100">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shrink-0 transition-all"
          >
            {language === 'hi' ? 'ठीक है' : 'Done'}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          
          {/* 1. App Identity */}
          <div className="flex items-center gap-2.5 min-w-max">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-xs">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-lg">
                  {t('app_name')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden lg:block">
                {t('app_tagline')}
              </p>
            </div>
          </div>

          {/* 2. Instant Search Bar (Desktop: inline full search; Mobile: comfortable tap-to-expand) */}
          <div className="hidden sm:block flex-1 sm:max-w-xs md:max-w-md mx-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-slate-900 placeholder-slate-400 rounded-full border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile search trigger */}
          <div className="sm:hidden flex-1 min-w-[70px] max-w-[130px] mx-1">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(true)}
              className="w-full h-8 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 flex items-center gap-1.5 text-left text-slate-500 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[11px] truncate flex-1 text-slate-700 font-medium">
                {searchQuery || t('search_placeholder')}
              </span>
            </button>
          </div>

          {/* 3. Action Hub (Responsive Gaps, Clean Alignment, Zero Overflow) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

            {/* Language Switcher Dropdown - Hidden on mobile, accessible in drawer */}
            <div className="relative hidden md:inline-flex shrink-0">
              <button
                onClick={() => {
                  setIsLangMenuOpen(!isLangMenuOpen);
                }}
                className="h-9 inline-flex items-center gap-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-800 transition-all cursor-pointer shrink-0"
                title={t('settings.language_label')}
              >
                <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-[11px] uppercase font-mono">{language}</span>
              </button>

              {isLangMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {t('settings.language_label')}
                    </div>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                          language === l.code
                            ? 'bg-emerald-50 text-emerald-950 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{l.label}</span>
                        <span className="text-[10px] uppercase text-slate-400 font-mono">{l.code}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Helpline Navigation Link */}
            <Link
              href="/helpline"
              className="h-8 w-8 sm:h-9 sm:w-auto inline-flex items-center justify-center sm:px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold border border-red-200 transition-all shrink-0"
              title={language === 'hi' ? '24x7 हेल्पलाइन' : '24x7 Helplines'}
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-700 shrink-0" />
              <span className="hidden md:inline ml-1.5">{language === 'hi' ? 'हेल्पलाइन' : 'Helpline'}</span>
            </Link>

            {/* Skills & Video Learning Navigation Link */}
            <Link
              href="/skills"
              className="h-8 w-8 sm:h-9 sm:w-auto inline-flex items-center justify-center sm:px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-xs transition-all shrink-0 shadow-2xs"
              title={language === 'hi' ? 'कौशल सीखें (शीर्ष 3 यूट्यूब वीडियोज)' : 'Skills Hub (Top 3 YouTube Masterclasses)'}
            >
              <GraduationCap className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0" />
              <span className="hidden md:inline ml-1.5">{language === 'hi' ? 'सीखें (Skills)' : 'Skills Hub'}</span>
            </Link>

            {/* Favourites / Saved Navigation Button */}
            <Link
              href="/saved"
              className="h-8 w-8 sm:h-9 sm:w-auto inline-flex items-center justify-center sm:px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs transition-all shrink-0 relative shadow-2xs"
              title={language === 'hi' ? 'सहेजे गए अवसर' : 'Saved Opportunities'}
            >
              <Star className={`w-3.5 h-3.5 ${liveFavCount > 0 ? 'fill-amber-400 text-amber-600' : 'text-amber-600'} shrink-0`} />
              <span className="hidden md:inline ml-1.5">{t('subfilters.favorites').split(' ')[0]}</span>
              {liveFavCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:static sm:ml-1.5 px-1 sm:px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] sm:text-[10px] font-black">
                  {liveFavCount}
                </span>
              )}
            </Link>

            {/* Single Profile / Auth Button */}
            {/* Single Profile Button */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="h-8 sm:h-9 px-1.5 sm:px-3 rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center gap-1.5 sm:gap-2 transition-all focus:ring-2 focus:ring-emerald-500/30 relative overflow-hidden cursor-pointer shrink-0 shadow-2xs"
              aria-label={t('profile_btn')}
            >
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt={profile.fullName} className="w-full h-full object-cover" />
                ) : (
                  profile.fullName ? profile.fullName.charAt(0).toUpperCase() : <User className="w-3 h-3 text-slate-300" />
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold max-w-[80px] truncate">
                {profile.fullName.split(' ')[0]}
              </span>
              {profile.subscription?.status === 'active' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white shrink-0" title="1-Year Active Citizen Pass" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
