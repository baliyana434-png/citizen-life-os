'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CountryCode } from '@/types';

export interface CountryMeta {
  code: CountryCode;
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
  GLOBAL: {
    code: 'GLOBAL',
    name: 'Global / Worldwide',
    nativeName: 'Worldwide (Study Abroad & International)',
    flag: '🌐',
    currencySymbol: '$',
    currencyCode: 'USD',
    nationalIdName: 'National Passport / Identity',
    nationalIdPlaceholder: 'Passport Number / National ID',
    administrativeLabel: 'Region / Target Country',
    divisions: [
      'International Student',
      'Study Abroad Candidate',
      'Remote Global Worker',
      'Europe / Schengen',
      'North America',
      'Asia-Pacific',
      'Middle East & Africa',
      'Latin America',
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
