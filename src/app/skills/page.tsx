'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Play,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
  Clock,
  Award,
  Sparkles,
  TrendingUp,
  X,
  Share2,
  Laptop,
  Landmark,
  Video,
  IndianRupee,
  Wrench,
  MessageSquare,
  HeartPulse,
  Compass,
  Star
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { SKILL_SECTORS, SKILL_TOPICS, SkillSector, SkillTopic, SkillVideo } from '@/data/skillsData';

export default function SkillsPage() {
  const { language } = useTranslation();
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Beginner' | 'Intermediate'>('all');
  
  // Selected topic for detailed video view
  const [activeTopic, setActiveTopic] = useState<SkillTopic>(SKILL_TOPICS[0]);
  
  // Active playing video modal
  const [playingVideo, setPlayingVideo] = useState<SkillVideo | null>(null);

  // Saved / Bookmarked skills
  const [savedSkillIds, setSavedSkillIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('citizen_saved_skills');
      if (stored) {
        setSavedSkillIds(new Set(JSON.parse(stored)));
      }
    } catch (e) {
      console.warn('Failed to load saved skills:', e);
    }
  }, []);

  const toggleSaveSkill = (topicId: string, topicName: string) => {
    setSavedSkillIds((prev) => {
      const next = new Set(prev);
      const isSaving = !next.has(topicId);
      if (isSaving) {
        next.add(topicId);
        showToast(language === 'hi' ? `"${topicName}" को बाद में देखने के लिए सेव कर लिया गया!` : `"${topicName}" saved to your learning list!`);
      } else {
        next.delete(topicId);
        showToast(language === 'hi' ? `सेव सूची से हटाया गया` : `Removed from saved list`);
      }
      try {
        localStorage.setItem('citizen_saved_skills', JSON.stringify(Array.from(next)));
        window.dispatchEvent(new Event('skills_updated'));
      } catch (e) {
        console.error('Failed to update storage:', e);
      }
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter topics based on sector, search, and difficulty
  const filteredTopics = useMemo(() => {
    return SKILL_TOPICS.filter((t) => {
      if (selectedSector !== 'all' && t.sectorId !== selectedSector) return false;
      if (difficultyFilter !== 'all' && t.difficulty !== difficultyFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = t.name.toLowerCase().includes(q) || t.nameHi.includes(q);
        const matchDesc = t.shortDesc.toLowerCase().includes(q) || t.shortDescHi.includes(q);
        const matchVideos = t.videos.some((v) => v.title.toLowerCase().includes(q) || v.channelName.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchVideos) return false;
      }
      return true;
    });
  }, [selectedSector, searchQuery, difficultyFilter]);

  // Keep active topic synchronized with filter results
  useEffect(() => {
    if (filteredTopics.length > 0 && !filteredTopics.some((t) => t.id === activeTopic.id)) {
      setActiveTopic(filteredTopics[0]);
    }
  }, [filteredTopics, activeTopic.id]);

  // Helper for sector icons
  const renderSectorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="w-4 h-4 text-sky-400" />;
      case 'Landmark': return <Landmark className="w-4 h-4 text-amber-400" />;
      case 'Video': return <Video className="w-4 h-4 text-rose-400" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'IndianRupee': return <IndianRupee className="w-4 h-4 text-yellow-400" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-orange-400" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'HeartPulse': return <HeartPulse className="w-4 h-4 text-red-400" />;
      default: return <Compass className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-30 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
              title={language === 'hi' ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Home'}
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                  {language === 'hi' ? 'कौशल एवं वीडियो सीख केंद्र' : 'Skills & Video Learning Hub'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                  100% Free
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {language === 'hi'
                  ? 'हर क्षेत्र की शीर्ष 3 सत्यापित वीडियोज, व्यावहारिक रोडमैप व फ्री सरकारी सर्टिफिकेट'
                  : 'Top 3 curated YouTube masterclasses, structured roadmaps & free certification links'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/saved"
              className="h-9 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/60 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{language === 'hi' ? 'सेव की गई स्किल्स' : 'Saved List'}</span>
              {savedSkillIds.size > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                  {savedSkillIds.size}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Search & Sector Selector Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'युवाओं व सभी नागरिकों हेतु उपयोगी हुनर' : 'Empowering Youth & Citizens with Practical Skills'}</span>
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {language === 'hi'
                ? 'आपको किस क्षेत्र में कौशल सीखना है?'
                : 'Which high-income skill do you want to learn today?'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {language === 'hi'
                ? 'नीचे दिए गए किसी भी क्षेत्र को चुनें। आपको उस विषय से संबंधित सबसे बेहतरीन टॉप 3 यूट्यूब वीडियो, चरणबद्ध रोडमैप और फ्री सर्टिफिकेट सीधे मिलेंगे।'
                : 'Select any sector below. Get the top 3 handpicked YouTube videos, step-by-step roadmap, and official free certification without spam or confusion.'}
            </p>
          </div>

          {/* Search Bar & Difficulty Switch */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hi' ? 'विषय या कौशल खोजें (जैसे: Web Development, Vedic Maths, CapCut, Tally, Solar...)' : 'Search any skill or topic (e.g. Python, Govt Maths, Reels Editing, Tally, EV...)'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-xs sm:text-sm transition-all"
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

            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0 self-start sm:self-auto">
              {(['all', 'Beginner', 'Intermediate'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    difficultyFilter === level
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {level === 'all'
                    ? (language === 'hi' ? 'सभी स्तर' : 'All Levels')
                    : (level === 'Beginner' ? (language === 'hi' ? 'शुरुआती' : 'Beginner') : (language === 'hi' ? 'मध्यम' : 'Intermediate'))}
                </button>
              ))}
            </div>
          </div>

          {/* Sector Selection Grid */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedSector('all')}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSector === 'all'
                  ? 'bg-white text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सभी क्षेत्र (All Sectors)' : 'All Sectors'}</span>
              <span className="text-[10px] opacity-70">({SKILL_TOPICS.length})</span>
            </button>

            {SKILL_SECTORS.map((sector) => {
              const isSelected = selectedSector === sector.id;
              const sectorTopicsCount = SKILL_TOPICS.filter((t) => t.sectorId === sector.id).length;
              return (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(sector.id)}
                  className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {renderSectorIcon(sector.icon)}
                  <span>{language === 'hi' ? sector.nameHi : sector.name}</span>
                  <span className="text-[10px] opacity-75">({sectorTopicsCount})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Main Dual-Pane Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {filteredTopics.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800 max-w-xl mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {language === 'hi' ? 'कोई कौशल नहीं मिला' : 'No matching skills found'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'कृपया दूसरा कीवर्ड सर्च करें या किसी अन्य सेक्टर का चयन करें।'
                : 'Try searching with another keyword or reset the sector filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSector('all');
                setDifficultyFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all cursor-pointer"
            >
              {language === 'hi' ? 'सारे फिल्टर्स रीसेट करें' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Pane: A to Z Skill Topics List (4 Cols on Desktop) */}
            <div className="lg:col-span-4 space-y-3 order-2 lg:order-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'hi' ? `उपलब्ध कौशल (${filteredTopics.length})` : `Available Skills (${filteredTopics.length})`}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  {language === 'hi' ? 'क्लिक करके वीडियो देखें' : 'Click to view videos'}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {filteredTopics.map((topic) => {
                  const isActive = topic.id === activeTopic.id;
                  const isSaved = savedSkillIds.has(topic.id);

                  return (
                    <div
                      key={topic.id}
                      onClick={() => setActiveTopic(topic)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                        isActive
                          ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
                          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className={`text-xs sm:text-sm font-extrabold leading-snug ${isActive ? 'text-white' : 'text-slate-200'}`}>
                            {language === 'hi' ? topic.nameHi : topic.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {language === 'hi' ? topic.shortDescHi : topic.shortDesc}
                          </p>
                        </div>

                        {/* Save Bookmark Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveSkill(topic.id, language === 'hi' ? topic.nameHi : topic.name);
                          }}
                          className={`p-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                            isSaved
                              ? 'text-amber-400 bg-amber-950/40 hover:bg-amber-900/50'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                          }`}
                          title={isSaved ? 'Remove Bookmark' : 'Save for Later'}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-400" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-800/60 text-[10px]">
                        <span className="font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50">
                          {topic.estTimeToLearn}
                        </span>
                        <span className="text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                          {topic.difficulty}
                        </span>
                        <span className="text-slate-400 ml-auto font-medium">
                          3 Top Videos
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Pane: Selected Skill Detail & Top 3 YouTube Videos (8 Cols on Desktop) */}
            <div className="lg:col-span-8 space-y-6 order-1 lg:order-2">
              
              {/* Active Topic Banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-xs font-bold">
                        {activeTopic.difficulty}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                        {activeTopic.estTimeToLearn}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveSkill(activeTopic.id, language === 'hi' ? activeTopic.nameHi : activeTopic.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          savedSkillIds.has(activeTopic.id)
                            ? 'bg-amber-950/50 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {savedSkillIds.has(activeTopic.id) ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>{language === 'hi' ? 'सेव्ड है' : 'Saved'}</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{language === 'hi' ? 'बाद के लिए सेव करें' : 'Save for Later'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {language === 'hi' ? activeTopic.nameHi : activeTopic.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                      {language === 'hi' ? activeTopic.shortDescHi : activeTopic.shortDesc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        {language === 'hi' ? 'अनुमानित मासिक कमाई क्षमता' : 'Expected Earning Potential'}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono">
                        {activeTopic.averageEarningMonthly}
                      </span>
                    </div>

                    {activeTopic.govtCertificateUrl && (
                      <a
                        href={activeTopic.govtCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 hover:border-emerald-600/50 rounded-2xl p-3 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                            {language === 'hi' ? 'आधिकारिक फ्री सर्टिफिकेट' : 'Official Free Certificate'}
                          </span>
                          <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
                            {activeTopic.govtCertificateTitle}
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-colors" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Top 3 Verified YouTube Videos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="text-sm font-extrabold text-white tracking-tight">
                      {language === 'hi' ? 'शीर्ष 3 सर्वश्रेष्ठ यूट्यूब वीडियोज (बिना भटके तुरंत सीखें)' : 'Top 3 Curated YouTube Masterclasses'}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    3/3 Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {activeTopic.videos.map((vid, idx) => (
                    <div
                      key={vid.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-md space-y-3 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-xl bg-red-950 text-red-400 border border-red-800/60 font-black text-xs flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug group-hover:text-emerald-300 transition-colors">
                              {language === 'hi' ? vid.titleHi : vid.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                              <span className="font-semibold text-slate-300">{vid.channelName}</span>
                              <span>•</span>
                              <span>{vid.duration}</span>
                              <span>•</span>
                              <span className="text-emerald-400 font-mono">{vid.language}</span>
                              {vid.viewsApprox && (
                                <>
                                  <span>•</span>
                                  <span>{vid.viewsApprox}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPlayingVideo(vid)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-slate-950" />
                            <span>{language === 'hi' ? 'यहीं देखें' : 'Watch Here'}</span>
                          </button>

                          <a
                            href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="Open on YouTube"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/60">
                        {language === 'hi' ? vid.descriptionHi : vid.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Practical Roadmap */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-extrabold text-white tracking-tight">
                    {language === 'hi' ? '3-चरणीय व्यावहारिक रोडमैप (शुरुआत से कमाई तक)' : '3-Step Practical Learning Roadmap'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeTopic.careerRoadmapSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 space-y-1.5 relative overflow-hidden"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400 text-xs font-black flex items-center justify-center">
                        {step.stepNumber}
                      </div>
                      <h4 className="text-xs font-extrabold text-white">
                        {language === 'hi' ? step.titleHi : step.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
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

      {/* 4. Embedded Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0">
                  <Play className="w-3 h-3 fill-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">
                    {language === 'hi' ? playingVideo.titleHi : playingVideo.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {playingVideo.channelName} • {playingVideo.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://www.youtube.com/watch?v=${playingVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">YouTube</span>
                </a>
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
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
            <div className="p-4 bg-slate-950 text-xs text-slate-400 flex items-center justify-between gap-3">
              <span>
                {language === 'hi'
                  ? 'यह वीडियो आधिकारिक ट्यूटोरियल है। इसे पूरा देखकर नोट्स बनाएं व प्रैक्टिकल अभ्यास करें।'
                  : 'Distraction-free learning player. Take structured notes and practice hands-on.'}
              </span>
              <button
                onClick={() => setPlayingVideo(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0 cursor-pointer"
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
