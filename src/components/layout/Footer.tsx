'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, ShieldCheck, Heart, ExternalLink, PhoneCall, Star, FileText } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

export const Footer: React.FC = () => {
  const { language } = useTranslation();

  return (
    <footer className="w-full bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        
        {/* 1. Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Identity & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-900 to-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-sm">
                <Landmark className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-black text-white text-base tracking-tight">
                Citizen Life OS
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {language === 'hi'
                ? 'भारतीय नागरिकों, विद्यार्थियों, किसानों व युवाओं के लिए केंद्र व राज्य सरकारों के 100% प्रामाणिक अवसरों, योजनाओं व छात्रवृत्तियों का स्वतंत्र नागरिक-तकनीकी सूचना पोर्टल।'
                : 'Independent civic-tech portal providing verified national opportunities, scholarships, exams, and government schemes for Indian citizens.'}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? 'दलाली-मुक्त व सीधा आधिकारिक आवेदन' : 'Zero Middlemen • Direct Official Applications'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {language === 'hi' ? 'त्वरित लिंक (Quick Links)' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>•</span>
                  <span>{language === 'hi' ? 'अवसर पोर्टल (Opportunities)' : 'Opportunities Portal'}</span>
                </Link>
              </li>
              <li>
                <Link href="/helpline" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <PhoneCall className="w-3 h-3 text-red-400" />
                  <span>{language === 'hi' ? '२४x७ नागरिक हेल्पलाइन' : '24x7 Citizen Helplines'}</span>
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-400" />
                  <span>{language === 'hi' ? 'पसंदीदा फॉर्म (Saved Schemes)' : 'Saved Schemes'}</span>
                </Link>
              </li>
              <li>
                <Link href="/forms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-blue-400" />
                  <span>{language === 'hi' ? 'डाउनलोड फॉर्म्स (PDF Forms)' : 'Govt Forms Directory'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {language === 'hi' ? 'कानूनी व नीतियां (Legal)' : 'Legal & Policies'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>🛡️</span>
                  <span>{language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>📜</span>
                  <span>{language === 'hi' ? 'नियम एवं शर्तें (Terms & Conditions)' : 'Terms & Conditions'}</span>
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>{language === 'hi' ? 'अस्वीकरण (Disclaimer)' : 'Disclaimer'}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Mandatory Disclaimer Notice Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <p>
            <strong className="text-slate-200">
              {language === 'hi' ? 'अस्वीकरण (Disclaimer): ' : 'Disclaimer: '}
            </strong>
            {language === 'hi'
              ? 'Citizen Life OS एक गैर-सरकारी स्वतंत्र मंच है। यह किसी भी सरकारी विभाग का आधिकारिक अंग नहीं है। सभी योजनाएं व अवसर केवल सूचना एवं जागरूकता के उद्देश्य से आधिकारिक गजटों और सरकारी पोर्टल्स (egazette.gov.in, pib.gov.in) से संकलित किए जाते हैं।'
              : 'Citizen Life OS is an independent civic portal and is NOT affiliated with or endorsed by any government entity. All announcements are aggregated directly from public government gazettes and ministry portals.'}
          </p>
        </div>

        {/* 3. Bottom Copyright Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 Citizen Life OS. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for Indian Citizens</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
