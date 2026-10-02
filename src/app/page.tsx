'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LifeStageTabs } from '@/components/layout/LifeStageTabs';
import { OpportunityCard } from '@/components/cards/OpportunityCard';
import { DetailBottomSheet } from '@/components/drawers/DetailBottomSheet';
import { AuthModal, AuthScreen } from '@/components/auth/AuthModal';
import { UserProfileDrawer } from '@/components/profile/UserProfileDrawer';
import { CitizenOnboardingModal } from '@/components/auth/CitizenOnboardingModal';
import { GoogleAccountChooserModal } from '@/components/auth/GoogleAccountChooserModal';
import { SubscriptionModal } from '@/components/subscription/SubscriptionModal';
import { GoogleAuthService } from '@/services/googleAuth';
import { INITIAL_OPPORTUNITIES } from '@/data/opportunities';
import { getLocalizedOpportunity } from '@/data/localization/opportunityTranslator';
import { CitizenProfile, FamilyMember, LifeStage, Opportunity, CountryCode, CitizenSubscription } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry } from '@/context/CountryContext';
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Star,
  Award,
  Lock,
} from 'lucide-react';

const DEFAULT_PROFILE: CitizenProfile = {
  id: 'cit-101',
  fullName: 'Abhay Kumar',
  phoneNumber: '9876543210',
  aadhaarNumberMasked: 'XXXX-XXXX-8921',
  isAadhaarVerified: true,
  isOnboarded: false,
  age: 21,
  dob: '2003-08-14',
  gender: 'male',
  state: 'Uttar Pradesh',
  district: 'Kanpur Nagar',
  pincode: '208001',
  lifePhase: 'college_student',
  casteCategory: 'OBC',
  familyIncomeAnnual: 180000,
  educationLevel: '12th_pass',
  activeGoal: 'Complete Degree & Get Verified Job / Free Device',
  notificationsEnabled: {
    webPush: true,
    whatsApp: true,
    urgentDeadlinesOnly: false,
  },
};

const GUEST_PROFILE: CitizenProfile = {
  id: 'cit-guest',
  fullName: 'Guest Citizen',
  phoneNumber: '',
  aadhaarNumberMasked: '',
  isAadhaarVerified: false,
  isOnboarded: false,
  age: 21,
  dob: '2003-01-01',
  gender: 'male',
  state: '',
  district: '',
  pincode: '',
  lifePhase: 'college_student',
  casteCategory: 'General',
  familyIncomeAnnual: 0,
  educationLevel: '12th_pass',
  activeGoal: 'Browse Verified Opportunities',
  notificationsEnabled: {
    webPush: false,
    whatsApp: false,
    urgentDeadlinesOnly: false,
  },
};


const GOVT_CATEGORIES = new Set([
  'govt_scheme',
  'govt_job',
  'competitive_exam',
  'scholarship',
  'healthcare_free',
]);

export default function HomePage() {
  const { t, language } = useTranslation();
  const { country, setCountry, countryMeta } = useCountry();

  // Master Citizen Account Profile (Individual citizen)
  const [profile, setProfile] = useState<CitizenProfile>(GUEST_PROFILE);
  const activeProfile = profile;

  const [activeTab, setActiveTab] = useState<LifeStage>('exams');
  const [activeSubFilter, setActiveSubFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authModalScreen, setAuthModalScreen] = useState<AuthScreen>('login');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState<boolean>(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState<boolean>(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{
    name: string;
    email: string;
    photoURL?: string;
  } | null>(null);

  const [paymentSuccessToast, setPaymentSuccessToast] = useState<string | null>(null);

  // Auto-switch tab based on citizen role
  const handleRoleAutoSwitch = (role: string) => {
    if (role === 'farmer' || role === 'homemaker') {
      setActiveTab('schemes');
    } else if (role === 'senior_citizen') {
      setActiveTab('health');
    } else if (role === 'school_student') {
      setActiveTab('education');
    } else if (role === 'college_student') {
      setActiveTab('internships');
    } else if (role === 'exam_aspirant') {
      setActiveTab('exams');
    } else if (role === 'job_seeker') {
      setActiveTab('private_jobs');
    } else if (role === 'business_owner') {
      setActiveTab('startups');
    } else if (role === 'employed') {
      setActiveTab('career');
    }
  };

  // User Starred / Favorite Opportunities State
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set<string>());

  // Safe client mount hydration for master profile & favorite IDs
  useEffect(() => {
    try {
      const isLoggedOut = localStorage.getItem('citizen_logged_out');
      if (isLoggedOut === 'true') {
        setProfile(GUEST_PROFILE);
      } else {
        const saved = localStorage.getItem('citizen_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfile(parsed);
          if (parsed.country) {
            setCountry(parsed.country);
          }
          if (parsed.lifePhase) {
            handleRoleAutoSwitch(parsed.lifePhase);
          }

          // If logged-in user hasn't completed onboarding wizard, ask them for their real details now!
          if (parsed.isAadhaarVerified && !parsed.isOnboarded) {
            setPendingGoogleUser({
              name: parsed.fullName || 'Citizen',
              email: parsed.email || '',
              photoURL: parsed.photoURL,
            });
            setIsOnboardingOpen(true);
          }
        } else {
          setProfile(GUEST_PROFILE);
        }
      }

      const savedFavs = localStorage.getItem('citizen_favorites');
      if (savedFavs) {
        setFavoriteIds(new Set(JSON.parse(savedFavs)));
      }
    } catch (e) {
      console.warn('Storage hydration notice:', e);
    }
  }, []);

  // Listen to cross-tab & custom storage events
  useEffect(() => {
    const handleFavUpdate = () => {
      try {
        const savedFavs = localStorage.getItem('citizen_favorites');
        if (savedFavs) {
          setFavoriteIds(new Set(JSON.parse(savedFavs)));
        } else {
          setFavoriteIds(new Set());
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleFavUpdate);
    window.addEventListener('favorites_updated', handleFavUpdate);
    return () => {
      window.removeEventListener('storage', handleFavUpdate);
      window.removeEventListener('favorites_updated', handleFavUpdate);
    };
  }, []);

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

      const opp = opportunities.find((o) => o.id === oppId);
      const title = opp ? (language === 'hi' ? opp.titleHi : opp.title) : '';
      if (isAdding) {
        setPaymentSuccessToast(
          language === 'hi'
            ? `"${title.slice(0, 45)}..." सहेजे गए अवसरों में जोड़ दिया गया।`
            : `"${title.slice(0, 45)}..." saved to your list.`
        );
      } else {
        setPaymentSuccessToast(
          language === 'hi'
            ? `सहेजे गए अवसरों से हटाया गया।`
            : `Removed from saved list.`
        );
      }
      setTimeout(() => setPaymentSuccessToast(null), 3500);

      return next;
    });
  };

  // Handle Logout System
  const handleLogout = async () => {
    try {
      await GoogleAuthService.signOut();
    } catch (e) {
      console.warn('Firebase signout notice:', e);
    }
    try {
      localStorage.setItem('citizen_logged_out', 'true');
      localStorage.removeItem('citizen_profile');
      localStorage.removeItem('citizen_favorites');
      window.dispatchEvent(new Event('favorites_updated'));
    } catch (e) {}
    setPendingGoogleUser(null);
    setProfile(GUEST_PROFILE);
    setFavoriteIds(new Set());
    setIsProfileOpen(false);
    setIsOnboardingOpen(false);
    setPaymentSuccessToast(
      language === 'hi'
        ? 'सफलतापूर्वक लॉग आउट हो गया। आप अतिथि मोड में हैं।'
        : 'Logged out successfully. You are now in guest mode.'
    );
    setTimeout(() => setPaymentSuccessToast(null), 4000);
  };

  // Sync profile and favorites from Server Database
  useEffect(() => {
    const phone = profile.phoneNumber;
    const email = profile.email;
    if (!profile.isAadhaarVerified || (!phone && !email)) return;

    const query = phone ? `phone=${phone}` : `email=${encodeURIComponent(email || '')}`;
    fetch(`/api/citizens/profile?${query}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (Array.isArray(d.favorites) && d.favorites.length > 0) {
            setFavoriteIds(new Set(d.favorites));
            try {
              localStorage.setItem('citizen_favorites', JSON.stringify(d.favorites));
            } catch (e) {}
          }
        }
      })
      .catch((err) => console.warn('Server profile sync warning:', err));
  }, [profile.phoneNumber, profile.email, profile.isAadhaarVerified]);

  // Handle Verification & Login Complete
  const handleVerificationComplete = (updated: Partial<CitizenProfile>) => {
    let calculatedAge = updated.age || profile.age;
    if (updated.dob && !updated.age) {
      const birthYear = new Date(updated.dob).getFullYear();
      if (!isNaN(birthYear)) {
        calculatedAge = Math.max(1, new Date().getFullYear() - birthYear);
      }
    }

    const newProfile: CitizenProfile = {
      ...DEFAULT_PROFILE,
      ...profile,
      ...updated,
      age: calculatedAge,
      isAadhaarVerified: true,
    };
    try {
      localStorage.removeItem('citizen_logged_out');
      localStorage.setItem('citizen_profile', JSON.stringify(newProfile));
    } catch (e) {}
    setProfile(newProfile);

    setPaymentSuccessToast(
      language === 'hi'
        ? `स्वागत है ${updated.fullName || newProfile.fullName}! आपका प्रोफाइल सफलतापूर्वक सत्यापित हो गया है।`
        : `Welcome ${updated.fullName || newProfile.fullName}! Profile verified successfully.`
    );
    setTimeout(() => setPaymentSuccessToast(null), 4000);
  };

  // Direct Google Sign-In Success: Check onboarding state or launch Wizard
  const handleGoogleAuthSuccess = async (googleUser: { name: string; email: string; photoURL?: string }) => {
    setIsGoogleChooserOpen(false);
    try {
      // Check if this user already registered & completed onboarding previously on server
      const res = await fetch(`/api/citizens/profile?email=${encodeURIComponent(googleUser.email)}`);
      const data = await res.json();
      if (data.success && data.citizen && data.citizen.isOnboarded) {
        // Returning user with completed onboarding! Restore their profile directly
        handleVerificationComplete(data.citizen);
        if (data.citizen.country) {
          setCountry(data.citizen.country);
        }
        if (data.citizen.lifePhase) {
          handleRoleAutoSwitch(data.citizen.lifePhase);
        }
        return;
      }
    } catch (e) {
      console.warn('Profile fetch check warning:', e);
    }

    // New user or incomplete onboarding: Launch the Onboarding Wizard to take role, age, category, state!
    setPendingGoogleUser(googleUser);
    setIsOnboardingOpen(true);
  };

  // Complete Onboarding: Save Role, Age, Category, State, Country and Unlock Opportunities
  const handleOnboardingComplete = (completed: {
    fullName: string;
    email: string;
    photoURL?: string;
    lifePhase: CitizenProfile['lifePhase'];
    age: number;
    dob?: string;
    casteCategory: CitizenProfile['casteCategory'];
    state: string;
    gender: CitizenProfile['gender'];
    country?: CountryCode;
    nationalIdName?: string;
    nationalIdMasked?: string;
    administrativeDivision?: string;
  }) => {
    setIsOnboardingOpen(false);

    if (completed.country) {
      setCountry(completed.country);
    }

    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const citizenIdGenerated = completed.nationalIdMasked || `${countryMeta.alpha3 || country}-CIT-2026-${randomSeq}`;

    const fullProfile: CitizenProfile = {
      ...profile,
      id: profile.id && profile.id !== 'cit-guest' ? profile.id : 'cit-' + Date.now(),
      fullName: completed.fullName,
      email: completed.email,
      photoURL: completed.photoURL,
      lifePhase: completed.lifePhase,
      age: completed.age,
      dob: completed.dob,
      casteCategory: completed.casteCategory,
      state: completed.state,
      gender: completed.gender,
      country: completed.country || country,
      nationalIdName: completed.nationalIdName,
      nationalIdMasked: citizenIdGenerated,
      administrativeDivision: completed.administrativeDivision || completed.state,
      isAadhaarVerified: true,
      isOnboarded: true,
    };

    try {
      localStorage.removeItem('citizen_logged_out');
      localStorage.setItem('citizen_profile', JSON.stringify(fullProfile));
    } catch (e) {}

    setProfile(fullProfile);

    // Sync to server persistent database
    fetch('/api/citizens/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullProfile),
    }).catch((e) => console.warn('Server sync error:', e));

    // Automatically switch active opportunity tab to match the citizen's role!
    handleRoleAutoSwitch(completed.lifePhase);

    // Prompt 1-Year Subscription Modal immediately after ID generation if not yet active
    if (!fullProfile.subscription || fullProfile.subscription.status !== 'active') {
      setIsSubscriptionOpen(true);
    } else {
      setPaymentSuccessToast(
        language === 'hi'
          ? `स्वागत है ${completed.fullName}! आपका नागरिक प्रोफाइल सेट हो गया है और अवसर अनलॉक हो गए हैं।`
          : `Welcome ${completed.fullName}! Your citizen profile is ready and opportunities are unlocked!`
      );
      setTimeout(() => setPaymentSuccessToast(null), 5000);
    }
  };

  // Handle ₹19 1-Year Subscription Success
  const handleSubscriptionSuccess = (sub: CitizenSubscription) => {
    setIsSubscriptionOpen(false);
    const updatedProfile: CitizenProfile = {
      ...profile,
      subscription: sub,
    };

    try {
      localStorage.setItem('citizen_profile', JSON.stringify(updatedProfile));
    } catch (e) {}
    setProfile(updatedProfile);

    fetch('/api/citizens/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProfile),
    }).catch((e) => console.warn('Server sync error:', e));

    setPaymentSuccessToast(
      language === 'hi'
        ? `बधाई हो ${updatedProfile.fullName}! आपका ₹19 का 1-वर्षीय राष्ट्रीय नागरिक पास सक्रिय हो गया है (वैधता: 365 दिन)।`
        : `Congratulations ${updatedProfile.fullName}! Your ₹19 1-Year National Citizen Pass is now active (365 Days).`
    );
    setTimeout(() => setPaymentSuccessToast(null), 6000);
  };

  // Live Internet Sync State
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Live (Auto-Sync)');

  // Live Internet Background Crawler & Sync
  const fetchLiveSync = async (targetCountry?: string) => {
    try {
      setIsSyncing(true);
      const activeCountryCode = targetCountry || country;
      const res = await fetch(`/api/live-sync?country=${encodeURIComponent(activeCountryCode)}`);
      if (!res.ok) throw new Error('Live sync failed');
      const data = await res.json();
      if (data.newOpportunities && data.newOpportunities.length > 0) {
        setOpportunities((prev) => {
          const existingIds = new Set(prev.map((o) => o.id));
          const toAdd = data.newOpportunities.filter((o: Opportunity) => !existingIds.has(o.id));
          if (toAdd.length === 0) return prev;
          return [...toAdd, ...prev];
        });
      }
      if (data.lastSyncedAt) {
        setLastSyncedTime(data.lastSyncedAt);
      }
    } catch (err) {
      console.warn('Live Internet Auto-Sync notice:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLiveSync(country);
    // Auto-poll live internet feeds every 60 seconds
    const interval = setInterval(() => fetchLiveSync(country), 60000);
    return () => clearInterval(interval);
  }, [country]);

  // Filtered and Scored Opportunities
  const filteredOpportunities = useMemo(() => {
    const seen = new Set<string>();

    return opportunities.filter((opp) => {
      // 0. Deduplicate identical opportunities
      const key = opp.id;
      if (seen.has(key)) return false;
      seen.add(key);

      // 1. Life Stage Tab Match
      if (opp.lifeStage !== activeTab) return false;

      // 1B. Strict Country Matching (Show ONLY opportunities for the user's registered country, with exception for study abroad)
      const isStudyAbroad = opp.lifeStage === 'abroad_jobs' || opp.category === 'study_abroad';
      if (!isStudyAbroad && opp.country !== country) {
        return false;
      }

      // 2. MANDATORY Strict Age & Eligibility Filter (Only show opportunities matching citizen's age when onboarded)
      if (activeProfile.isOnboarded && opp.targetAges) {
        const [minAge, maxAge] = opp.targetAges;
        if (activeProfile.age < minAge || activeProfile.age > maxAge) return false;
      }

      // 2B. Strict Gender Isolation (Never show gender-restricted opportunities to other genders when onboarded)
      if (activeProfile.isOnboarded && opp.genderEligibility && opp.genderEligibility !== 'all') {
        if (!activeProfile.gender || opp.genderEligibility !== activeProfile.gender) return false;
      }

      // 2C. Strict Area / State / Region Filter
      if (activeProfile.isOnboarded && opp.stateEligibility && !opp.stateEligibility.includes('ALL')) {
        const userDivision = activeProfile.administrativeDivision || activeProfile.state;
        if (userDivision && !opp.stateEligibility.includes(userDivision)) return false;
      }

      // 3. Search Query Match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = opp.title.toLowerCase().includes(q) || opp.titleHi.includes(q);
        const matchDesc = opp.description.toLowerCase().includes(q) || opp.descriptionHi.includes(q);
        const matchTags = opp.tags.some((t) => t.toLowerCase().includes(q));
        const matchAuthority = opp.gazette?.issuingAuthority?.toLowerCase().includes(q);
        const matchBenefit = (opp.benefitHeadline?.toLowerCase().includes(q) || opp.benefitHeadlineHi?.includes(q));
        if (!matchTitle && !matchDesc && !matchTags && !matchAuthority && !matchBenefit) return false;
      }

      // 4. Sub-filter Match
      if (activeSubFilter === 'new' && !opp.isNew) return false;
      if (activeSubFilter === 'upcoming' && opp.applicationStatus !== 'upcoming') return false;
      if (activeSubFilter === 'active_now' && opp.applicationStatus !== 'active_now') return false;
      if (activeSubFilter === 'free_only' && !opp.is100PercentFree) return false;
      if (activeSubFilter === 'govt_only' && !GOVT_CATEGORIES.has(opp.category)) return false;
      if (activeSubFilter === 'high_value' && (!opp.benefitAmount || opp.benefitAmount < 15000)) return false;

      return true;
    }).sort((a, b) => {
      // Series-Wise Priority 1: All "NEW" opportunities strictly positioned at the VERY TOP
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;

      // Priority 2: Active registration forms currently open for citizen application
      const statusWeight = { active_now: 1, ongoing: 2, upcoming: 3 };
      const weightA = statusWeight[a.applicationStatus || 'ongoing'] || 2;
      const weightB = statusWeight[b.applicationStatus || 'ongoing'] || 2;
      if (weightA !== weightB) {
        return weightA - weightB;
      }

      // Priority 3: Higher benefit value first
      return (b.benefitAmount || 0) - (a.benefitAmount || 0);
    });
  }, [activeTab, activeSubFilter, searchQuery, activeProfile.age, activeProfile.gender, activeProfile.state, activeProfile.administrativeDivision, opportunities, favoriteIds, country]);

  // Total Available Benefit Amount
  const totalBenefitSum = useMemo(() => {
    return filteredOpportunities.reduce((acc, curr) => acc + (curr.benefitAmount || 0), 0);
  }, [filteredOpportunities]);

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
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* 1. Header */}
      <Header
        profile={profile}
        onOpenAuth={() => {
          setAuthModalScreen('login');
          setIsAuthOpen(true);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenOnboarding={() => {
          setPendingGoogleUser(null);
          setIsOnboardingOpen(true);
        }}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoriteCount={favoriteIds.size}
      />

      {/* 2. Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 relative z-10">
        {/* Dynamic Payment/Success Toast */}
        {paymentSuccessToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span>{paymentSuccessToast}</span>
            </div>
            <button
              onClick={() => setPaymentSuccessToast(null)}
              className="text-emerald-200 hover:text-white text-xs underline"
            >
              {t('drawer.close')}
            </button>
          </div>
        )}

        {/* Hero Personalized Insight Bar (3D Cyber-Gov Terminal) */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden border border-emerald-500/30">
          {/* Subtle Cyber Grid Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              {/* Telemetry Status Row */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 radar-pulse" />
                  {activeProfile.isOnboarded ? (
                    `${countryMeta.flag} ${countryMeta.alpha3 || country} • ${activeProfile.fullName} (${t('hero.age_label')}: ${activeProfile.age} ${t('hero.years_suffix')}${activeProfile.state ? ' • ' + activeProfile.state : ''})`
                  ) : (
                    `${countryMeta.flag} ${countryMeta.alpha3 || country} • ${countryMeta.name} • ${t('hero.unverified_status')}`
                  )}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-emerald-300/80 font-mono font-bold bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  {activeProfile.isAadhaarVerified ? t('hero.verified_status') : t('hero.unverified_status')}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug">
                {t('hero.headline_prefix')}{' '}
                <span className="text-emerald-400 font-mono underline decoration-emerald-500/40 decoration-wavy underline-offset-4">
                  {countryMeta.currencySymbol}
                  {totalBenefitSum.toLocaleString()}
                </span>{' '}
                {t('hero.headline_suffix')}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {t('hero.subline')}
              </p>
            </div>

            {/* Individual Profile Summary Badge */}
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shrink-0 shadow-lg">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                {activeProfile.isOnboarded && profile.fullName ? profile.fullName.charAt(0).toUpperCase() : countryMeta.flag}
              </div>
              <div className="text-left">
                <span className="block text-xs sm:text-sm font-extrabold text-white leading-tight">
                  {activeProfile.isOnboarded ? profile.fullName : t('profile.guest_title')}
                </span>
                <span className="text-[11px] text-emerald-300 font-medium">
                  {activeProfile.isOnboarded
                    ? `${profile.lifePhase ? t(`roles.${profile.lifePhase}`) : t('roles.college_student')} • ${profile.casteCategory || 'General'}`
                    : `${countryMeta.name} • ${t('hero.unverified_status')}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1-Year Citizen Access Pass Status Strip */}
        {profile.subscription?.status === 'active' ? (
          <div className="bg-emerald-950 text-white rounded-2xl px-4 py-2.5 border border-emerald-700/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base">{countryMeta.flag}</span>
              <span className="font-mono font-bold text-emerald-300 uppercase px-1.5 py-0.5 rounded bg-emerald-900/60 border border-emerald-700">
                {countryMeta.alpha3 || country} CITIZEN PASS
              </span>
              <span className="font-semibold text-emerald-100">
                {language === 'hi'
                  ? `1-वर्षीय सक्रिय सदस्यता (वैधता: ${profile.subscription.validUntil}) • कुल अनलॉक लाभ: ₹${totalBenefitSum.toLocaleString('en-IN')}`
                  : `1-Year Citizen Pass Active (Valid: ${profile.subscription.validUntil}) • Total Unlocked Benefits: ${countryMeta.currencySymbol}${totalBenefitSum.toLocaleString()}`}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-black/20 px-2 py-0.5 rounded-md">
              {profile.subscription.transactionId}
            </span>
          </div>
        ) : (
          <div className="bg-slate-900 text-white rounded-2xl px-4 py-3 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-white block">
                    {language === 'hi' ? '1-वर्षीय राष्ट्रीय नागरिक पास • केवल ₹19 / 1 वर्ष' : '1-Year National Citizen Access Pass • Only ₹19 / 1 Year'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-600/50 shrink-0">
                    {language === 'hi' ? `₹${totalBenefitSum.toLocaleString('en-IN')} के लाभ अनलॉक करें` : `Unlock ${countryMeta.currencySymbol}${totalBenefitSum.toLocaleString()} Benefits`}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {language === 'hi' 
                    ? `${countryMeta.name} में अपनी आयु (${profile.age || '18+'}), क्षेत्र एवं श्रेणी अनुसार सभी वास्तविक अवसर 365 दिनों हेतु अनलॉक करें`
                    : `Unlock all genuine opportunities in ${countryMeta.name} matched to your exact age & area for 365 days`}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!profile.isOnboarded) {
                  setIsGoogleChooserOpen(true);
                } else {
                  setIsSubscriptionOpen(true);
                }
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पास सक्रिय करें (₹19)' : 'Activate Pass (₹19)'}</span>
            </button>
          </div>
        )}

        {/* 2. Official Feed Synchronization Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/95 text-white rounded-2xl border border-slate-800 shadow-md text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {language === 'hi' ? `नवीनतम अपडेट: ${lastSyncedTime}` : `Last feed update: ${lastSyncedTime}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden md:inline">
              {opportunities.length} {language === 'hi' ? 'सत्यापित अवसर लाइव' : 'Opportunities Live'}
            </span>
            <button
              onClick={() => fetchLiveSync(country)}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 text-xs cursor-pointer"
              title="Sync Feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>
                {isSyncing
                  ? (language === 'hi' ? 'जांच जारी है...' : 'Syncing...')
                  : (language === 'hi' ? 'अद्यतन करें' : 'Sync Feed')}
              </span>
            </button>
          </div>
        </div>

        {/* Life Stage Tabs and Sub-filters */}
        <LifeStageTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeSubFilter={activeSubFilter}
          onSubFilterChange={setActiveSubFilter}
          totalCount={filteredOpportunities.length}
        />

        {/* Opportunity Card Grid */}
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">{t('empty.title')}</h3>
            <p className="text-xs text-slate-500">
              {t('empty.desc')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onSelect={(opp) => setSelectedOpp(opp)}
                citizenProfile={activeProfile}
                isFavorite={favoriteIds.has(opp.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      {/* Portal Footer */}
      <Footer />

      {/* 3. Detail Bottom Sheet / Slide-over */}
      <DetailBottomSheet
        opportunity={selectedOpp}
        onClose={() => setSelectedOpp(null)}
        citizenProfile={activeProfile}
        isFavorite={selectedOpp ? favoriteIds.has(selectedOpp.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* 4. Unified 3-Screen Auth Modal (Login, Signup, Forgot Password with Google OAuth) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialScreen={authModalScreen}
        onLoginSuccess={handleVerificationComplete}
        onGoogleSuccess={handleGoogleAuthSuccess}
      />

      {/* 5. User Profile & Settings Drawer */}
      <UserProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        totalBenefitsUnlocked={totalBenefitSum}
        onUpdateProfile={(updated) => {
          setProfile((prev) => {
            const next = { ...prev, ...updated };
            try {
              localStorage.setItem('citizen_profile', JSON.stringify(next));
            } catch (e) {}
            return next;
          });

          // Auto-adjust active tab if lifePhase changed
          if (updated.lifePhase) {
            handleRoleAutoSwitch(updated.lifePhase);
          }
        }}
        onLogout={handleLogout}
        onOpenAuth={() => {
          setIsProfileOpen(false);
          setAuthModalScreen('login');
          setIsAuthOpen(true);
        }}
        onOpenOnboarding={() => {
          setPendingGoogleUser(null);
          setIsOnboardingOpen(true);
        }}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onLoginSuccess={handleVerificationComplete}
        onGoogleSuccess={handleGoogleAuthSuccess}
      />

      {/* 6. Google Account Chooser Modal */}
      <GoogleAccountChooserModal
        isOpen={isGoogleChooserOpen}
        onClose={() => setIsGoogleChooserOpen(false)}
        onSelectAccount={handleGoogleAuthSuccess}
      />

      {/* 7. Registration Onboarding & Role Selection Modal */}
      <CitizenOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        googleUser={pendingGoogleUser}
        initialRole={profile.lifePhase}
        onComplete={handleOnboardingComplete}
        onSwitchToSignIn={() => {
          setIsOnboardingOpen(false);
          setIsProfileOpen(true);
        }}
      />

      {/* 8. 1-Year Citizen Access Subscription Modal (₹19 / Year) */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        citizenName={profile.fullName || 'Citizen'}
        citizenId={profile.nationalIdMasked || `${countryMeta.alpha3 || country}-CIT-8921`}
        onSubscriptionSuccess={handleSubscriptionSuccess}
      />
    </div>
  );
}
