'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CountryCode } from '@/types';

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
    nationalIdPlaceholder: '9-Digit SSN or State Real ID',
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
  },
  AU: {
    code: 'AU',
    alpha3: 'AUS',
    name: 'Australia',
    nativeName: 'Australia',
    flag: '🇦🇺',
    currencySymbol: 'A$',
    currencyCode: 'AUD',
    nationalIdName: 'Tax File Number (TFN) / Medicare',
    nationalIdPlaceholder: 'TFN or Medicare Number',
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
  },
  FR: {
    code: 'FR',
    alpha3: 'FRA',
    name: 'France',
    nativeName: 'France',
    flag: '🇫🇷',
    currencySymbol: '€',
    currencyCode: 'EUR',
    nationalIdName: 'Carte Nationale d\'Identité (CNI)',
    nationalIdPlaceholder: '12-Digit CNI Number',
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
    nationalIdPlaceholder: '15-Digit Emirates ID Number',
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
    nationalIdPlaceholder: '11-Digit CPF Number',
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
    nationalIdPlaceholder: '13-Digit RRN',
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
  },
  SA: {
    code: 'SA',
    alpha3: 'SAU',
    name: 'Saudi Arabia',
    nativeName: 'المملكة العربية السعودية',
    flag: '🇸🇦',
    currencySymbol: '﷼',
    currencyCode: 'SAR',
    nationalIdName: 'National ID (Absher)',
    nationalIdPlaceholder: '10-Digit National ID / Iqama',
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
