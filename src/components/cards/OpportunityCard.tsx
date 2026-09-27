'use client';

import React from 'react';
import { Opportunity } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { getLocalizedOpportunity } from '@/data/localization/opportunityTranslator';
import { ShieldCheck, Calendar, ArrowRight, Share2, Star, Clock } from 'lucide-react';
import { VoiceReader } from '../voice/VoiceReader';
import { RotatingNewBadge } from '../common/RotatingNewBadge';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opp: Opportunity) => void;
  onShareWhatsApp: (opp: Opportunity) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
  onShareWhatsApp,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { t, language } = useTranslation();
  const localized = getLocalizedOpportunity(opportunity, language);

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Red Rotating Badge */}
      {opportunity.isNew && (
        <div className="absolute -top-3.5 -left-2 z-10 pointer-events-none">
          <RotatingNewBadge size="md" />
        </div>
      )}

      {/* 1. Header Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {/* Issuing Authority Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold min-w-0 max-w-[60%]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">
              {localized.issuingAuthority.split('(')[0].trim()}
            </span>
          </div>

          {/* Status Badge & Star */}
          <div className="shrink-0 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap shrink-0 ${
              opportunity.applicationStatus === 'active_now'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : opportunity.applicationStatus === 'upcoming'
                ? 'bg-blue-50 text-blue-900 border-blue-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {opportunity.applicationStatus === 'active_now' ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
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

        {/* 2. Title & Speech Reader */}
        <div className="mb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug group-hover:text-emerald-950 transition-colors">
              {localized.title}
            </h3>
            <div className="shrink-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
              <VoiceReader textToSpeak={`${localized.title}. ${localized.benefitHeadline}`} />
            </div>
          </div>
        </div>

        {/* 3. Benefit Headline */}
        <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <span className="text-xs font-bold text-emerald-900 block leading-snug">
            {localized.benefitHeadline}
          </span>
        </div>

        {/* 4. Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {localized.description}
        </p>
      </div>

      {/* 5. Footer Details & Actions */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {opportunity.daysRemaining && opportunity.daysRemaining > 0
                ? `${opportunity.daysRemaining} ${t('card.days_left')}`
                : opportunity.deadline}
            </span>
          </div>

          <span className="font-bold text-emerald-800">
            {localized.officialFee}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(opportunity)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>{t('card.view_details')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShareWhatsApp(opportunity);
            }}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
            title={t('card.share_whatsapp')}
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
