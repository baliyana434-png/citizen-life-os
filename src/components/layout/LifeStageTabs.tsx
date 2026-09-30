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
      {/* 1. Main Life Stage Gliding Switch (Apple macOS 3D Style) */}
      <div className="flex p-1.5 bg-slate-200/60 backdrop-blur-md rounded-2xl border border-slate-300/60 shadow-inner overflow-x-auto no-scrollbar gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[130px] sm:min-w-[150px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm transition-all duration-250 cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-950 shadow-[0_4px_14px_rgba(15,23,42,0.08),0_1px_2px_rgba(15,23,42,0.04)] border border-slate-200/90 font-extrabold scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 font-semibold'
              }`}
            >
              <span className={`transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {tab.icon}
              </span>
              <span className="whitespace-nowrap">{t(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Compact Sub-Filter Chips */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1.5">
          {subFilters.map((sf) => {
            const isSelected = activeSubFilter === sf.id;

            return (
              <button
                key={sf.id}
                onClick={() => onSubFilterChange(sf.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm scale-[1.02]'
                    : 'bg-white/90 text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {t(sf.labelKey)}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center text-xs text-slate-500 font-bold whitespace-nowrap pl-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 radar-pulse" />
            {totalCount} {t('subfilters.opportunities_active')}
          </span>
        </div>
      </div>
    </div>
  );
};
