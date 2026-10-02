'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CountryCode } from '@/types';

export interface SocialCategoryOption {
  id: string;
  label: string;
  labelHi: string;
  desc?: string;
  descHi?: string;
}

export interface CountryMeta {
  code: CountryCode;
  alpha3: string;
  name: string;
  nativeName: string;
  flag: string;
  currencySymbol: string;
  currencyCode: string;
  nationalIdName: string;
  nationalIdPlaceholder: string;
  administrativeLabel: string;
  divisions: string[];
  hasCasteSystem: boolean;
  categoryLabel: string;
  categoryLabelHi: string;
  socialCategories: SocialCategoryOption[];
}

export const COUNTRIES: Record<CountryCode, CountryMeta> = {
  IN: {
    code: 'IN',
    alpha3: 'IND',
    name: 'India',
    nativeName: 'भारत',
    flag: '🇮🇳',
    currencySymbol: '₹',
    currencyCode: 'INR',
    nationalIdName: 'Aadhaar Card',
    nationalIdPlaceholder: '12-Digit Aadhaar (UIDAI)',
    administrativeLabel: 'State / Union Territory',
    divisions: [
      'Uttar Pradesh',
      'Maharashtra',
      'Bihar',
      'West Bengal',
      'Madhya Pradesh',
      'Tamil Nadu',
      'Rajasthan',
      'Karnataka',
      'Gujarat',
      'Andhra Pradesh',
      'Odisha',
      'Telangana',
      'Kerala',
      'Jharkhand',
      'Assam',
      'Punjab',
      'Haryana',
      'Delhi NCR',
      'Jammu & Kashmir',
      'Uttarakhand',
      'Himachal Pradesh',
      'Other States / UTs',
    ],
    hasCasteSystem: true,
    categoryLabel: 'Caste / Social Category (India)',
    categoryLabelHi: 'जाति वर्ग (Caste Category - भारत)',
    socialCategories: [
      { id: 'General', label: 'General / Unreserved (UR)', labelHi: 'General (सामान्य - अनारक्षित)' },
      { id: 'OBC', label: 'Other Backward Class (OBC)', labelHi: 'OBC (अन्य पिछड़ा वर्ग)' },
      { id: 'SC', label: 'Scheduled Caste (SC)', labelHi: 'SC (अनुसूचित जाति)' },
      { id: 'ST', label: 'Scheduled Tribe (ST)', labelHi: 'ST (अनुसूचित जनजाति)' },
      { id: 'EWS', label: 'Economically Weaker Section (EWS)', labelHi: 'EWS (आर्थिक रूप से कमजोर वर्ग)' },
    ],
  },
  US: {
    code: 'US',
    alpha3: 'USA',
    name: 'United States',
    nativeName: 'United States',
    flag: '🇺🇸',
    currencySymbol: '$',
    currencyCode: 'USD',
    nationalIdName: 'Social Security Number (SSN)',
    nationalIdPlaceholder: '9-Digit SSN (XXX-XX-XXXX)',
    administrativeLabel: 'State',
    divisions: [
      'California',
      'Texas',
      'Florida',
      'New York',
      'Pennsylvania',
      'Illinois',
      'Ohio',
      'Georgia',
      'North Carolina',
      'Michigan',
      'New Jersey',
      'Virginia',
      'Washington',
      'Arizona',
      'Massachusetts',
      'Other States',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Affirmative Action / Demographic Category (No Caste in US)',
    categoryLabelHi: 'जनसांख्यिकी / समानता वर्ग (अमेरिका में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'Standard / Non-Minority', labelHi: 'सामान्य नागरिक (Standard Citizen)' },
      { id: 'African_American', label: 'African American / Black', labelHi: 'अफ्रीकी अमेरिकी (African American)' },
      { id: 'Hispanic_Latino', label: 'Hispanic or Latino', labelHi: 'हिस्पैनिक अथवा लातीनी (Hispanic / Latino)' },
      { id: 'Asian_Pacific', label: 'Asian American / Pacific Islander', labelHi: 'एशियाई अमेरिकी / प्रशांत द्वीपवासी' },
      { id: 'Native_American', label: 'American Indian / Alaska Native', labelHi: 'मूल अमेरिकी / अलास्का मूल निवासी' },
      { id: 'Other', label: 'Two or More Races / Other', labelHi: 'अन्य जनसांख्यिकी पृष्ठभूमि' },
    ],
  },
  GB: {
    code: 'GB',
    alpha3: 'GBR',
    name: 'United Kingdom',
    nativeName: 'United Kingdom',
    flag: '🇬🇧',
    currencySymbol: '£',
    currencyCode: 'GBP',
    nationalIdName: 'National Insurance Number (NINO)',
    nationalIdPlaceholder: 'NINO (e.g. QQ 12 34 56 A)',
    administrativeLabel: 'Home Nation / Region',
    divisions: [
      'England - Greater London',
      'England - South East',
      'England - North West',
      'England - West Midlands',
      'England - Yorkshire',
      'Scotland',
      'Wales',
      'Northern Ireland',
    ],
    hasCasteSystem: false,
    categoryLabel: 'UK Equality & Demographic Group (No Caste in UK)',
    categoryLabelHi: 'ब्रिटेन समानता वर्ग (यूके में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'General Resident (Standard)', labelHi: 'सामान्य नागरिक (Standard Resident)' },
      { id: 'Asian_British', label: 'Asian or Asian British', labelHi: 'एशियाई ब्रिटिश (Asian British)' },
      { id: 'Black_British', label: 'Black, African or Caribbean British', labelHi: 'अश्वेत ब्रिटिश (Black / African British)' },
      { id: 'Mixed_Multiple', label: 'Mixed or Multiple Ethnic Groups', labelHi: 'मिश्रित नस्लीय पृष्ठभूमि' },
      { id: 'Other', label: 'Other Ethnic Background', labelHi: 'अन्य समुदाय' },
    ],
  },
  CA: {
    code: 'CA',
    alpha3: 'CAN',
    name: 'Canada',
    nativeName: 'Canada',
    flag: '🇨🇦',
    currencySymbol: 'C$',
    currencyCode: 'CAD',
    nationalIdName: 'Social Insurance Number (SIN)',
    nationalIdPlaceholder: '9-Digit SIN (Service Canada)',
    administrativeLabel: 'Province / Territory',
    divisions: [
      'Ontario',
      'Quebec',
      'British Columbia',
      'Alberta',
      'Manitoba',
      'Saskatchewan',
      'Nova Scotia',
      'New Brunswick',
      'Newfoundland and Labrador',
      'Other Provinces',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Employment Equity Group (No Caste in Canada)',
    categoryLabelHi: 'रोजगार समानता वर्ग (कनाडा में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'General Resident (Standard)', labelHi: 'सामान्य नागरिक (General Resident)' },
      { id: 'Indigenous', label: 'Indigenous (First Nations / Inuit / Métis)', labelHi: 'कनाडा मूल निवासी (Indigenous Peoples)' },
      { id: 'Visible_Minority', label: 'Visible Minority', labelHi: 'दृश्यमान अल्पसंख्यक (Visible Minority)' },
      { id: 'Person_Disability', label: 'Persons with Disabilities', labelHi: 'विशेष योग्यजन (Persons with Disabilities)' },
    ],
  },
  AU: {
    code: 'AU',
    alpha3: 'AUS',
    name: 'Australia',
    nativeName: 'Australia',
    flag: '🇦🇺',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    nationalIdName: 'Medicare / TFN Number',
    nationalIdPlaceholder: 'Medicare or Tax File Number',
    administrativeLabel: 'State / Territory',
    divisions: [
      'New South Wales',
      'Victoria',
      'Queensland',
      'Western Australia',
      'South Australia',
      'Tasmania',
      'Australian Capital Territory',
      'Northern Territory',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Demographic & Equity Category (No Caste in Australia)',
    categoryLabelHi: 'समानता व जनसांख्यिकी वर्ग (ऑस्ट्रेलिया में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'General Citizen', labelHi: 'सामान्य नागरिक (General Citizen)' },
      { id: 'Indigenous', label: 'Aboriginal & Torres Strait Islander', labelHi: 'ऑस्ट्रेलियाई मूल निवासी (Indigenous)' },
      { id: 'CALD', label: 'Culturally Diverse Background (CALD)', labelHi: 'सांस्कृतिक विविधता वर्ग (CALD)' },
    ],
  },
  DE: {
    code: 'DE',
    alpha3: 'DEU',
    name: 'Germany',
    nativeName: 'Deutschland',
    flag: '🇩🇪',
    currencySymbol: '€',
    currencyCode: 'EUR',
    nationalIdName: 'Steuer-ID / Personalausweis',
    nationalIdPlaceholder: '11-Digit Steuer-Identifikationsnummer',
    administrativeLabel: 'Federal State (Bundesland)',
    divisions: [
      'Bavaria (Bayern)',
      'North Rhine-Westphalia (NRW)',
      'Baden-Württemberg',
      'Lower Saxony (Niedersachsen)',
      'Hesse (Hessen)',
      'Berlin',
      'Saxony (Sachsen)',
      'Hamburg',
      'Rhineland-Palatinate',
      'Other Federal States',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Social Assistance Category (Keine Kaste / No Caste in Germany)',
    categoryLabelHi: 'सामाजिक सहायता वर्ग (जर्मनी में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'Universal Citizen (Regulärer Bürger)', labelHi: 'सामान्य नागरिक (Standard Citizen)' },
      { id: 'Social_Priority', label: 'BAföG / Education & Social Support Eligible', labelHi: 'शिक्षा व सामाजिक सहायता पात्र (BAföG)' },
      { id: 'Jobseeker_Youth', label: 'Youth & Vocational Support (Berufsausbildung)', labelHi: 'कौशल प्रशिक्षण व युवा प्रोत्साहन' },
    ],
  },
  FR: {
    code: 'FR',
    alpha3: 'FRA',
    name: 'France',
    nativeName: 'France',
    flag: '🇫🇷',
    currencySymbol: '€',
    currencyCode: 'EUR',
    nationalIdName: 'Numéro de Sécurité Sociale (NIR / CNI)',
    nationalIdPlaceholder: '15-Digit Numéro de Sécurité Sociale',
    administrativeLabel: 'Région',
    divisions: [
      'Île-de-France',
      'Auvergne-Rhône-Alpes',
      'Nouvelle-Aquitaine',
      'Occitanie',
      'Hauts-de-France',
      'Provence-Alpes-Côte d\'Azur',
      'Grand Est',
      'Pays de la Loire',
      'Bretagne',
      'Normandie',
      'Bourgogne-Franche-Comté',
      'Centre-Val de Loire',
      'Corse',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Statut Social (Régime Républicain Égalitaire - Pas de Caste)',
    categoryLabelHi: 'सामाजिक स्थिति वर्ग (फ्रांस में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'Régime Général (Universal Citizen)', labelHi: 'सामान्य नागरिक (Régime Général)' },
      { id: 'Social_Priority', label: 'Boursier sur Critères Sociaux CROUS', labelHi: 'सामाजिक छात्रवृत्ति पात्र (Boursier CROUS)' },
      { id: 'Apprenti_Jobseeker', label: 'Contrat d\'Apprentissage / Jeunesse', labelHi: 'प्रशिक्षु व युवा रोजगार (Apprentissage)' },
    ],
  },
  JP: {
    code: 'JP',
    alpha3: 'JPN',
    name: 'Japan',
    nativeName: '日本',
    flag: '🇯🇵',
    currencySymbol: '¥',
    currencyCode: 'JPY',
    nationalIdName: 'My Number Card (マイナンバー)',
    nationalIdPlaceholder: '12-Digit My Number',
    administrativeLabel: 'Prefecture',
    divisions: [
      'Tokyo',
      'Osaka',
      'Kanagawa',
      'Aichi',
      'Saitama',
      'Chiba',
      'Hyogo',
      'Hokkaido',
      'Fukuoka',
      'Shizuoka',
      'Kyoto',
      'Hiroshima',
      'Other Prefectures',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Social Assistance Category (No Caste in Japan)',
    categoryLabelHi: 'सामाजिक सहायता वर्ग (जापान में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'General Citizen (一般市民)', labelHi: 'सामान्य नागरिक (General Citizen)' },
      { id: 'Welfare_Priority', label: 'Scholarship & Welfare Priority (修学支援・福祉対象)', labelHi: 'शिक्षा छात्रवृत्ति व कल्याण प्राथमिकता' },
      { id: 'Youth_Employment', label: 'Hello Work Youth Support (若年就労支援)', labelHi: 'युवा रोजगार सहायता' },
    ],
  },
  AE: {
    code: 'AE',
    alpha3: 'ARE',
    name: 'United Arab Emirates',
    nativeName: 'الإمارات العربية المتحدة',
    flag: '🇦🇪',
    currencySymbol: 'د.إ',
    currencyCode: 'AED',
    nationalIdName: 'Emirates ID',
    nationalIdPlaceholder: '15-Digit Emirates ID (784-XXXX-XXXXXXX-X)',
    administrativeLabel: 'Emirate',
    divisions: [
      'Abu Dhabi',
      'Dubai',
      'Sharjah',
      'Ajman',
      'Umm Al Quwain',
      'Ras Al Khaimah',
      'Fujairah',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Citizenship & Residency Status (No Caste in UAE)',
    categoryLabelHi: 'नागरिकता / निवास स्थिति (यूएई में जाति नहीं होती)',
    socialCategories: [
      { id: 'National_Citizen', label: 'UAE National Citizen (مواطن إماراتي)', labelHi: 'संयुक्त अरब अमीरात नागरिक (UAE National)' },
      { id: 'GCC_National', label: 'GCC National Citizen (مواطن خليجي)', labelHi: 'जीसीसी राष्ट्रीय नागरिक (GCC National)' },
      { id: 'Resident', label: 'Resident Expatriate (مقيم نظامي)', labelHi: 'वैध विदेशी निवासी (Resident Expatriate)' },
    ],
  },
  BR: {
    code: 'BR',
    alpha3: 'BRA',
    name: 'Brazil',
    nativeName: 'Brasil',
    flag: '🇧🇷',
    currencySymbol: 'R$',
    currencyCode: 'BRL',
    nationalIdName: 'CPF (Cadastro de Pessoas Físicas)',
    nationalIdPlaceholder: '11-Digit CPF Number (XXX.XXX.XXX-XX)',
    administrativeLabel: 'State (Estado)',
    divisions: [
      'São Paulo',
      'Rio de Janeiro',
      'Minas Gerais',
      'Bahia',
      'Paraná',
      'Rio Grande do Sul',
      'Pernambuco',
      'Ceará',
      'Pará',
      'Goiás',
      'Distrito Federal (Brasília)',
      'Other States',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Cotas Raciais / Affirmative Action Quota Group (Brazil)',
    categoryLabelHi: 'कोटा आरक्षण वर्ग (ब्राजील में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'Ampla Concorrência (General Competition)', labelHi: 'सामान्य वर्ग (Ampla Concorrência)' },
      { id: 'PPI', label: 'PPI (Pretos, Pardos e Indígenas)', labelHi: 'पीपीआई वर्ग (अश्वेत, मिश्रित व मूल निवासी)' },
      { id: 'Quilombolas', label: 'Comunidades Quilombolas', labelHi: 'किलोम्बोलास समुदाय (Quilombolas)' },
      { id: 'Public_School', label: 'Escola Pública / Baixa Renda', labelHi: 'सरकारी विद्यालय / निम्न आय वर्ग' },
    ],
  },
  SG: {
    code: 'SG',
    alpha3: 'SGP',
    name: 'Singapore',
    nativeName: 'Singapore',
    flag: '🇸🇬',
    currencySymbol: 'S$',
    currencyCode: 'SGD',
    nationalIdName: 'NRIC (National Registration IC)',
    nationalIdPlaceholder: 'NRIC Number (e.g. S1234567A)',
    administrativeLabel: 'Planning Area',
    divisions: [
      'Central Region',
      'East Region',
      'North Region',
      'North-East Region',
      'West Region',
    ],
    hasCasteSystem: false,
    categoryLabel: 'CMIO Demographic Scheme (Singapore - No Caste)',
    categoryLabelHi: 'सीएमआईओ योजना (सिंगापुर में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'General Singapore Citizen', labelHi: 'सामान्य नागरिक (General Citizen)' },
      { id: 'Malay', label: 'Malay Community Scheme (MENDAKI)', labelHi: 'मलय समुदाय योजना (Mendaki Scheme)' },
      { id: 'Indian', label: 'Indian Community Scheme (SINDA)', labelHi: 'भारतीय समुदाय योजना (SINDA Scheme)' },
      { id: 'Chinese', label: 'Chinese Community Scheme (CDAC)', labelHi: 'चीनी समुदाय योजना (CDAC Scheme)' },
      { id: 'Others', label: 'Eurasian & Other Communities', labelHi: 'अन्य समुदाय (Others)' },
    ],
  },
  KR: {
    code: 'KR',
    alpha3: 'KOR',
    name: 'South Korea',
    nativeName: '대한민국',
    flag: '🇰🇷',
    currencySymbol: '₩',
    currencyCode: 'KRW',
    nationalIdName: 'Resident Registration Number (주민등록번호)',
    nationalIdPlaceholder: '13-Digit RRN (XXXXXX-XXXXXXX)',
    administrativeLabel: 'Province / Metropolitan City',
    divisions: [
      'Seoul',
      'Busan',
      'Incheon',
      'Daegu',
      'Daejeon',
      'Gwangju',
      'Ulsan',
      'Sejong',
      'Gyeonggi-do',
      'Gangwon-do',
      'Chungcheong',
      'Jeolla',
      'Gyeongsang',
      'Jeju',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Social Support Category (No Caste in South Korea)',
    categoryLabelHi: 'सामाजिक सहायता वर्ग (कोरिया में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'General Citizen (일반 시민)', labelHi: 'सामान्य नागरिक (General Citizen)' },
      { id: 'Youth_Priority', label: 'Youth Employment Priority (청년 취업지원 대상)', labelHi: 'युवा रोजगार प्राथमिकता' },
      { id: 'Basic_Welfare', label: 'National Basic Living Security (기초생활수급자)', labelHi: 'राष्ट्रीय बुनियादी जीवन सुरक्षा' },
    ],
  },
  SA: {
    code: 'SA',
    alpha3: 'SAU',
    name: 'Saudi Arabia',
    nativeName: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    currencySymbol: '﷼',
    currencyCode: 'SAR',
    nationalIdName: 'National ID / Iqama (Absher)',
    nationalIdPlaceholder: '10-Digit National ID / Iqama Number',
    administrativeLabel: 'Region',
    divisions: [
      'Riyadh',
      'Makkah',
      'Madinah',
      'Eastern Province',
      'Asir',
      'Tabuk',
      'Hail',
      'Northern Borders',
      'Jazan',
      'Najran',
      'Al Bahah',
      'Al Jawf',
      'Qassim',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Citizenship & Residency Status (No Caste in Saudi Arabia)',
    categoryLabelHi: 'नागरिकता व निवास स्थिति (सऊदी अरब में जाति नहीं होती)',
    socialCategories: [
      { id: 'National_Citizen', label: 'Saudi National Citizen (مواطن سعودي)', labelHi: 'सऊदी राष्ट्रीय नागरिक (Saudi National)' },
      { id: 'GCC_National', label: 'GCC Citizen (مواطن خليجي)', labelHi: 'जीसीसी नागरिक (GCC Citizen)' },
      { id: 'Resident', label: 'Resident Expatriate (مقيم نظامي)', labelHi: 'वैध विदेशी निवासी (Resident Iqama)' },
    ],
  },
  NZ: {
    code: 'NZ',
    alpha3: 'NZL',
    name: 'New Zealand',
    nativeName: 'Aotearoa',
    flag: '🇳🇿',
    currencySymbol: 'NZ$',
    currencyCode: 'NZD',
    nationalIdName: 'IRD Number / NZ Passport',
    nationalIdPlaceholder: '8 or 9-Digit IRD Number',
    administrativeLabel: 'Region',
    divisions: [
      'Auckland',
      'Wellington',
      'Canterbury',
      'Waikato',
      'Bay of Plenty',
      'Manawatu-Wanganui',
      'Otago',
      'Hawke\'s Bay',
      'Taranaki',
      'Southland',
      'Other Regions',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Equity & Community Category (No Caste in New Zealand)',
    categoryLabelHi: 'समानता व समुदाय वर्ग (न्यूजीलैंड में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'General Resident / Citizen', labelHi: 'सामान्य नागरिक (General Citizen)' },
      { id: 'Maori_Pacific', label: 'Māori or Pacific Peoples Priority', labelHi: 'माओरी अथवा प्रशांत द्वीपवासी' },
      { id: 'Community_Card', label: 'Community Services Card Holder', labelHi: 'सामुदायिक सेवा कार्ड धारक' },
    ],
  },
  ZA: {
    code: 'ZA',
    alpha3: 'ZAF',
    name: 'South Africa',
    nativeName: 'South Africa',
    flag: '🇿🇦',
    currencySymbol: 'R',
    currencyCode: 'ZAR',
    nationalIdName: 'South African ID Number',
    nationalIdPlaceholder: '13-Digit SA ID Number',
    administrativeLabel: 'Province',
    divisions: [
      'Gauteng',
      'KwaZulu-Natal',
      'Western Cape',
      'Eastern Cape',
      'Limpopo',
      'Mpumalanga',
      'North West',
      'Free State',
      'Northern Cape',
    ],
    hasCasteSystem: false,
    categoryLabel: 'B-BBEE / Employment Equity Classification (South Africa)',
    categoryLabelHi: 'रोजगार समानता वर्ग (दक्षिण अफ्रीका में जाति नहीं होती)',
    socialCategories: [
      { id: 'African', label: 'African / Black (B-BBEE Designated Group)', labelHi: 'अफ्रीकी नागरिक (B-BBEE Designated)' },
      { id: 'Coloured', label: 'Coloured (B-BBEE Designated Group)', labelHi: 'कलर्ड नागरिक (B-BBEE Designated)' },
      { id: 'Indian_Asian', label: 'Indian or Asian (B-BBEE Designated Group)', labelHi: 'भारतीय अथवा एशियाई (B-BBEE Designated)' },
      { id: 'White', label: 'White Citizen / Resident', labelHi: 'श्वेत नागरिक (White Citizen)' },
      { id: 'General', label: 'General Resident', labelHi: 'सामान्य नागरिक (General Resident)' },
    ],
  },
  IT: {
    code: 'IT',
    alpha3: 'ITA',
    name: 'Italy',
    nativeName: 'Italia',
    flag: '🇮🇹',
    currencySymbol: '€',
    currencyCode: 'EUR',
    nationalIdName: 'Codice Fiscale / Carta d\'Identità',
    nationalIdPlaceholder: '16-Character Codice Fiscale',
    administrativeLabel: 'Region (Regione)',
    divisions: [
      'Lombardia',
      'Lazio',
      'Campania',
      'Sicilia',
      'Veneto',
      'Piemonte',
      'Emilia-Romagna',
      'Puglia',
      'Toscana',
      'Calabria',
      'Sardegna',
      'Other Regions',
    ],
    hasCasteSystem: false,
    categoryLabel: 'Social Support Category (No Caste in Italy)',
    categoryLabelHi: 'सामाजिक सहायता वर्ग (इटली में जाति नहीं होती)',
    socialCategories: [
      { id: 'General', label: 'Cittadino / Régime Standard', labelHi: 'सामान्य नागरिक (Standard Resident)' },
      { id: 'ISEE_Priority', label: 'Fascia ISEE Agevolata (Borsa di Studio)', labelHi: 'कम आय वर्ग / छात्रवृत्ति प्राथमिकता (ISEE)' },
      { id: 'Garanzia_Giovani', label: 'Garanzia Giovani / Youth Support', labelHi: 'युवा रोजगार सहायता (Garanzia Giovani)' },
    ],
  },
};

interface CountryContextType {
  country: CountryCode;
  countryMeta: CountryMeta;
  setCountry: (code: CountryCode) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<CountryCode>('IN');

  useEffect(() => {
    const saved = localStorage.getItem('citizen_country') as CountryCode;
    if (saved && COUNTRIES[saved]) {
      setCountryState(saved);
    }
  }, []);

  const setCountry = (code: CountryCode) => {
    if (COUNTRIES[code]) {
      setCountryState(code);
      localStorage.setItem('citizen_country', code);
      // Dispatch an event so components listening can re-query if needed
      window.dispatchEvent(new CustomEvent('country_changed', { detail: code }));
    }
  };

  return (
    <CountryContext.Provider
      value={{
        country,
        countryMeta: COUNTRIES[country],
        setCountry,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}
