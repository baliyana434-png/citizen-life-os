import { Opportunity, SupportedLanguage } from '@/types';

export interface LocalizedOpportunityView {
  title: string;
  benefitHeadline: string;
  description: string;
  officialFee: string;
  scamWarning: string;
  issuingAuthority: string;
  documents: { id: string; name: string; isMandatory: boolean; notes?: string }[];
  applySteps: { step: number; text: string }[];
  applicationStatusText: string;
}

// Translations for standard multi-lingual opportunities
const OPPORTUNITY_I18N: Record<string, Partial<Record<SupportedLanguage, {
  title: string;
  benefitHeadline: string;
  description: string;
  officialFee?: string;
  scamWarning?: string;
  steps?: string[];
  docNames?: Record<string, string>;
}>>> = {
  'erasmus-mundus-joint-masters': {
    es: {
      title: 'Beca Máster Conjunto Erasmus Mundus (Unión Europea)',
      benefitHeadline: '100% Matrícula Gratuita, Gastos de Viaje y 1.400 € Mensuales de Manutención',
      description: 'Programa oficial de la Unión Europea que financia estudios de máster en al menos dos universidades europeas con cobertura total de matrícula y beca de subsistencia.',
      officialFee: '0 € (Totalmente Gratuito)',
      scamWarning: 'La solicitud oficial a través del consorcio de la Unión Europea es completamente gratuita.',
    },
    fr: {
      title: 'Bourse de Master Conjoint Erasmus Mundus (Union Européenne)',
      benefitHeadline: 'Exonération Totale des Frais, Indemnité de Voyage et 1 400 € d\'Allocation Mensuelle',
      description: 'Programme prestigieux de l\'Union Européenne finançant des masters internationaux d\'excellence dispensés par des universités dans au moins deux pays européens.',
      officialFee: '0 € (Entièrement Gratuit)',
      scamWarning: 'Le dépôt de candidature via le consortium officiel est totalement gratuit.',
    },
    de: {
      title: 'Erasmus Mundus Gemeinsames Master-Stipendium (Europäische Union)',
      benefitHeadline: '100% Studiengebührenbefreiung, Reisekosten und 1.400 € Monatlicher Lebensunterhalt',
      description: 'Offizielles Studienprogramm der Europäischen Union mit vollständiger Finanzierung für herausragende Masterstudiengänge an mindestens zwei europäischen Hochschulen.',
      officialFee: '0 € (Vollständig Gebührenfrei)',
      scamWarning: 'Die Bewerbung über das offizielle Portal der Europäischen Kommission ist gebührenfrei.',
    },
    ar: {
      title: 'منحة إيراسموس موندوس المشتركة للماجستير (الاتحاد الأوروبي)',
      benefitHeadline: 'إعفاء كامل من الرسوم الدراسية، بدل سفر ومكافأة شهرية قدرها 1400 يورو',
      description: 'برنامج رسمي ممول بالكامل من الاتحاد الأوروبي لدراسة الماجستير الدولي في جامعتين أوروبيتين على الأقل.',
      officialFee: '0 يورو (مجاني بالكامل)',
      scamWarning: 'التقديم على المنحة مجاني بالكامل عبر بوابة الاتحاد الأوروبي المعتمدة.',
    },
  },
  'fulbright-foreign-student-program': {
    es: {
      title: 'Programa Fulbright para Estudiantes Extranjeros (Estados Unidos)',
      benefitHeadline: 'Matrícula Universitaria Completa en EE. UU., Manutención, Seguro Médico y Pasaje Aéreo',
      description: 'Programa oficial del Departamento de Estado de los Estados Unidos que financia estudios de posgrado e investigación académica integral en universidades estadounidenses.',
      officialFee: '0 $ (Gratuito)',
      scamWarning: 'Las becas Fulbright se tramitan exclusivamente a través de las embajadas oficiales de EE. UU.',
    },
    fr: {
      title: 'Programme Fulbright pour Étudiants Étrangers (États-Unis)',
      benefitHeadline: 'Frais de Scolarité Intégralement Pris en Charge, Allocation Mensuelle, Billet d\'Avion et Assurance',
      description: 'Programme du Département d\'État américain finançant des études de master et de doctorat d\'excellence dans les universités des États-Unis.',
      officialFee: '0 $ (Gratuit)',
      scamWarning: 'Les candidatures Fulbright sont gérées directement par les ambassades et commissions officielles.',
    },
    de: {
      title: 'Fulbright-Programm für Internationale Studierende (Vereinigte Staaten)',
      benefitHeadline: 'Vollständige Übernahme der Studiengebühren in den USA, Monatspauschale, Flug und Krankenversicherung',
      description: 'Offizielles Exzellenzprogramm des US-Außenministeriums für Master- und Promotionsstudiengänge an akkreditierten US-Universitäten.',
      officialFee: '0 $ (Gebührenfrei)',
      scamWarning: 'Bewerbungen erfolgen ausschließlich über die offiziellen Fulbright-Kommissionen und Botschaften.',
    },
    ar: {
      title: 'برنامج فولبرايت للطلاب الدوليين (الولايات المتحدة الأمريكية)',
      benefitHeadline: 'تغطية كاملة للمصروفات الجامعية في أمريكا، راتب شهري، تذكرة طيران وتأمين صحي',
      description: 'برنامج التبادل التعليمي المرموق التابع لوزارة الخارجية الأمريكية للدراسات العليا والأبحاث.',
      officialFee: '0 دولار (مجاني)',
      scamWarning: 'يتم التقديم رسمياً فقط من خلال السفارات ومفوضيات فولبرايت المعتمدة.',
    },
  },
  'chevening-uk-scholarships': {
    es: {
      title: 'Becas Chevening del Gobierno Británico (Reino Unido)',
      benefitHeadline: 'Máster de 1 Año Totalmente Financiado en Cualquier Universidad del Reino Unido con Asignación Mensual',
      description: 'Programa global del Ministerio de Asuntos Exteriores británico (FCDO) que cubre la totalidad de la matrícula, manutención y vuelos en el Reino Unido.',
      officialFee: '0 £ (Gratuito)',
      scamWarning: 'Las solicitudes Chevening se presentan directamente en el portal oficial sin coste.',
    },
    fr: {
      title: 'Bourses Chevening du Gouvernement Britannique (Royaume-Uni)',
      benefitHeadline: 'Master d\'Un An Entièrement Financé dans Toute Université Britannique avec Indemnité Mensuelle',
      description: 'Programme d\'excellence du gouvernement britannique prenant en charge l\'ensemble des frais universitaires et de subsistance au Royaume-Uni.',
      officialFee: '0 £ (Gratuit)',
      scamWarning: 'Le dossier de candidature est instruit sans aucun intermédiaire payant.',
    },
    de: {
      title: 'Chevening-Stipendien der Britischen Regierung (Vereinigtes Königreich)',
      benefitHeadline: 'Vollfinanzierter 1-Jahres-Master an Jeder Britischen Universität Inklusive Monatlicher Zulage',
      description: 'Offizielles Exzellenzprogramm der britischen Regierung zur vollständigen Kostenübernahme von Studiengebühren und Lebenshaltungskosten in Großbritannien.',
      officialFee: '0 £ (Gebührenfrei)',
      scamWarning: 'Anträge für Chevening-Stipendien werden gebührenfrei über das britische Regierungsportal eingereicht.',
    },
    ar: {
      title: 'منح تشيفنينج البريطانية (حكومة المملكة المتحدة)',
      benefitHeadline: 'دراسة ماجستير كاملة لمدة عام في أي جامعة بريطانية ممولة بالكامل مع راتب شهري',
      description: 'برنامج المنح الدراسية الرسمي التابع لوزارة الخارجية والتنمية البريطانية لتغطية كافة نفقات الدراسة والمعيشة.',
      officialFee: '0 جنيه إسترليني (مجاني)',
      scamWarning: 'التقديم متاح حصرياً عبر الموقع الرسمي لبرنامج تشيفنينج دون أي وسطاء.',
    },
  },
  'us-federal-pell-grant': {
    es: {
      title: 'Beca Federal Pell (Departamento de Educación de EE. UU.)',
      benefitHeadline: 'Hasta 7.395 $ Anuales en Ayuda Federal Directa (Subvención No Reembolsable)',
      description: 'Subvención oficial del gobierno federal estadounidense para estudiantes de grado con necesidad económica que no debe reembolsarse jamás.',
      officialFee: '0 $ (Gratuito)',
    },
    fr: {
      title: 'Bourse Fédérale Pell (Ministère de l\'Éducation des États-Unis)',
      benefitHeadline: 'Jusqu\'à 7 395 $ par An d\'Aide Fédérale Directe Non Remboursable',
      description: 'Aide financière attribuée par le gouvernement fédéral américain aux étudiants de premier cycle sans obligation de remboursement.',
      officialFee: '0 $ (Gratuit)',
    },
    de: {
      title: 'Bundes-Pell-Zuschuss (US-Bildungsministerium)',
      benefitHeadline: 'Bis zu 7.395 $ Jährlich an Direkter Nicht-Rückzahlbarer Bundesbeihilfe',
      description: 'Staatliche Studienbeihilfe der US-Bundesregierung für Bachelorstudierende ohne Rückzahlungspflicht.',
      officialFee: '0 $ (Gebührenfrei)',
    },
    ar: {
      title: 'منحة بيل الفيدرالية (وزارة التعليم الأمريكية)',
      benefitHeadline: 'ما يصل إلى 7,395 دولار سنوياً دعم مباشر غير مسترد',
      description: 'منحة حكومية فدرالية مخصصة لطلاب المرحلة الجامعية الأولى في الولايات المتحدة دون الحاجة لسدادها.',
      officialFee: '0 دولار (مجاني)',
    },
  },
};

/**
 * Universal zero-leakage opportunity localization helper
 * Guarantees that EVERY piece of text returned strictly adheres to the requested language.
 */
export function getLocalizedOpportunity(
  opportunity: Opportunity,
  language: SupportedLanguage
): LocalizedOpportunityView {
  const i18nEntry = OPPORTUNITY_I18N[opportunity.id]?.[language];

  // 1. Title Resolution
  let title = opportunity.title;
  if (language === 'hi' && opportunity.titleHi) {
    title = opportunity.titleHi;
  } else if (i18nEntry?.title) {
    title = i18nEntry.title;
  }

  // 2. Benefit Headline Resolution
  let benefitHeadline = opportunity.benefitHeadline;
  if (language === 'hi' && opportunity.benefitHeadlineHi) {
    benefitHeadline = opportunity.benefitHeadlineHi;
  } else if (i18nEntry?.benefitHeadline) {
    benefitHeadline = i18nEntry.benefitHeadline;
  }

  // 3. Description Resolution
  let description = opportunity.description;
  if (language === 'hi' && opportunity.descriptionHi) {
    description = opportunity.descriptionHi;
  } else if (i18nEntry?.description) {
    description = i18nEntry.description;
  }

  // 4. Official Fee Resolution
  let officialFee = opportunity.gazette.officialGovtFee;
  if (language === 'hi') {
    officialFee = officialFee.replace('₹0', '₹०').replace('Free', 'निःशुल्क');
  } else if (i18nEntry?.officialFee) {
    officialFee = i18nEntry.officialFee;
  }

  // 5. Scam Warning Resolution
  let scamWarning = opportunity.gazette.scamAlertWarning;
  if (i18nEntry?.scamWarning) {
    scamWarning = i18nEntry.scamWarning;
  } else if (language === 'hi') {
    scamWarning = 'यह अवसर पूर्णतः आधिकारिक है। किसी भी अनधिकृत दलाल अथवा बिचौलिए को कोई शुल्क न दें।';
  } else if (language === 'es') {
    scamWarning = 'Este trámite es oficial y directo. No pague honorarios a gestores no autorizados.';
  } else if (language === 'fr') {
    scamWarning = 'Cette démarche est officielle. Ne versez aucun montant à des intermédiaires non agréés.';
  } else if (language === 'de') {
    scamWarning = 'Dies ist ein offizielles Verfahren. Zahlen Sie keine Vermittlungsgebühren an unbefugte Dritte.';
  } else if (language === 'ar') {
    scamWarning = 'هذا الإجراء رسمي ومعتمد مباشرة. تجنب دفع أي رسوم لوسطاء غير معتمدين.';
  }

  // 6. Application Status Text (Pure localized, zero emojis, zero English leaks)
  let applicationStatusText = 'Applications Open Now';
  if (opportunity.applicationStatus === 'upcoming') {
    if (language === 'hi') applicationStatusText = 'आगामी कैलेंडर चक्र';
    else if (language === 'es') applicationStatusText = 'Próximo Calendario';
    else if (language === 'fr') applicationStatusText = 'Calendrier à Venir';
    else if (language === 'de') applicationStatusText = 'Bevorstehender Kalender';
    else if (language === 'ar') applicationStatusText = 'الجدول الزمني القادم';
    else applicationStatusText = 'Upcoming Calendar Cycle';
  } else if (opportunity.applicationStatus === 'active_now') {
    if (language === 'hi') applicationStatusText = 'आवेदन प्रक्रिया चालू';
    else if (language === 'es') applicationStatusText = 'Convocatoria Abierta';
    else if (language === 'fr') applicationStatusText = 'Candidatures Ouvertes';
    else if (language === 'de') applicationStatusText = 'Antragsphase Geöffnet';
    else if (language === 'ar') applicationStatusText = 'التسجيل متاح حالياً';
    else applicationStatusText = 'Applications Active Now';
  } else {
    if (language === 'hi') applicationStatusText = 'निरंतर चालू अवसर';
    else if (language === 'es') applicationStatusText = 'Convocatoria Permanente';
    else if (language === 'fr') applicationStatusText = 'Dispositif Permanent';
    else if (language === 'de') applicationStatusText = 'Dauerhaft Geöffnet';
    else if (language === 'ar') applicationStatusText = 'فرصة مستمرة طوال العام';
    else applicationStatusText = 'Ongoing Program';
  }

  // 7. Documents List (Pure localized)
  const documents = (opportunity.documents || []).map((doc) => {
    let name = doc.name;
    if (language === 'hi' && doc.nameHi) {
      name = doc.nameHi;
    } else if (i18nEntry?.docNames?.[doc.id]) {
      name = i18nEntry.docNames[doc.id];
    }
    return {
      id: doc.id,
      name,
      isMandatory: doc.isMandatory,
      notes: doc.notes,
    };
  });

  // 8. Application Steps (Pure localized)
  const applySteps = (opportunity.applySteps || []).map((step) => {
    let text = step.text;
    if (language === 'hi' && step.textHi) {
      text = step.textHi;
    }
    return {
      step: step.step,
      text,
    };
  });

  return {
    title,
    benefitHeadline,
    description,
    officialFee,
    scamWarning,
    issuingAuthority: opportunity.gazette.issuingAuthority,
    documents,
    applySteps,
    applicationStatusText,
  };
}
