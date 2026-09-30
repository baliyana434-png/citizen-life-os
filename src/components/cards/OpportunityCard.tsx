'use client';

import React from 'react';
import { Opportunity, CitizenProfile } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { getLocalizedOpportunity } from '@/data/localization/opportunityTranslator';
import { ShieldCheck, Calendar, ArrowRight, Star, Clock, CheckCircle2, Banknote } from 'lucide-react';
import { VoiceReader } from '../voice/VoiceReader';
import { RotatingNewBadge } from '../common/RotatingNewBadge';
import { generateGoogleCalendarUrl } from '@/lib/calendar';
import { evaluateCitizenEligibility } from '@/lib/eligibility';
import { formatDeadlineText } from '@/lib/dateUtils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opp: Opportunity) => void;
  onShareWhatsApp?: (opp: Opportunity) => void;
  citizenProfile?: CitizenProfile | null;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
  citizenProfile,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { t, language } = useTranslation();
  const localized = getLocalizedOpportunity(opportunity, language);
  const eligibility = evaluateCitizenEligibility(opportunity, citizenProfile);

  const formattedDeadline = formatDeadlineText(
    opportunity.deadline,
    opportunity.daysRemaining,
    language,
    t('card.days_left')
  );

  const handleAddToCalendar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateGoogleCalendarUrl(
      opportunity,
      localized.title,
      localized.issuingAuthority
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Dynamic category top border accent
  const getCategoryAccent = () => {
    switch (opportunity.lifeStage) {
      case 'exams':
        return 'from-blue-600 to-indigo-600';
      case 'private_jobs':
      case 'career':
        return 'from-violet-600 to-purple-600';
      case 'health':
        return 'from-rose-500 to-teal-500';
      case 'education':
      case 'internships':
        return 'from-amber-500 to-emerald-600';
      case 'schemes':
      default:
        return 'from-emerald-600 to-teal-600';
    }
  };

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className="group relative card-3d rounded-3xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer border border-slate-200/90 hover:border-emerald-500/50 transition-all duration-300 h-full overflow-hidden"
    >
      {/* 3D Top Accent Glow Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getCategoryAccent()} opacity-75 group-hover:opacity-100 transition-opacity`} />

      {/* Red Rotating Badge */}
      {opportunity.isNew && (
        <div className="absolute -top-3.5 -left-2 z-10 pointer-events-none">
          <RotatingNewBadge size="md" />
        </div>
      )}

      {/* Top Content Block */}
      <div>
        {/* 1. Authority Badge & Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          {/* Issuing Authority Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-slate-800 text-[11px] font-bold min-w-0 max-w-[65%]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">
              {localized.issuingAuthority.split('(')[0].trim()}
            </span>
          </div>

          {/* Status Badge & Star */}
          <div className="shrink-0 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold border whitespace-nowrap shrink-0 ${
              opportunity.applicationStatus === 'active_now'
                ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                : opportunity.applicationStatus === 'upcoming'
                ? 'bg-blue-50 text-blue-950 border-blue-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {opportunity.applicationStatus === 'active_now' ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 radar-pulse" />
              ) : (
                <Calendar className="w-3 h-3 text-slate-600 shrink-0" />
              )}
              <span>{localized.applicationStatusText}</span>
            </span>

            {/* Star Favorite Button */}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(opportunity.id);
                }}
                className={`p-1.5 rounded-xl border transition-all ${
                  isFavorite
                    ? 'bg-amber-100 text-amber-500 border-amber-300 hover:bg-amber-200'
                    : 'bg-slate-50 text-slate-400 hover:text-amber-500 hover:bg-amber-50 border-slate-200'
                }`}
                title={t('subfilters.favorites')}
                aria-label="Favorite"
              >
                <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* 1B. Citizen Eligibility Match Indicator */}
        {citizenProfile?.isOnboarded && eligibility.isEligible && (
          <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-300/80 text-emerald-950 text-[11px] font-extrabold shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{t('card.eligible_100')} • {t('card.eligible_age_match')}</span>
          </div>
        )}

        {/* 2. Title & Speech Reader */}
        <div className="mb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-emerald-900 transition-colors line-clamp-2 min-h-[2.5rem]">
              {localized.title}
            </h3>
            <div className="shrink-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
              <VoiceReader textToSpeak={`${localized.title}. ${localized.benefitHeadline}`} />
            </div>
          </div>
        </div>

        {/* 3. Benefit Headline */}
        <div className="mb-3 p-2.5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/50 border border-emerald-200/80">
          <span className="text-xs font-bold text-emerald-950 block leading-snug">
            {localized.benefitHeadline}
          </span>
        </div>

        {/* 4. Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {localized.description}
        </p>
      </div>

      {/* 5. Footer Details & Actions (Crash-Proof 2-Row Layout) */}
      <div className="pt-3 border-t border-slate-100 mt-auto space-y-2.5">
        {/* Row A: Deadline Date Pill & 100% Free Badge */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold text-[11px] truncate max-w-[70%]">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{formattedDeadline}</span>
          </div>

          {opportunity.is100PercentFree ? (
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[10px] border border-emerald-300">
              {language === 'hi' ? '100% निःशुल्क' : '100% Free'}
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t('card.official_fee')}
            </span>
          )}
        </div>

        {/* Row B: Official Fee Full-Width Card (Never overlaps or collides) */}
        <div className="p-2 rounded-xl bg-slate-50/90 border border-slate-200/80 text-[11px] text-slate-700 flex items-start gap-1.5 leading-snug">
          <Banknote className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
          <span className="font-semibold text-slate-800 break-words flex-1">
            {localized.officialFee}
          </span>
        </div>

        {/* Row C: Action Buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={() => onSelect(opportunity)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99]"
          >
            <span>{t('card.view_details')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* 1-Click Google Calendar Reminder Button */}
          <button
            onClick={handleAddToCalendar}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer flex items-center justify-center shrink-0 active:scale-95"
            title={t('card.add_calendar')}
            aria-label="Add Deadline to Google Calendar"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
