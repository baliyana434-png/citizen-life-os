'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, User, Globe, Search, Sparkles, Landmark, PhoneCall, Star } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { CitizenProfile } from '@/types';

interface HeaderProps {
  profile: CitizenProfile;
  onOpenAuth?: () => void;
  onOpenProfile: () => void;
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
  searchQuery = '',
  onSearchChange,
  favoriteCount = 0,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const [liveFavCount, setLiveFavCount] = useState<number>(favoriteCount);

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

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* 1. App Identity */}
          <div className="flex items-center gap-2.5 min-w-max">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
              <Landmark className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
                  {t('app_name')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                {t('app_tagline')}
              </p>
            </div>
          </div>

          {/* 2. Instant Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder-slate-400 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* 3. Action Hub */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Helpline Navigation Pill */}
            <Link
              href="/helpline"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-900 text-xs font-bold border border-red-200/90 transition-all shadow-2xs"
              title={language === 'hi' ? '२४x७ नागरिक हेल्पलाइन' : '24x7 Helplines'}
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-700 shrink-0" />
              <span>{language === 'hi' ? 'हेल्पलाइन' : 'Helpline'}</span>
            </Link>

            {/* Favourites / Saved Navigation Button */}
            <Link
              href="/saved"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs shadow-2xs transition-all"
              title={language === 'hi' ? 'पसंदीदा फॉर्म व अवसर' : 'Saved Opportunities'}
            >
              <Star className={`w-3.5 h-3.5 ${liveFavCount > 0 ? 'fill-amber-400 text-amber-600' : 'text-amber-600'} shrink-0`} />
              <span>{language === 'hi' ? 'पसंदीदा' : 'Saved'}</span>
              {liveFavCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black">
                  {liveFavCount}
                </span>
              )}
            </Link>

            {/* Language Switcher */}
            <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Profile Avatar Button */}
            <button
              onClick={onOpenProfile}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all focus:ring-2 focus:ring-emerald-500/30 relative overflow-hidden ${
                profile.isAadhaarVerified
                  ? 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-800 font-black text-xs shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
              }`}
              aria-label={t('profile_btn')}
              title={profile.isAadhaarVerified ? profile.fullName : (language === 'hi' ? 'नागरिक प्रोफाइल / लॉगिन' : 'Citizen Profile / Login')}
            >
              {profile.isAadhaarVerified ? (
                profile.photoURL ? (
                  <img src={profile.photoURL} alt={profile.fullName} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <>
                    <span>{profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'C'}</span>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </>
                )
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
