'use client';

import React, { useState } from 'react';
import { Opportunity } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { getLocalizedOpportunity } from '@/data/localization/opportunityTranslator';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  FileCheck2,
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  Star,
  Clock,
  Target,
  Users,
} from 'lucide-react';
import { VoiceReader } from '../voice/VoiceReader';

interface DetailBottomSheetProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onDownloadKit?: (opp: Opportunity) => void | Promise<void>;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const DetailBottomSheet: React.FC<DetailBottomSheetProps> = ({
  opportunity,
  onClose,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { t, language } = useTranslation();
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  // Lock background scroll when modal is open
  React.useEffect(() => {
    if (opportunity) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [opportunity]);

  if (!opportunity) return null;

  const localized = getLocalizedOpportunity(opportunity, language);

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Centered Modal Container */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] z-10 overflow-hidden my-auto transition-all transform animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. Header with Close Button */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-50 rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                {t('official_verified')}
              </span>
              <VoiceReader textToSpeak={`${localized.title}. ${localized.benefitHeadline}`} />
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-snug">
              {localized.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(opportunity.id)}
                className={`p-2 rounded-xl border transition-all ${
                  isFavorite
                    ? 'bg-amber-100 text-amber-500 border-amber-300'
                    : 'bg-white text-slate-400 hover:text-amber-500 border-slate-200'
                }`}
                title={t('subfilters.favorites')}
                aria-label="Toggle Favorite"
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label={t('drawer.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 overscroll-contain">
          
          {/* A. Official Gazette & Authority Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>{localized.issuingAuthority}</span>
            </div>
            <div className="text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>{t('card.circular_no')}: <strong>{opportunity.gazette.circularNumber}</strong></span>
              <span>{opportunity.gazette.lastVerifiedAt}</span>
              <span>{t('card.official_fee')}: <strong className="text-emerald-800">{localized.officialFee}</strong></span>
              {opportunity.targetAges && (
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('hero.age_label')}: <strong>{opportunity.targetAges[0]} - {opportunity.targetAges[1]} {t('hero.years_suffix')}</strong></span>
                </span>
              )}
              {opportunity.genderEligibility === 'female' && (
                <span className="text-rose-700 font-bold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t('onboarding.female')}</span>
                </span>
              )}
            </div>
          </div>

          {/* A2. Application Status Banner */}
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-semibold ${
            opportunity.applicationStatus === 'active_now'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : opportunity.applicationStatus === 'upcoming'
              ? 'bg-blue-50 border-blue-200 text-blue-950'
              : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}>
            <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
              opportunity.applicationStatus === 'active_now'
                ? 'bg-emerald-600'
                : opportunity.applicationStatus === 'upcoming'
                ? 'bg-blue-600'
                : 'bg-slate-500'
            }`} />
            <div>
              <strong className="block text-xs font-bold mb-0.5">
                {localized.applicationStatusText}
              </strong>
              <span className="text-[11px] font-normal leading-relaxed block">
                {opportunity.applicationStatus === 'active_now'
                  ? t('drawer.status_active_desc')
                  : opportunity.applicationStatus === 'upcoming'
                  ? t('drawer.status_upcoming_desc')
                  : t('drawer.status_ongoing_desc')}
              </span>
            </div>
          </div>

          {/* B. Anti-Cheat & Scam Protection Box */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 mb-1">
                  {t('drawer.scam_alert_title')}
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {localized.scamWarning}
                </p>
              </div>
            </div>
          </div>

          {/* C. Benefit Summary */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              {t('drawer.benefit_details')}
            </h3>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-950">
              {localized.benefitHeadline}
            </div>
          </div>

          {/* D. Official Description */}
          <div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {localized.description}
            </p>
          </div>

          {/* E. Required Documents Checklist */}
          {localized.documents && localized.documents.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>{t('drawer.required_documents')}</span>
              </h3>
              <div className="space-y-1.5">
                {localized.documents.map((doc) => (
                  <label
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedDocs[doc.id]}
                      onChange={() => {}}
                      className="mt-0.5 w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-slate-800">
                        {doc.name}
                      </span>
                      {doc.isMandatory && (
                        <span className="ml-2 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                          {t('drawer.mandatory')}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* F. Step-by-Step Application Process */}
          {localized.applySteps && localized.applySteps.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                {t('drawer.apply_steps')}
              </h3>
              <div className="space-y-2">
                {localized.applySteps.map((step) => (
                  <div
                    key={step.step}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      {step.step}
                    </span>
                    <span className="text-slate-700 leading-relaxed font-medium">
                      {step.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Bottom Sticky Action Hub */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <a
            href={opportunity.gazette.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span>{t('drawer.official_portal_btn')}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
          >
            {t('drawer.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
