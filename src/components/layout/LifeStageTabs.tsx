'use client';

import React from 'react';
import { LifeStage } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { Award, Building2, GraduationCap, BookOpen, Globe, Wrench, Rocket, Landmark, Gift, HeartPulse } from 'lucide-react';

interface LifeStageTabsProps {
  activeTab: LifeStage;
  onTabChange: (tab: LifeStage) => void;
  activeSubFilter: string;
  onSubFilterChange: (filter: string) => void;
  totalCount: number;
}

export const LifeStageTabs: React.FC<LifeStageTabsProps> = ({
  activeTab,
  onTabChange,
  activeSubFilter,
  onSubFilterChange,
  totalCount,
}) => {
  const { t } = useTranslation();

  const tabs: { id: LifeStage; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'exams', labelKey: 'tabs.exams', icon: <Award className="w-4 h-4" /> },
    { id: 'private_jobs', labelKey: 'tabs.private_jobs', icon: <Building2 className="w-4 h-4" /> },
    { id: 'internships', labelKey: 'tabs.internships', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'education', labelKey: 'tabs.education', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'abroad_jobs', labelKey: 'tabs.abroad_jobs', icon: <Globe className="w-4 h-4" /> },
    { id: 'career', labelKey: 'tabs.career', icon: <Wrench className="w-4 h-4" /> },
    { id: 'startups', labelKey: 'tabs.startups', icon: <Rocket className="w-4 h-4" /> },
    { id: 'schemes', labelKey: 'tabs.schemes', icon: <Landmark className="w-4 h-4" /> },
    { id: 'freebies', labelKey: 'tabs.freebies', icon: <Gift className="w-4 h-4" /> },
    { id: 'health', labelKey: 'tabs.health', icon: <HeartPulse className="w-4 h-4" /> },
  ];

  const subFilters = [
    { id: 'all', labelKey: 'subfilters.all' },
    { id: 'new', labelKey: 'subfilters.new' },
    { id: 'upcoming', labelKey: 'subfilters.upcoming' },
    { id: 'active_now', labelKey: 'subfilters.active_now' },
    { id: 'govt_only', labelKey: 'subfilters.govt_only' },
    { id: 'free_only', labelKey: 'subfilters.free_only' },
    { id: 'high_value', labelKey: 'subfilters.high_value' },
  ];

  return (
    <div className="w-full space-y-3">
      {/* 1. Main Life Stage Switch (Clean Solid Buttons, Generous Gap, Zero Touching) */}
      <div className="flex p-1 sm:p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 touch-pan-x scroll-smooth">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200 font-extrabold'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 font-semibold'
              }`}
            >
              <span className={`transition-colors shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {tab.icon}
              </span>
              <span className="whitespace-nowrap">{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Compact Sub-Filter Chips (Spaced Out, Zero Touching) */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5 sm:py-1 touch-pan-x scroll-smooth">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {subFilters.map((sf) => {
            const isSelected = activeSubFilter === sf.id;

            return (
              <button
                key={sf.id}
                onClick={() => onSubFilterChange(sf.id)}
                className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t(sf.labelKey)}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center text-xs text-slate-500 font-bold whitespace-nowrap pl-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 radar-pulse shrink-0" />
            <span>{totalCount} {t('subfilters.opportunities_active')}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
