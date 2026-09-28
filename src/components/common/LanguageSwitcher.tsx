'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { SupportedLanguage } from '@/types';

export const LanguageSwitcher: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-bold text-slate-800 transition-all cursor-pointer"
        title={t('settings.language_label')}
        aria-label="Language selector"
      >
        <Globe className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-[11px] uppercase tracking-wide">{language}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('settings.language_label')}
            </div>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
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
  );
};
