'use client';

import React from 'react';
import { Opportunity } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { ShieldCheck, Calendar, ArrowRight, Share2, Sparkles, AlertCircle, Star } from 'lucide-react';
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

  const title = language === 'hi' ? opportunity.titleHi : opportunity.title;
  const benefit = language === 'hi' ? opportunity.benefitHeadlineHi : opportunity.benefitHeadline;
  const description = language === 'hi' ? opportunity.descriptionHi : opportunity.description;

  return (
    <div
      onClick={() => onSelect(opportunity)}
      className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-emerald-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* 0. Top-Left Red Rotating Starburst Sticker Badge (Zero Glow, Smooth Slow Rotation) */}
      {opportunity.isNew && (
        <div className="absolute -top-3.5 -left-2 z-10 pointer-events-none">
          <RotatingNewBadge size="md" />
        </div>
      )}

      {/* 1. Header Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {/* Official Verification Authority Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold min-w-0 max-w-[55%]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">
              {opportunity.gazette.issuingAuthority.split('(')[0].trim()}
            </span>
          </div>

          {/* Real Government Application Status Badge & Star Button */}
          <div className="shrink-0 flex items-center gap-1.5">
            {opportunity.applicationStatus === 'active_now' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>{language === 'hi' ? 'आवेदन चालू है' : 'Form Active Now'}</span>
              </span>
            )}
            {opportunity.applicationStatus === 'upcoming' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-200 whitespace-nowrap shrink-0">
                <Calendar className="w-3 h-3 text-blue-600 shrink-0" />
                <span>{language === 'hi' ? 'कैलेंडर चक्र (Upcoming)' : 'Upcoming Cycle'}</span>
              </span>
            )}
            {(!opportunity.applicationStatus || opportunity.applicationStatus === 'ongoing') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap shrink-0">
                <span>{language === 'hi' ? 'सदा चालू' : 'Ongoing'}</span>
              </span>
            )}

            {/* Quick Star / Favourite Button */}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(opportunity.id);
                }}
                className={`p-1.5 rounded-xl border transition-all ${
                  isFavorite
                    ? 'bg-amber-100 text-amber-500 border-amber-300 hover:bg-amber-200 shadow-2xs'
                    : 'bg-slate-50 text-slate-400 hover:text-amber-500 hover:bg-amber-50 border-slate-200 hover:border-amber-300'
                }`}
                title={
                  isFavorite
                    ? (language === 'hi' ? 'पसंदीदा से हटाएं' : 'Remove from Favourites')
                    : (language === 'hi' ? 'पसंदीदा में रखें (आगामी सूचना हेतु)' : 'Save to Favourites (Track upcoming updates)')
                }
                aria-label="Star Favorite"
              >
                <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* 2. Title & Speech Reader */}
        <div className="mb-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
            {title}
          </h3>
        </div>

        {/* 3. Highlighted Benefit Pill */}
        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 mb-2">
          <p className="text-xs sm:text-sm font-semibold text-emerald-950 flex items-start gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{benefit}</span>
          </p>
        </div>

        {/* 3B. Strict Age Eligibility & Gender Badge */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {opportunity.targetAges && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
              🎯 {language === 'hi' ? 'पात्र आयु:' : 'Eligible Age:'} {opportunity.targetAges[0]} - {opportunity.targetAges[1]} {language === 'hi' ? 'वर्ष' : 'Yrs'}
            </span>
          )}
          {opportunity.genderEligibility === 'female' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
              👩 {language === 'hi' ? 'केवल महिलाओं हेतु' : 'Women Only'}
            </span>
          )}
        </div>

        {/* 4. Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
          {description}
        </p>
      </div>

      {/* 5. Footer: Fee, Voice Reader, Share & Action */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2">
          {/* Voice Reader */}
          <VoiceReader textToSpeak={`${title}. ${benefit}.`} />

          {/* Govt Fee indicator */}
          <span className="text-[11px] text-slate-500 font-medium">
            {t('card.official_fee')}: <strong className="text-slate-700">{opportunity.gazette.officialGovtFee}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* WhatsApp Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShareWhatsApp(opportunity);
            }}
            className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
            title={t('card.share_whatsapp')}
            aria-label={t('card.share_whatsapp')}
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* View Details Button */}
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold group-hover:bg-emerald-700 transition-colors shadow-sm">
            <span>{t('card.view_details')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
