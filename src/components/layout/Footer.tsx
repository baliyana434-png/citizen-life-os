'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, ShieldCheck, PhoneCall, Star, FileText, FileCheck } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

export const Footer: React.FC = () => {
  const { t, language } = useTranslation();

  return (
    <footer className="w-full bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        
        {/* 1. Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Identity & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-sm">
                <Landmark className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                {t('app_name')}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {language === 'hi'
                ? 'नागरिकों, विद्यार्थियों, युवाओं एवं पेशेवरों के लिए सरकारों एवं मान्यता प्राप्त संस्थानों के प्रामाणिक अवसरों, योजनाओं व छात्रवृत्तियों का स्वतंत्र नागरिक-तकनीकी सूचना पोर्टल।'
                : language === 'es'
                ? 'Portal cívico independiente de información sobre becas, oportunidades laborales y subvenciones públicas oficiales para ciudadanos.'
                : language === 'fr'
                ? 'Portail civique indépendant d\'accès aux opportunités nationales, bourses d\'études et concours administratifs officiels.'
                : language === 'de'
                ? 'Unabhängiges Portal für amtliche Fördermittel, Bildungsstipendien und öffentliche Ausschreibungen für Bürger.'
                : language === 'ar'
                ? 'بوابة مدنية مستقلة للاطلاع على الفرص الحكومية والمنح الدراسية المعتمدة والخدمات العامة للمواطنين.'
                : 'Independent civic-tech portal providing verified national and global opportunities, scholarships, exams, and government schemes.'}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'hi'
                  ? 'शून्य दलाली एवं सीधा आधिकारिक आवेदन'
                  : language === 'es'
                  ? 'Sin intermediarios ni costes de gestión'
                  : language === 'fr'
                  ? 'Sans intermédiaires • Dépôt direct officiel'
                  : language === 'de'
                  ? 'Ohne Vermittler • Direkter amtlicher Antrag'
                  : language === 'ar'
                  ? 'تقديم رسمي مباشر بدون أي وسطاء'
                  : 'Zero Middlemen • Direct Official Applications'}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {language === 'hi'
                ? 'त्वरित लिंक'
                : language === 'es'
                ? 'Enlaces Rápidos'
                : language === 'fr'
                ? 'Accès Rapide'
                : language === 'de'
                ? 'Direktlinks'
                : language === 'ar'
                ? 'روابط سريعة'
                : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>•</span>
                  <span>{t('tabs.schemes')}</span>
                </Link>
              </li>
              <li>
                <Link href="/helpline" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <PhoneCall className="w-3 h-3 text-red-400" />
                  <span>
                    {language === 'hi'
                      ? 'नागरिक हेल्पलाइन'
                      : language === 'es'
                      ? 'Líneas de Atención'
                      : language === 'fr'
                      ? 'Assistance Téléphonique'
                      : language === 'de'
                      ? 'Bürger-Hotlines'
                      : language === 'ar'
                      ? 'أرقام الطوارئ والمساعدة'
                      : 'Citizen Helplines'}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/saved" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-400" />
                  <span>{t('subfilters.favorites')}</span>
                </Link>
              </li>
              <li>
                <Link href="/forms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-blue-400" />
                  <span>
                    {language === 'hi'
                      ? 'आधिकारिक प्रपत्र डाउनलोड'
                      : language === 'es'
                      ? 'Formularios Oficiales'
                      : language === 'fr'
                      ? 'Formulaires Officiels'
                      : language === 'de'
                      ? 'Amtliche Formulare'
                      : language === 'ar'
                      ? 'نماذج التقديم الرسمية'
                      : 'Official PDF Forms'}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {language === 'hi'
                ? 'कानूनी नीतियां'
                : language === 'es'
                ? 'Aviso Legal'
                : language === 'fr'
                ? 'Informations Légales'
                : language === 'de'
                ? 'Rechtliches'
                : language === 'ar'
                ? 'الشروط القانونية'
                : 'Legal & Policies'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>
                    {language === 'hi'
                      ? 'गोपनीयता नीति'
                      : language === 'es'
                      ? 'Política de Privacidad'
                      : language === 'fr'
                      ? 'Politique de Confidentialité'
                      : language === 'de'
                      ? 'Datenschutzerklärung'
                      : language === 'ar'
                      ? 'سياسة الخصوصية'
                      : 'Privacy Policy'}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <FileCheck className="w-3 h-3 text-emerald-400" />
                  <span>
                    {language === 'hi'
                      ? 'नियम एवं शर्तें'
                      : language === 'es'
                      ? 'Términos del Servicio'
                      : language === 'fr'
                      ? 'Conditions d\'Utilisation'
                      : language === 'de'
                      ? 'Nutzungsbedingungen'
                      : language === 'ar'
                      ? 'شروط الاستخدام'
                      : 'Terms of Service'}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Landmark className="w-3 h-3 text-amber-400" />
                  <span>
                    {language === 'hi'
                      ? 'आधिकारिक अस्वीकरण'
                      : language === 'es'
                      ? 'Descargo de Responsabilidad'
                      : language === 'fr'
                      ? 'Avertissement Légal'
                      : language === 'de'
                      ? 'Haftungsausschluss'
                      : language === 'ar'
                      ? 'إخلاء المسؤولية'
                      : 'Official Disclaimer'}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. Mandatory Disclaimer Notice Bar */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] leading-relaxed text-slate-400 space-y-1">
          <strong className="text-white block font-bold">
            {language === 'hi'
              ? 'अनिवार्य गैर-सरकारी घोषणा एवं सूचना:'
              : language === 'es'
              ? 'Aviso Oficial de Plataforma No Gubernamental:'
              : language === 'fr'
              ? 'Déclaration Officielle de Non-Affiliation Publique :'
              : language === 'de'
              ? 'Hinweis auf Nicht-Staatliche Unabhängigkeit :'
              : language === 'ar'
              ? 'إقرار رسمي بعدم التبعية الحكومية المباشرة :'
              : 'Mandatory Non-Government Civic Notice:'}
          </strong>
          <p>
            {language === 'hi'
              ? 'Citizen Life OS एक स्वतंत्र नागरिक-तकनीकी सूचना मंच है और किसी भी सरकारी निकाय का प्रतिनिधित्व नहीं करता है। सभी योजनाएं, परीक्षाएं एवं सूचनाएं आधिकारिक राजपत्रों एवं संबंधित मंत्रालयों के सार्वजनिक पोर्टलों से सत्यापित की जाती हैं। आधिकारिक आवेदन केवल संबंधित विभागों के मूल पोर्टल पर ही करें।'
              : language === 'es'
              ? 'Citizen Life OS es una plataforma cívica independiente y no representa a ninguna entidad gubernamental. Toda la información procede de boletines y portales oficiales del Estado.'
              : language === 'fr'
              ? 'Citizen Life OS est un service civique indépendant ne représentant aucune autorité publique. Les informations proviennent directement des journaux et portals officiels.'
              : language === 'de'
              ? 'Citizen Life OS ist eine unabhängige Plattform und vertritt keine staatliche Behörde. Alle Angaben stammen aus amtlichen Veröffentlichungen.'
              : language === 'ar'
              ? 'بوابة المواطن الرقمية منصة تقنية مستقلة ولا تمثل أي جهة حكومية. جميع البيانات مستخرجة من المصادر الرسمية المعتمدة.'
              : 'Citizen Life OS is an independent civic-tech portal and does not represent any government entity. All opportunities, exams, and schemes are aggregated from publicly available official gazettes and ministry portals.'}
          </p>
        </div>

        {/* 3. Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Citizen Life OS. {t('auth.verification_success')}.</p>
          <p>
            {language === 'hi' ? 'भारतीय एवं अंतरराष्ट्रीय नागरिकों के लिए समर्पित।' : 'Designed for national and global citizens.'}
          </p>
        </div>
      </div>
    </footer>
  );
};
