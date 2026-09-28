'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star, 
  ArrowLeft, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  PhoneCall, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { getLocalizedOpportunity } from '@/data/localization/opportunityTranslator';
import { INITIAL_OPPORTUNITIES } from '@/data/opportunities';
import { LiveFeedService } from '@/services/liveFeedService';
import { Opportunity } from '@/types';
import { OpportunityCard } from '@/components/cards/OpportunityCard';
import { DetailBottomSheet } from '@/components/drawers/DetailBottomSheet';

export default function SavedPage() {
  const { language, setLanguage, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Combine initial catalog with live-synced crawler circulars
  const ALL_OPPORTUNITIES = useMemo(() => {
    const seen = new Set<string>();
    const list: Opportunity[] = [];
    for (const opp of [...INITIAL_OPPORTUNITIES, ...LiveFeedService.LIVE_INTERNET_CIRCULARS]) {
      if (!seen.has(opp.id)) {
        seen.add(opp.id);
        list.push(opp);
      }
    }
    return list;
  }, []);

  // Read saved IDs from localStorage with safe client mount hydration
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set<string>());

  useEffect(() => {
    try {
      const saved = localStorage.getItem('citizen_favorites');
      if (saved) {
        setFavoriteIds(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.warn('Storage hydration notice in Saved page:', e);
    }
  }, []);

  // Listen to storage and custom favorites_updated events
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const saved = localStorage.getItem('citizen_favorites');
        if (saved) {
          setFavoriteIds(new Set(JSON.parse(saved)));
        } else {
          setFavoriteIds(new Set());
        }
      } catch (e) {
        setFavoriteIds(new Set());
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('favorites_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('favorites_updated', handleStorageUpdate);
    };
  }, []);

  // Filter ONLY opportunities that have been saved by the citizen
  const savedOpportunities = useMemo(() => {
    return ALL_OPPORTUNITIES.filter((opp) => {
      if (!favoriteIds.has(opp.id)) return false;

      // Search query within saved items
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = opp.title.toLowerCase().includes(q) || opp.titleHi.includes(q);
        const matchDesc = opp.description.toLowerCase().includes(q) || opp.descriptionHi.includes(q);
        const matchAuthority = opp.gazette?.issuingAuthority?.toLowerCase().includes(q);
        const matchBenefit = (opp.benefitHeadline?.toLowerCase().includes(q) || opp.benefitHeadlineHi?.includes(q));
        const matchTags = opp.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchAuthority && !matchTags && !matchBenefit) return false;
      }

      return true;
    });
  }, [ALL_OPPORTUNITIES, favoriteIds, searchQuery]);

  // Handle Unstar / Toggle Favorite
  const handleToggleFavorite = (oppId: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      const isAdding = !next.has(oppId);
      if (isAdding) {
        next.add(oppId);
      } else {
        next.delete(oppId);
      }

      try {
        localStorage.setItem('citizen_favorites', JSON.stringify(Array.from(next)));
        window.dispatchEvent(new Event('favorites_updated'));
      } catch (e) {}

      const opp = ALL_OPPORTUNITIES.find((o) => o.id === oppId);
      const title = opp ? (language === 'hi' ? opp.titleHi : opp.title) : '';

      if (isAdding) {
        setToastMessage(
          language === 'hi'
            ? `"${title.slice(0, 40)}..." पसंदीदा में पुनः जोड़ा गया!`
            : `"${title.slice(0, 40)}..." restored to Saved!`
        );
      } else {
        setToastMessage(
          language === 'hi'
            ? `पसंदीदा सूची से हटाया गया।`
            : `Removed from Saved items.`
        );
      }
      setTimeout(() => setToastMessage(null), 3000);

      return next;
    });
  };

  // Clear all saved items with confirmation
  const handleClearAll = () => {
    const confirmMsg = language === 'hi' 
      ? 'क्या आप सभी सुरक्षित किए गए अवसरों को हटाना चाहते हैं?' 
      : 'Are you sure you want to remove all saved opportunities?';
    if (window.confirm(confirmMsg)) {
      try {
        localStorage.setItem('citizen_favorites', JSON.stringify([]));
        window.dispatchEvent(new Event('favorites_updated'));
      } catch (e) {}
      setFavoriteIds(new Set());
      setToastMessage(
        language === 'hi'
          ? 'सभी पसंदीदा अवसर हटा दिए गए।'
          : 'All saved opportunities cleared.'
      );
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // WhatsApp Share (100% localized, zero-leakage, zero fake emojis)
  const handleShareWhatsApp = (opp: Opportunity) => {
    const localized = getLocalizedOpportunity(opp, language);
    const isGovt = opp.category === 'govt_scheme' || opp.category === 'govt_job' || opp.category === 'competitive_exam';
    const tagHeader = isGovt ? `*${t('official_verified')}*` : `*${t('card.verified_source')}*`;
    const text = encodeURIComponent(
      `${tagHeader}\n\n*${localized.title}*\n*${t('card.benefit')}:* ${localized.benefitHeadline}\n*${t('card.verified_source')}:* ${localized.issuingAuthority}\n\n${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* 0. Top Strip */}
      <div className="w-full bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            {language === 'hi' ? 'सत्यापित सुरक्षित अवसर • सिटिजन लाइफ' : 'CITIZEN LIFE OS • SAVED & STARRED OPPORTUNITIES'}
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-400 text-[10px] hidden md:inline">
            {language === 'hi' ? 'आपके चुने हुए सभी फॉर्म व योजनाएं' : 'Your Personal Priority Watchlist'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[10px]">
          <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
            SAVED WATCHLIST
          </span>
        </div>
      </div>

      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Back Button & Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'hi' ? 'मुख्य पृष्ठ' : 'All Opportunities'}</span>
              </Link>
              <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-sm">
                  <Star className="w-5 h-5 fill-slate-950 text-slate-950" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                    {language === 'hi' ? 'पसंदीदा एवं सुरक्षित अवसर' : 'Saved & Starred Opportunities'}
                  </h1>
                  <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
                    {language === 'hi' ? 'आपके द्वारा सुरक्षित किए गए सभी आवेदन, नौकरियां व योजनाएं' : 'Your bookmarked registrations, jobs & schemes'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links & Language */}
            <div className="flex items-center gap-2">
              <Link
                href="/helpline"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 text-xs font-bold border border-red-200 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'हेल्पलाइन' : 'Helplines'}</span>
              </Link>

              {/* 6-Language Switcher */}
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Dynamic Notification Toast */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Saved Items Control Bar (Search & Stats & Clear) */}
        {favoriteIds.size > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-extrabold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>
                  {language === 'hi' 
                    ? `${savedOpportunities.length} अवसर सुरक्षित हैं` 
                    : `${savedOpportunities.length} Saved Opportunities`}
                </span>
              </div>
              <span className="text-xs text-slate-500 hidden md:inline">
                {language === 'hi'
                  ? '• कार्ड पर स्टार दबाकर कभी भी सूची से हटा सकते हैं'
                  : '• Click star icon on any card to remove from saved'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Inside Saved Items */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'hi' ? 'सुरक्षित अवसरों में खोजें...' : 'Search in saved...'}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all"
                />
              </div>

              {/* Clear All Button */}
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-bold border border-slate-200 hover:border-red-300 transition-all shrink-0"
                title={language === 'hi' ? 'सभी सुरक्षित अवसर हटाएं' : 'Clear all saved'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'hi' ? 'सूची साफ करें' : 'Clear All'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Pure Saved Opportunities Grid (NO CATEGORY BOXES, STRICTLY SAVED ONLY) */}
        {savedOpportunities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-amber-200/80 p-8 space-y-4 shadow-sm max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-100 to-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
              <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {language === 'hi' ? 'कोई पसंदीदा फॉर्म या अवसर सुरक्षित नहीं है' : 'No Saved Opportunities Yet'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {language === 'hi'
                  ? 'आपने अभी तक कोई अवसर सेव नहीं किया है। मुख्य पृष्ठ पर किसी भी भर्ती, परीक्षा, इंटर्नशिप या सरकारी योजना के कार्ड पर स्टार (⭐) आइकन दबाएं ताकि वह सीधे यहाँ सुरक्षित हो सके।'
                  : 'You have not saved any opportunities yet. Click the star (⭐) icon on any opportunity card on the homepage to save it here for fast access.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-700/20 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'hi' ? 'सभी अवसर देखें और स्टार करें' : 'Browse All Opportunities'}</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {savedOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onSelect={(opp) => setSelectedOpp(opp)}
                onShareWhatsApp={handleShareWhatsApp}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      {/* 3. Detail Bottom Sheet / Slide-over */}
      <DetailBottomSheet
        opportunity={selectedOpp}
        onClose={() => setSelectedOpp(null)}
        isFavorite={selectedOpp ? favoriteIds.has(selectedOpp.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
