'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Play,
  Star,
  CheckCircle2,
  ExternalLink,
  Clock,
  Award,
  Sparkles,
  TrendingUp,
  X,
  Laptop,
  Landmark,
  Video,
  IndianRupee,
  Wrench,
  HeartPulse,
  Compass,
  Globe,
  Camera,
  Layers,
  ChevronRight,
  Filter,
  Flame
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useCountry } from '@/context/CountryContext';
import { SKILL_SECTORS, SKILL_TOPICS, SkillSector, SkillTopic, SkillVideo } from '@/data/skillsData';

export default function SkillsPage() {
  const { language } = useTranslation();
  const { country, countryMeta } = useCountry();
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');
  const [onlyHighDemand, setOnlyHighDemand] = useState<boolean>(false);
  
  // Selected topic for detailed video view
  const [activeTopicId, setActiveTopicId] = useState<string>('german_language');
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState<boolean>(false);
  const [activeVideoLevel, setActiveVideoLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  
  // Active playing video modal
  const [playingVideo, setPlayingVideo] = useState<SkillVideo | null>(null);

  // Saved individual video IDs & topic IDs
  const [savedVideoIds, setSavedVideoIds] = useState<Set<string>>(new Set());
  const [savedTopicIds, setSavedTopicIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hydrate saved bookmarks from localStorage
  useEffect(() => {
    try {
      const storedVideos = localStorage.getItem('citizen_saved_videos');
      if (storedVideos) {
        const parsed = JSON.parse(storedVideos);
        setSavedVideoIds(new Set(Array.isArray(parsed) ? parsed.map((v: any) => v.id || v) : []));
      }
      const storedTopics = localStorage.getItem('citizen_saved_skills');
      if (storedTopics) {
        setSavedTopicIds(new Set(JSON.parse(storedTopics)));
      }
    } catch (e) {
      console.warn('Failed to load saved skills:', e);
    }
  }, []);

  // Listen to cross-tab / cross-component storage updates
  useEffect(() => {
    const handleSync = () => {
      try {
        const storedVideos = localStorage.getItem('citizen_saved_videos');
        if (storedVideos) {
          const parsed = JSON.parse(storedVideos);
          setSavedVideoIds(new Set(Array.isArray(parsed) ? parsed.map((v: any) => v.id || v) : []));
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('videos_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('videos_updated', handleSync);
    };
  }, []);

  // Save or Unsave a PARTICULAR VIDEO
  const toggleSaveVideo = (video: SkillVideo, topic: SkillTopic) => {
    setSavedVideoIds((prev) => {
      const next = new Set(prev);
      const isSaving = !next.has(video.id);

      let videoList: any[] = [];
      try {
        const raw = localStorage.getItem('citizen_saved_videos');
        videoList = raw ? JSON.parse(raw) : [];
      } catch (e) {
        videoList = [];
      }

      if (isSaving) {
        next.add(video.id);
        const newEntry = {
          id: video.id,
          youtubeId: video.youtubeId,
          title: video.title,
          titleHi: video.titleHi,
          channelName: video.channelName,
          duration: video.duration,
          language: video.language,
          level: video.level,
          topicId: topic.id,
          topicName: topic.name,
          topicNameHi: topic.nameHi,
          sectorId: topic.sectorId,
          savedAt: new Date().toISOString(),
        };
        // Avoid duplicate in array
        videoList = [newEntry, ...videoList.filter((v: any) => v.id !== video.id)];
        showToast(language === 'hi' ? `"${video.titleHi}" वीडियो सेव हो गया!` : `"${video.title}" saved to your watchlist!`);
      } else {
        next.delete(video.id);
        videoList = videoList.filter((v: any) => v.id !== video.id);
        showToast(language === 'hi' ? `वीडियो सेव सूची से हटाया गया` : `Removed video from saved list`);
      }

      try {
        localStorage.setItem('citizen_saved_videos', JSON.stringify(videoList));
        window.dispatchEvent(new Event('videos_updated'));
      } catch (e) {
        console.error('Storage error:', e);
      }

      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // All topics available for user's country (Universal skills + Country-specific skills)
  const countryTopics = useMemo(() => {
    return SKILL_TOPICS.filter((t) => !t.country || t.country === 'ALL' || t.country === country);
  }, [country]);

  // Sectors available for the current country
  const availableSectors = useMemo(() => {
    return SKILL_SECTORS.filter((sec) => {
      return countryTopics.some((t) => t.sectorId === sec.id);
    });
  }, [countryTopics]);

  // Filter topics based on country, sector, search, level, and high demand
  const filteredTopics = useMemo(() => {
    return countryTopics.filter((t) => {
      if (selectedSector !== 'all' && t.sectorId !== selectedSector) return false;
      
      // If user filters by high demand only
      if (onlyHighDemand && t.demandLevel !== 'very_high' && t.demandLevel !== 'trending') {
        return false;
      }

      // If user filters by a specific level, ensure the topic contains that level video
      if (levelFilter !== 'all') {
        const hasLevelVideo = t.videos.some((v) => v.level === levelFilter);
        if (!hasLevelVideo) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q) || t.nameHi.includes(q);
        const matchDesc = t.shortDesc.toLowerCase().includes(q) || t.shortDescHi.includes(q);
        const matchBadge = (t.demandBadge && t.demandBadge.toLowerCase().includes(q)) || (t.demandBadgeHi && t.demandBadgeHi.includes(q));
        const matchVideos = t.videos.some((v) => 
          v.title.toLowerCase().includes(q) || 
          v.titleHi.toLowerCase().includes(q) || 
          v.channelName.toLowerCase().includes(q)
        );
        if (!matchName && !matchDesc && !matchBadge && !matchVideos) return false;
      }
      return true;
    });
  }, [countryTopics, selectedSector, searchQuery, levelFilter, onlyHighDemand]);

  // Active topic object
  const activeTopic = useMemo(() => {
    const found = filteredTopics.find((t) => t.id === activeTopicId);
    return found || filteredTopics[0] || SKILL_TOPICS[0];
  }, [filteredTopics, activeTopicId]);

  // Keep active topic ID valid
  useEffect(() => {
    if (filteredTopics.length > 0 && !filteredTopics.some((t) => t.id === activeTopicId)) {
      setActiveTopicId(filteredTopics[0].id);
    }
  }, [filteredTopics, activeTopicId]);

  // Keep selected sector valid for current country
  useEffect(() => {
    if (selectedSector !== 'all' && !availableSectors.some((s) => s.id === selectedSector)) {
      setSelectedSector('all');
    }
  }, [availableSectors, selectedSector]);

  // Videos under active topic filtered strictly by level if specified
  const displayVideos = useMemo(() => {
    if (!activeTopic) return [];
    if (levelFilter === 'all') return activeTopic.videos;
    return activeTopic.videos.filter((v) => v.level === levelFilter);
  }, [activeTopic, levelFilter]);

  // Helper for sector icons
  const renderSectorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-4 h-4 text-emerald-600" />;
      case 'Video': return <Video className="w-4 h-4 text-rose-500" />;
      case 'Camera': return <Camera className="w-4 h-4 text-indigo-500" />;
      case 'Laptop': return <Laptop className="w-4 h-4 text-sky-500" />;
      case 'Landmark': return <Landmark className="w-4 h-4 text-amber-500" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-teal-600" />;
      case 'IndianRupee': return <IndianRupee className="w-4 h-4 text-emerald-600" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-orange-500" />;
      case 'HeartPulse': return <HeartPulse className="w-4 h-4 text-red-500" />;
      default: return <Compass className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/60 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Navigation Bar (Clean White Background Matching Home Page) */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200"
              title={language === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Home'}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                  {language === 'hi' ? 'कौशल एवं वीडियो सीख केंद्र' : 'Skills & Video Learning Hub'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  Verified Free
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {language === 'hi'
                  ? 'विदेशी भाषाएं, वीडियो एडिटिंग, फोटोग्राफी, कोडिंग व सरकारी परीक्षा के टॉप 3 वीडियो'
                  : 'Foreign languages, video editing, photography, coding & exam prep with top 3 curated masterclasses'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/saved"
              className="h-9 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{language === 'hi' ? 'सेव्ड वीडियोज' : 'Saved Watchlist'}</span>
              {savedVideoIds.size > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black">
                  {savedVideoIds.size}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Matching Home Page Dark Slate Card) */}
      <section className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden space-y-3 sm:space-y-5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-1.5 sm:space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-[10px] sm:text-[11px] font-bold">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{language === 'hi' ? 'युवाओं व सभी नागरिकों हेतु उपयोगी हुनर' : 'High-Income Practical Skills for Youth & Adults'}</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                Level-wise Verified
              </span>
            </div>

            <h1 className="text-base sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
              {language === 'hi'
                ? 'कौन सा हुनर सीखना है? टॉप 3 वीडियोज से आज ही शुरू करें'
                : 'Learn Any In-Demand Skill with Top 3 Handpicked Videos'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl hidden sm:block">
              {language === 'hi'
                ? 'विदेशी भाषाएं (जर्मन/जापानी), वीडियो एडिटिंग, फोटोग्राफी, कोडिंग, व सरकारी नौकरी गणित सीखें। हर विषय पर स्तर अनुसार (Beginner, Intermediate, Advanced) वीडियोज उपलब्ध हैं।'
                : 'Master German, Japanese, Video Editing, Photography, Coding & Aptitude with verified YouTube masterclasses categorized accurately by difficulty level.'}
            </p>
          </div>

          {/* Search Bar & Accurate Level Filter Chips */}
          <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center gap-2.5 pt-1">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hi' ? 'हुनर या विषय खोजें (जैसे: German, Japanese, Video Editing, Photography, Python, Vedic Maths)...' : 'Search any skill (e.g. German, Video Editing, Photography, Lightroom, Python)...'}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-950/80 text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-xs sm:text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Level Filter: Beginner / Intermediate / Advanced */}
            <div className="flex items-center gap-1 p-1 bg-slate-950/90 rounded-xl border border-slate-700 shrink-0 overflow-x-auto no-scrollbar">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3 text-emerald-400" />
                <span>Level:</span>
              </span>
              {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    levelFilter === lvl
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {lvl === 'all'
                    ? (language === 'hi' ? 'सभी स्तर' : 'All Levels')
                    : (lvl === 'Beginner'
                        ? (language === 'hi' ? 'शुरुआती (Beginner)' : 'Beginner')
                        : lvl === 'Intermediate'
                          ? (language === 'hi' ? 'मध्यम (Intermediate)' : 'Intermediate')
                          : (language === 'hi' ? 'उन्नत (Advanced)' : 'Advanced'))}
                </button>
              ))}
            </div>

            {/* High Demand Toggle Button */}
            <button
              type="button"
              onClick={() => setOnlyHighDemand(!onlyHighDemand)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                onlyHighDemand
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-400/30'
                  : 'bg-slate-950/90 text-rose-300 hover:text-white border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${onlyHighDemand ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'}`} />
              <span>{language === 'hi' ? 'भारी मांग (High Demand)' : 'High Demand'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Sectors Pill Carousel (Mobile-Friendly Smooth Scroll) */}
      <section className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedSector('all')}
            className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedSector === 'all'
                ? 'bg-slate-900 text-white border-slate-900 font-extrabold shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सभी क्षेत्र (All)' : 'All Sectors'}</span>
            <span className="text-[10px] opacity-75">({countryTopics.length})</span>
          </button>

          {availableSectors.map((sec) => {
            const isSelected = selectedSector === sec.id;
            const count = countryTopics.filter((t) => t.sectorId === sec.id).length;

            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSector(sec.id)}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {renderSectorIcon(sec.icon)}
                <span>{language === 'hi' ? sec.nameHi : sec.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Main Two-Column Workspace (Clean White / Light Slate Theme) */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-4 flex-1">
        {filteredTopics.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto space-y-3 shadow-xs my-8">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">
              {language === 'hi' ? 'कोई कौशल नहीं मिला' : 'No matching skills found'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'कृपया दूसरा कीवर्ड सर्च करें या किसी अन्य सेक्टर का चयन करें।'
                : 'Try adjusting your search query or reset the level filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSector('all');
                setLevelFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
            >
              {language === 'hi' ? 'सारे फिल्टर्स रीसेट करें' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Topics Selector (4 Cols on Desktop, Compact Mobile Pills) */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  {language === 'hi' ? `उपलब्ध विषय (${filteredTopics.length})` : `Topics (${filteredTopics.length})`}
                </span>
                <span className="text-[11px] text-emerald-700 font-bold hidden sm:inline">
                  {language === 'hi' ? 'क्लिक करके वीडियो देखें' : 'Select to view videos'}
                </span>
              </div>

              {/* Mobile-Friendly Compact Topic List with Max Height */}
              <div className="space-y-2 max-h-[460px] sm:max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
                {filteredTopics.map((topic) => {
                  const isActive = topic.id === activeTopic.id;
                  const hasSavedVideosInTopic = topic.videos.some((v) => savedVideoIds.has(v.id));

                  return (
                    <div
                      key={topic.id}
                      onClick={() => {
                        setActiveTopicId(topic.id);
                        setActiveVideoLevel('Beginner');
                        setIsMobileDetailOpen(true);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                        isActive
                          ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <h3 className={`text-xs sm:text-sm font-extrabold leading-snug truncate ${
                            isActive ? 'text-emerald-950 font-black' : 'text-slate-900'
                          }`}>
                            {language === 'hi' ? topic.nameHi : topic.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                            {language === 'hi' ? topic.shortDescHi : topic.shortDesc}
                          </p>

                          {topic.demandBadge && (
                            <div className="pt-1 flex items-center gap-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${
                                topic.demandLevel === 'very_high'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : topic.demandLevel === 'trending'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}>
                                <Flame className="w-2.5 h-2.5 fill-current" />
                                <span>{language === 'hi' ? topic.demandBadgeHi || topic.demandBadge : topic.demandBadge}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {hasSavedVideosInTopic && (
                          <span className="shrink-0 p-1 text-amber-500" title="Contains saved video">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold">
                          {topic.estTimeToLearn}
                        </span>
                        <span className="text-slate-500">
                          {topic.difficulty}
                        </span>
                        <span className="ml-auto font-bold text-emerald-700 flex items-center gap-0.5">
                          <span>3 Videos</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Topic Details & Top 3 Verified Videos (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-8 space-y-4">
              
              {/* Topic Header Card (Clean White) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-200">
                      {activeTopic.difficulty}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-mono font-bold">
                      {activeTopic.estTimeToLearn}
                    </span>
                    {activeTopic.demandBadge && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black border ${
                        activeTopic.demandLevel === 'very_high'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : activeTopic.demandLevel === 'trending'
                            ? 'bg-amber-100 text-amber-900 border-amber-200'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                      }`}>
                        <Flame className="w-3 h-3 fill-current" />
                        <span>{language === 'hi' ? activeTopic.demandBadgeHi || activeTopic.demandBadge : activeTopic.demandBadge}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] sm:text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {activeTopic.averageEarningMonthly}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {language === 'hi' ? activeTopic.nameHi : activeTopic.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {language === 'hi' ? activeTopic.shortDescHi : activeTopic.shortDesc}
                  </p>
                  {activeTopic.hiringScope && (
                    <div className="mt-2 text-[11px] text-slate-600 font-semibold flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{language === 'hi' ? `हायरिंग व स्कोप: ${activeTopic.hiringScope}` : `Hiring & Scope: ${activeTopic.hiringScope}`}</span>
                    </div>
                  )}
                </div>

                {/* Free Official Certificate Link */}
                {activeTopic.govtCertificateUrl && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-bold">
                        {language === 'hi' ? 'आधिकारिक फ्री सर्टिफिकेट:' : 'Official Free Certificate:'}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-800">
                        {activeTopic.govtCertificateTitle}
                      </span>
                    </div>
                    <a
                      href={activeTopic.govtCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition-colors shrink-0"
                    >
                      <span>{language === 'hi' ? 'सर्टिफिकेट लिंक' : 'Open Link'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Videos Section with Level Indicator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight">
                      {language === 'hi'
                        ? `शीर्ष 3 सत्यापित वीडियोज (${levelFilter === 'all' ? 'शुरुआती से एक्सपर्ट स्तर' : levelFilter + ' स्तर'})`
                        : `Top 3 Verified Masterclasses (${levelFilter === 'all' ? 'Beginner to Advanced' : levelFilter + ' Level'})`}
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 font-bold">
                    {displayVideos.length} {language === 'hi' ? 'वीडियो उपलब्ध' : 'Videos'}
                  </span>
                </div>

                {/* Video Cards Grid */}
                <div className="space-y-3">
                  {displayVideos.map((video, idx) => {
                    const isVideoSaved = savedVideoIds.has(video.id);

                    return (
                      <div
                        key={video.id}
                        className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 shadow-xs transition-all space-y-3 group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            {/* Step Badge */}
                            <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-800 font-black text-xs flex items-center justify-center shrink-0 border border-slate-200">
                              #{idx + 1}
                            </div>

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`px-2 py-0.2 rounded-md text-[10px] font-black uppercase ${
                                  video.level === 'Beginner'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                    : video.level === 'Intermediate'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                                }`}>
                                  {video.level}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {video.duration}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                  {video.language}
                                </span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                                {language === 'hi' ? video.titleHi : video.title}
                              </h4>

                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <span className="font-bold text-slate-700">{video.channelName}</span>
                                {video.viewsApprox && (
                                  <>
                                    <span>•</span>
                                    <span>{video.viewsApprox}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Play + Bookmark Video */}
                          <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                            {/* Watch Video Button */}
                            <button
                              type="button"
                              onClick={() => setPlayingVideo(video)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>{language === 'hi' ? 'यहीं देखें' : 'Watch Here'}</span>
                            </button>

                            {/* Particular Video Bookmark Button */}
                            <button
                              type="button"
                              onClick={() => toggleSaveVideo(video, activeTopic)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                isVideoSaved
                                  ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                              }`}
                              title={isVideoSaved ? 'Remove from Saved' : 'Save Video for Later'}
                            >
                              <Star className={`w-3.5 h-3.5 ${isVideoSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                            </button>

                            {/* Direct YouTube Link */}
                            <a
                              href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                              title="Open on YouTube App"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Video Description & Key Takeaways */}
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
                          <p className="text-slate-600 leading-relaxed text-[11px] sm:text-xs">
                            {language === 'hi' ? video.descriptionHi : video.description}
                          </p>

                          {video.keyTakeaways && video.keyTakeaways.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {video.keyTakeaways.map((point, kIdx) => (
                                <span
                                  key={kIdx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-700"
                                >
                                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                  <span>{point}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3-Step Practical Learning Roadmap */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight">
                    {language === 'hi' ? '3-चरणीय व्यावहारिक रोडमैप (शुरुआत से कमाई तक)' : '3-Step Action Roadmap'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeTopic.careerRoadmapSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center">
                        {step.stepNumber}
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 pt-1">
                        {language === 'hi' ? step.titleHi : step.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {language === 'hi' ? step.descHi : step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}
      </main>

      {/* 4B. Dedicated Mobile Masterclass View (Instant Video in 1st View - Zero Scrolling) */}
      {isMobileDetailOpen && activeTopic && (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col lg:hidden overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Sticky Top Bar with Back Button */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 py-2.5 flex items-center justify-between gap-2 shadow-xs">
            <button
              type="button"
              onClick={() => setIsMobileDetailOpen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span>{language === 'hi' ? 'वापस हुनर सूची' : 'Back to Skills'}</span>
            </button>

            <div className="min-w-0 text-center flex-1 px-1">
              <h3 className="text-xs font-black text-slate-900 truncate">
                {language === 'hi' ? activeTopic.nameHi : activeTopic.name}
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold block truncate">
                {activeTopic.averageEarningMonthly}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileDetailOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Masterclass Content - 1ST VIEW STARTS HERE */}
          <div className="p-3 sm:p-4 space-y-3.5 pb-16">
            
            {/* 1. Level Selector Pills (Beginner, Intermediate, Advanced) */}
            <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold px-1">
                <span className="text-slate-500 uppercase tracking-wider text-[10px]">
                  {language === 'hi' ? 'सीखने का स्तर चुनें:' : 'Select Difficulty Level:'}
                </span>
                <span className="text-emerald-700 font-mono text-[10px]">
                  {activeTopic.estTimeToLearn}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => {
                  const isLevelActive = activeVideoLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setActiveVideoLevel(lvl)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        isLevelActive
                          ? 'bg-slate-900 text-white font-black shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="block leading-tight">{lvl}</span>
                      <span className="text-[9px] opacity-75 font-normal">
                        {lvl === 'Beginner' ? (language === 'hi' ? 'शुरुआती' : 'Basics') : (lvl === 'Intermediate' ? (language === 'hi' ? 'मध्यम' : 'Mid') : (language === 'hi' ? 'उन्नत' : 'Pro'))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Embedded Video Player for the Active Level (IN 1ST VIEW) */}
            {(() => {
              const currentVideo = activeTopic.videos.find((v) => v.level === activeVideoLevel) || activeTopic.videos[0];
              if (!currentVideo) return null;
              const isVideoSaved = savedVideoIds.has(currentVideo.id);

              return (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-3 p-3">
                  
                  {/* 16:9 Video Embed */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-xs">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtubeId}?rel=0`}
                      title={currentVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>

                  {/* Video Details & Actions */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {currentVideo.level} Masterclass
                        </span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 leading-snug">
                          {language === 'hi' ? currentVideo.titleHi : currentVideo.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {currentVideo.channelName} • {currentVideo.duration} • {currentVideo.language}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleSaveVideo(currentVideo, activeTopic)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            isVideoSaved
                              ? 'bg-amber-100 border-amber-300 text-amber-700'
                              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
                          }`}
                          title="Save video"
                        >
                          <Star className={`w-4 h-4 ${isVideoSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                        <a
                          href={`https://www.youtube.com/watch?v=${currentVideo.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600"
                          title="YouTube"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {/* Key Takeaways */}
                    {currentVideo.keyTakeaways && currentVideo.keyTakeaways.length > 0 && (
                      <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-[11px] text-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 block text-[10px] uppercase">
                          {language === 'hi' ? 'इस वीडियो में क्या सीखेंगे:' : 'Key Learnings:'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {currentVideo.keyTakeaways.map((pt, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px]">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              <span>{pt}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

            {/* 3. Official Certificate Link */}
            {activeTopic.govtCertificateUrl && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Award className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-emerald-900 tracking-wider block">
                      {language === 'hi' ? 'आधिकारिक फ्री सर्टिफिकेट' : 'Official Free Certificate'}
                    </span>
                    <p className="font-extrabold text-slate-900 truncate text-xs">
                      {activeTopic.govtCertificateTitle}
                    </p>
                  </div>
                </div>

                <a
                  href={activeTopic.govtCertificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 shrink-0 shadow-xs"
                >
                  <span>{language === 'hi' ? 'प्राप्त करें' : 'Get Cert'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* 4. 3-Step Action Roadmap */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                  {language === 'hi' ? '3-चरणीय रोडमैप' : '3-Step Action Roadmap'}
                </h4>
              </div>

              <div className="space-y-2">
                {activeTopic.careerRoadmapSteps.map((step) => (
                  <div key={step.stepNumber} className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-900">
                        {language === 'hi' ? step.titleHi : step.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                        {language === 'hi' ? step.descHi : step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 5. In-Built Video Player Modal (Distraction-Free) */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0">
                  <Play className="w-3 h-3 fill-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-extrabold truncate">
                    {language === 'hi' ? playingVideo.titleHi : playingVideo.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {playingVideo.channelName} • {playingVideo.level} • {playingVideo.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleSaveVideo(playingVideo, activeTopic)}
                  className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    savedVideoIds.has(playingVideo.id)
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                  }`}
                  title="Bookmark Video"
                >
                  <Star className={`w-3.5 h-3.5 ${savedVideoIds.has(playingVideo.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
                <a
                  href={`https://www.youtube.com/watch?v=${playingVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">YouTube</span>
                </a>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Iframe Embed */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${playingVideo.youtubeId}?autoplay=1&rel=0`}
                title={playingVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-950 text-xs text-slate-400 flex items-center justify-between gap-3">
              <span className="text-[11px] truncate">
                {language === 'hi'
                  ? 'यह आधिकारिक ट्यूटोरियल है। इसे पूरा देखकर नोट्स बनाएं व प्रैक्टिकल अभ्यास करें।'
                  : 'Distraction-free learning player. Take structured notes and practice hands-on.'}
              </span>
              <button
                onClick={() => setPlayingVideo(null)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0 cursor-pointer"
              >
                {language === 'hi' ? 'बंद करें' : 'Close Player'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
