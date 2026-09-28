'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  PhoneCall, 
  ShieldCheck, 
  Search, 
  ArrowLeft, 
  Clock, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  LifeBuoy, 
  ShieldAlert, 
  HeartHandshake, 
  Scale, 
  Building2,
  Lock,
  Star,
  Sparkles,
  FileText
} from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { VERIFIED_HELPLINES } from '@/data/helplines';
import { HelplineCategory, HelplineFacility } from '@/types';

export default function HelplinePage() {
  const { language, setLanguage } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelEn: 'All Helplines', labelHi: 'सभी हेल्पलाइन' },
    { id: 'emergency', labelEn: 'Emergency (112/108)', labelHi: 'आपातकाल (११२/१०८)' },
    { id: 'cyber_legal', labelEn: 'Cyber & Legal (1930/15100)', labelHi: 'साइबर ठगी व कानून' },
    { id: 'women_child', labelEn: 'Women & Child (181/1098)', labelHi: 'महिला व बाल सुरक्षा' },
    { id: 'senior', labelEn: 'Senior Citizens (14567)', labelHi: 'वरिष्ठ नागरिक' },
    { id: 'farmer', labelEn: 'Farmers (KCC)', labelHi: 'किसान सहायता' },
    { id: 'health', labelEn: 'Health & Mental (14416)', labelHi: 'स्वास्थ्य व तनाव' },
    { id: 'citizen_services', labelEn: 'Citizen & Exams', labelHi: 'नागरिक सेवा व परीक्षा' },
  ];

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'emergency': return <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
      case 'cyber_legal': return <Scale className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'women_child': return <HeartHandshake className="w-3.5 h-3.5 text-pink-500 shrink-0" />;
      case 'senior': return <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'farmer': return <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'health': return <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />;
      case 'citizen_services': return <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />;
      default: return <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
    }
  };

  const filteredHelplines = useMemo(() => {
    return VERIFIED_HELPLINES.filter((h) => {
      if (activeCategory !== 'all' && h.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = h.number.toLowerCase().includes(q);
        const matchName = h.name.toLowerCase().includes(q) || h.nameHi.includes(q);
        const matchAuth = h.authority.toLowerCase().includes(q) || h.authorityHi.includes(q);
        const matchPurpose = h.purpose.toLowerCase().includes(q) || h.purposeHi.includes(q);
        const matchTags = h.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchNumber && !matchName && !matchAuth && !matchPurpose && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Banner Strip */}
      <div className="w-full bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            {language === 'hi' ? 'नागरिक आपातकालीन एवं कानूनी सहायता डायरेक्टरी' : 'CITIZEN 24x7 EMERGENCY & HELPLINE DIRECTORY'}
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-400 text-[10px] hidden md:inline">
            {language === 'hi' ? '100% निःशुल्क टोल-फ्री आधिकारिक नंबर' : '100% Toll-Free Official Verified Numbers'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-emerald-400 font-mono font-bold">1-CLICK DIRECT CALLING</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{language === 'hi' ? 'मुख्य पृष्ठ' : 'Opportunities'}</span>
              </Link>
              <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                    {language === 'hi' ? '२४x७ नागरिक हेल्पलाइन एवं सहायता केंद्र' : '24x7 Citizen Helpline & Emergency Hub'}
                  </h1>
                  <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
                    {language === 'hi' ? 'सरकारी आपातकालीन, कानूनी, साइबर व जन-कल्याण सेवाएं' : 'Government emergency, legal, cyber & welfare hotlines'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="flex items-center gap-2">
              <Link
                href="/saved"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300 transition-all shadow-2xs"
                title={language === 'hi' ? 'पसंदीदा फॉर्म व अवसर' : 'Saved Opportunities'}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-600" />
                <span>{language === 'hi' ? 'पसंदीदा' : 'Saved'}</span>
              </Link>

              {/* 6-Language Switcher */}
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Emergency Hot Bar (Golden Hour & Life Threats) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 112 Emergency */}
          <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-4 text-white shadow-md flex flex-col justify-between border border-red-500">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  24x7 PAN-INDIA
                </span>
                <LifeBuoy className="w-4 h-4 text-white/80" />
              </div>
              <h3 className="text-xl font-black font-mono">112</h3>
              <p className="text-xs font-bold text-red-100 mt-0.5">
                {language === 'hi' ? 'पुलिस, आग व आकस्मिक आपदा' : 'National Emergency (Police/Fire)'}
              </p>
            </div>
            <a
              href="tel:112"
              className="mt-3 w-full py-2 px-3 bg-white hover:bg-red-50 text-red-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'तुरंत कॉल करें (112)' : 'Call 112 Now'}</span>
            </a>
          </div>

          {/* 1930 Cyber Fraud */}
          <div className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-2xl p-4 text-white shadow-md flex flex-col justify-between border border-indigo-600">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  GOLDEN HOUR
                </span>
                <ShieldAlert className="w-4 h-4 text-white/80" />
              </div>
              <h3 className="text-xl font-black font-mono">1930</h3>
              <p className="text-xs font-bold text-indigo-100 mt-0.5">
                {language === 'hi' ? 'साइबर व ऑनलाइन वित्तीय ठगी' : 'Cyber Financial Fraud Freeze'}
              </p>
            </div>
            <a
              href="tel:1930"
              className="mt-3 w-full py-2 px-3 bg-white hover:bg-indigo-50 text-indigo-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'खाता फ्रीज करें (1930)' : 'Call 1930 Now'}</span>
            </a>
          </div>

          {/* 181 Women in Distress */}
          <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl p-4 text-white shadow-md flex flex-col justify-between border border-pink-500">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  WOMEN ONLY • 24x7
                </span>
                <HeartHandshake className="w-4 h-4 text-white/80" />
              </div>
              <h3 className="text-xl font-black font-mono">181</h3>
              <p className="text-xs font-bold text-pink-100 mt-0.5">
                {language === 'hi' ? 'महिला सुरक्षा व सखी सेंटर' : 'Women in Distress Helpline'}
              </p>
            </div>
            <a
              href="tel:181"
              className="mt-3 w-full py-2 px-3 bg-white hover:bg-pink-50 text-pink-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सुरक्षा कॉल (181)' : 'Call 181 Now'}</span>
            </a>
          </div>

          {/* 15100 Free Legal Aid */}
          <div className="bg-gradient-to-br from-emerald-700 to-teal-800 rounded-2xl p-4 text-white shadow-md flex flex-col justify-between border border-emerald-600">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  FREE LEGAL AID
                </span>
                <Scale className="w-4 h-4 text-white/80" />
              </div>
              <h3 className="text-xl font-black font-mono">15100</h3>
              <p className="text-xs font-bold text-emerald-100 mt-0.5">
                {language === 'hi' ? 'मुफ्त वकील व कानूनी परामर्श' : 'Tele-Law 24x7 Free Legal Advice'}
              </p>
            </div>
            <a
              href="tel:15100"
              className="mt-3 w-full py-2 px-3 bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'मुफ्त सलाह लें (15100)' : 'Call 15100 Now'}</span>
            </a>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'नंबर (1930, 112, 181), विभाग अथवा समस्या से खोजें...'
                  : 'Search by number (1930, 112, 181), department or problem...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder-slate-400 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{language === 'hi' ? cat.labelHi : cat.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Helplines List Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              {filteredHelplines.length} {language === 'hi' ? 'सत्यापित सुविधाएं उपलब्ध' : 'Verified Facilities Available'}
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {language === 'hi' ? 'शत-प्रतिशत टोल-फ्री एवं प्रामाणिक' : '100% Toll-Free Official Directory'}
            </span>
          </div>

          {filteredHelplines.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
              <AlertTriangle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {language === 'hi' ? 'कोई हेल्पलाइन नहीं मिली' : 'No helpline found'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'कृपया अन्य शब्द या श्रेणी चुनकर खोजें।' : 'Please try searching with another keyword or category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredHelplines.map((h) => {
                const name = language === 'hi' ? h.nameHi : h.name;
                const authority = language === 'hi' ? h.authorityHi : h.authority;
                const purpose = language === 'hi' ? h.purposeHi : h.purpose;
                const hours = language === 'hi' ? h.hoursHi : h.hours;
                const guidanceList = language === 'hi' ? h.guidanceHi : h.guidance;

                return (
                  <div
                    key={h.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Authority & Status Strip */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold">
                          <Building2 className="w-3 h-3 text-slate-600" />
                          <span className="truncate max-w-[200px]">{authority}</span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {h.is24x7 && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold">
                              24x7
                            </span>
                          )}
                          {h.isTollFree && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-extrabold">
                              {language === 'hi' ? 'टोल-फ्री' : 'Toll-Free'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Helpline Number & Name */}
                      <div className="flex items-start justify-between gap-3 mt-1">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {name}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            {purpose}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block text-2xl font-black font-mono text-emerald-800">
                            {h.number}
                          </span>
                          <span className="text-[10px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {hours}
                          </span>
                        </div>
                      </div>

                      {/* Pre-Call Checklist / Guidance Box */}
                      <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>{language === 'hi' ? 'कॉल करने से पूर्व तैयारी:' : 'Before you call (Checklist):'}</span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-600 pl-4 list-disc marker:text-emerald-600">
                          {guidanceList.map((g, idx) => (
                            <li key={idx}>{g}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Action Triggers */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {h.portalUrl && (
                          <a
                            href={h.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                          >
                            <span>{language === 'hi' ? 'वेब पोर्टल' : 'Official Portal'}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        )}
                        <button
                          onClick={() => handleCopyNumber(h.number)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                        >
                          {copiedNumber === h.number ? (
                            <span className="text-emerald-700 font-bold">✓ Copied</span>
                          ) : (
                            language === 'hi' ? 'नंबर कॉपी करें' : 'Copy'
                          )}
                        </button>
                      </div>

                      <a
                        href={`tel:${h.number.replace(/-/g, '')}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? `कॉल करें (${h.number})` : `Call ${h.number}`}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
