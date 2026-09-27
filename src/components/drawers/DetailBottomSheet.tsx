'use client';

import React, { useState } from 'react';
import { Opportunity } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
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
  Sparkles,
  Star
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

  const title = language === 'hi' ? opportunity.titleHi : opportunity.title;
  const benefit = language === 'hi' ? opportunity.benefitHeadlineHi : opportunity.benefitHeadline;
  const description = language === 'hi' ? opportunity.descriptionHi : opportunity.description;

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/65 backdrop-blur-md animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Centered Modal Container */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col max-h-[90vh] z-10 overflow-hidden my-auto transition-all transform animate-in fade-in zoom-in-95 duration-200">
        {/* 1. Header with Close Button */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between gap-3 bg-slate-50/80 rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                {t('official_verified')}
              </span>
              <VoiceReader textToSpeak={`${title}. ${benefit}`} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(opportunity.id)}
                className={`p-2 rounded-xl border transition-all ${
                  isFavorite
                    ? 'bg-amber-100 text-amber-500 border-amber-300 hover:bg-amber-200 ring-2 ring-amber-400/50 shadow-2xs'
                    : 'bg-white text-slate-400 hover:text-amber-500 hover:bg-amber-50 border-slate-200 hover:border-amber-300'
                }`}
                title={
                  isFavorite
                    ? (language === 'hi' ? 'पसंदीदा से हटाएं' : 'Remove from Favorites')
                    : (language === 'hi' ? 'पसंदीदा में जोड़ें (आगामी सूचना हेतु)' : 'Save to Favorites (Track updates)')
                }
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
          <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>{opportunity.gazette.issuingAuthority}</span>
            </div>
            <div className="text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>{t('card.circular_no')}: <strong>{opportunity.gazette.circularNumber}</strong></span>
              <span>{opportunity.gazette.lastVerifiedAt}</span>
              <span>{t('card.official_fee')}: <strong className="text-emerald-700">{opportunity.gazette.officialGovtFee}</strong></span>
              {opportunity.targetAges && (
                <span>🎯 {language === 'hi' ? 'पात्र आयु:' : 'Eligible Age:'} <strong className="text-slate-800">{opportunity.targetAges[0]} - {opportunity.targetAges[1]} {language === 'hi' ? 'वर्ष' : 'Years'}</strong></span>
              )}
              {opportunity.genderEligibility === 'female' && (
                <span className="text-rose-700 font-bold">👩 {language === 'hi' ? 'पात्रता: केवल महिलाएं' : 'Eligibility: Women Only'}</span>
              )}
            </div>
          </div>

          {/* A2. Official Application Cycle / Portal Status Banner */}
          {opportunity.applicationStatus === 'active_now' ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300/80 flex items-start gap-2.5 text-xs text-emerald-950 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0"></span>
              <div>
                <strong className="block text-emerald-900 font-bold">
                  {language === 'hi' ? '🟢 आधिकारिक पोर्टल पर आवेदन प्रक्रिया चालू है' : '🟢 Online Application Active on Official Portal'}
                </strong>
                <span>
                  {language === 'hi'
                    ? 'संबंधित आधिकारिक आयोग/विभाग की वेबसाइट पर वर्तमान में ऑनलाइन फॉर्म एवं शुल्क भुगतान विंडो खुली हुई है।'
                    : 'The online registration and fee payment window is currently active on the official department portal.'}
                </span>
              </div>
            </div>
          ) : opportunity.applicationStatus === 'upcoming' ? (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-950">
              <Calendar className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
              <div>
                <strong className="block text-blue-900 font-bold">
                  {language === 'hi' ? '📅 वार्षिक परीक्षा कैलेंडर चक्र (Upcoming Notification Cycle)' : '📅 Official Examination Calendar Cycle'}
                </strong>
                <span className="text-blue-800">
                  {language === 'hi'
                    ? 'यह भर्ती/परीक्षा वर्तमान में आयोग के वार्षिक परीक्षा कैलेंडर में सूचीबद्ध है। आयोग द्वारा आधिकारिक आवेदन फॉर्म विंडो खुलते ही लिंक सीधे सक्रिय हो जाएगा।'
                    : 'This opportunity is currently scheduled under the Commission’s Annual Examination Calendar. The direct application form link will open as per the scheduled notification window.'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800">
              <Building2 className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
              <div>
                <strong className="block text-slate-900 font-bold">
                  {opportunity.category === 'govt_scheme' || opportunity.category === 'govt_job'
                    ? (language === 'hi' ? '🏛️ निरंतर चालू सरकारी योजना (Ongoing Round)' : '🏛️ Year-Round Government Service')
                    : (language === 'hi' ? '⚡ निरंतर चालू अवसर (Ongoing Open Round)' : '⚡ Ongoing Open Opportunity')}
                </strong>
                <span className="text-slate-600">
                  {language === 'hi'
                    ? 'यह अवसर/डिजिटल सेवा पूरे वर्ष भर निरंतर खुली रहती है। आप कभी भी सीधे आवेदन या लाभ प्राप्त कर सकते हैं।'
                    : 'This opportunity or digital service operates round the year with no closing date.'}
                </span>
              </div>
            </div>
          )}

          {/* B. Anti-Cheat & Scam Protection Box */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300/80 shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-900 mb-1">
                  {t('drawer.scam_alert_title')}
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {opportunity.gazette.scamAlertWarning}
                </p>
              </div>
            </div>
          </div>

          {/* C. Benefit Summary */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t('drawer.benefit_details')}</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-950">
              {benefit}
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              {description}
            </p>
          </div>

          {/* D. Required Documents Checklist (Interactive) */}
          {opportunity.documents.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>{t('drawer.required_documents')}</span>
              </h3>
              <div className="space-y-2">
                {opportunity.documents.map((doc) => {
                  const isChecked = !!checkedDocs[doc.id];
                  const docName = language === 'hi' ? doc.nameHi : doc.name;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span>{docName}</span>
                      </div>
                      {doc.isMandatory && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          {t('drawer.mandatory')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* E. Step-by-Step Application Guide */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-slate-700" />
              <span>{t('drawer.apply_steps')}</span>
            </h3>
            <div className="space-y-2.5">
              {opportunity.applySteps.map((step) => {
                const stepText = language === 'hi' ? step.textHi : step.text;
                return (
                  <div key={step.step} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 text-xs border border-slate-300">
                      {step.step}
                    </span>
                    <p className="pt-0.5">{stepText}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Action Footer (Direct Official Portal - Zero Broker Guarantee) */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white shadow-lg rounded-b-3xl">
          {/* Direct Official Government Portal Link */}
          <a
            href={opportunity.gazette.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>{t('drawer.official_portal_btn')}</span>
            <ExternalLink className="w-4 h-4 text-emerald-100 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
