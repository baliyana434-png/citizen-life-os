'use client';

import React from 'react';
import { Opportunity, CitizenProfile } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { getLocalizedOpportunity } from '@/data/localization/opportunityTranslator';
import { ShieldCheck, Calendar, ArrowRight, Star, Clock, Banknote, Lock } from 'lucide-react';
import { VoiceReader } from '../voice/VoiceReader';
import { RotatingNewBadge } from '../common/RotatingNewBadge';
import { generateGoogleCalendarUrl } from '@/lib/calendar';
import { formatDeadlineText } from '@/lib/dateUtils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opp: Opportunity) => void;
  onShareWhatsApp?: (opp: Opportunity) => void;
  citizenProfile?: CitizenProfile | null;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onRequireSubscription?: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
  citizenProfile,
  isFavorite = false,
  onToggleFavorite,
  onRequireSubscription,
}) => {
  const { t, language } = useTranslation();
  const localized = getLocalizedOpportunity(opportunity, language);
  const isSubscribed = citizenProfile?.subscription?.status === 'active';

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

  return (
    <div
      onClick={() => {
        if (!isSubscribed) {
          onRequireSubscription?.();
        } else {
          onSelect(opportunity);
        }
      }}
      className="group relative bg-white rounded-3xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer border border-slate-200/90 hover:border-emerald-500/60 shadow-xs hover:shadow-lg transition-all duration-200 h-full overflow-visible"
    >
      {/* Red Rotating Starburst Badge (100% Visible, Never Clipped) */}
      {opportunity.isNew && (
        <div className="absolute -top-3.5 -left-2.5 z-20 pointer-events-none">
          <RotatingNewBadge size="md" />
        </div>
      )}

      {/* Top Content Block */}
      <div>
        {/* 1. Header: Issuing Authority Badge (Left) & Star Favorite Button (Right) */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          {/* Issuing Authority Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold min-w-0 max-w-[70%]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className={`truncate ${!isSubscribed ? 'filter blur-[5px] select-none pointer-events-none opacity-50' : ''}`}>
              {(localized.issuingAuthority || 'Official Authority').split('(')[0].trim()}
            </span>
          </div>

          {/* Star Favorite Button */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(opportunity.id);
              }}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
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

        {/* 1B. Second Row: Status Badge & Pass Lock */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Status Badge */}
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

          {/* 1-Year Pass Badge if Not Subscribed */}
          {!isSubscribed && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequireSubscription?.();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-[10px] sm:text-[11px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              title={language === 'hi' ? 'पास आवश्यक • अनलॉक करने हेतु क्लिक करें' : 'Pass Required • Click to Unlock'}
            >
              <Lock className="w-3 h-3 text-amber-600 shrink-0" />
              <span>{language === 'hi' ? 'पास आवश्यक' : 'Pass Required'}</span>
            </button>
          )}
        </div>

        {/* 2. Title & Speech Reader */}
        <div className="mb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-emerald-900 transition-colors line-clamp-2 min-h-[2.6rem] ${
              !isSubscribed ? 'filter blur-[6px] select-none pointer-events-none opacity-40' : ''
            }`}>
              {localized.title}
            </h3>
            <div className="shrink-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
              <VoiceReader textToSpeak={isSubscribed ? `${localized.title}. ${localized.benefitHeadline}` : `${language === 'hi' ? 'अवसर विवरण देखने हेतु 1-वर्षीय नागरिक पास केवल 19 रुपये में सक्रिय करें' : 'Activate 1-Year Citizen Pass for 19 rupees to unlock opportunity details'}`} />
            </div>
          </div>
        </div>

        {/* 3. Benefit Headline Box */}
        <div className="mb-3 p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
          <span className="text-xs font-bold text-emerald-950 block leading-snug">
            {localized.benefitHeadline}
          </span>
        </div>

        {/* 4. Description */}
        <p className={`text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 ${
          !isSubscribed ? 'filter blur-[4px] select-none pointer-events-none opacity-50' : ''
        }`}>
          {localized.description}
        </p>
      </div>

      {/* 5. Footer Details & Actions (Crash-Proof 2-Row Layout, Never Touching) */}
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
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-700 flex items-start gap-2 leading-snug">
          <Banknote className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
          <span className="font-semibold text-slate-800 break-words flex-1">
            {localized.officialFee}
          </span>
        </div>

        {/* Row C: Action Buttons (Explicit Heights & Generous Gap) */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isSubscribed) {
                onRequireSubscription?.();
              } else {
                onSelect(opportunity);
              }
            }}
            className={`flex-1 h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-sm cursor-pointer ${
              isSubscribed
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white border border-emerald-400/40 font-extrabold'
            }`}
          >
            {isSubscribed ? (
              <>
                <span>{t('card.view_details')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'hi' ? 'अनलॉक करें (पास ₹19)' : 'Unlock (Pass ₹19)'}</span>
              </>
            )}
          </button>

          {/* 1-Click Google Calendar Reminder Button (Clean Separated Box) */}
          <button
            onClick={handleAddToCalendar}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
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
