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
      {/* 1. Main Life Stage Gliding Switch */}
      <div className="flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-inner overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-w-[120px] sm:min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-emerald-900 shadow-sm shadow-slate-900/5 font-bold scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>
                {tab.icon}
              </span>
              <span>{t(tab.labelKey)}</span>
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t(sf.labelKey)}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center text-xs text-slate-500 font-medium whitespace-nowrap pl-2">
          <span>{totalCount} {t('subfilters.opportunities_active')}</span>
        </div>
      </div>
    </div>
  );
};
