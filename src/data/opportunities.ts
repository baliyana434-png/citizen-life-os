import { Opportunity } from '@/types';
import { EXAM_OPPORTUNITIES } from './categories/exams';
import { PRIVATE_JOB_OPPORTUNITIES } from './categories/private_jobs';
import { INTERNSHIP_OPPORTUNITIES } from './categories/internships';
import { EDUCATION_OPPORTUNITIES } from './categories/education';
import { ABROAD_OPPORTUNITIES } from './categories/abroad';
import { CAREER_OPPORTUNITIES } from './categories/career';
import { STARTUP_OPPORTUNITIES } from './categories/startups';
import { SCHEME_OPPORTUNITIES } from './categories/schemes';
import { FREEBIE_OPPORTUNITIES } from './categories/freebies';
import { HEALTH_OPPORTUNITIES } from './categories/health';
import { GLOBAL_STUDY_ABROAD_OPPORTUNITIES } from './categories/global_study_abroad';
import { USA_OPPORTUNITIES } from './categories/usa_opportunities';
import { UK_OPPORTUNITIES } from './categories/uk_opportunities';
import { CANADA_OPPORTUNITIES } from './categories/canada_opportunities';
import { GERMANY_OPPORTUNITIES } from './categories/germany_opportunities';
import { AUSTRALIA_OPPORTUNITIES } from './categories/australia_opportunities';

// Ensure all Indian-origin opportunities have country: 'IN' by default
const tagCountry = (opps: Opportunity[], countryCode: Opportunity['country']): Opportunity[] => {
  return opps.map((o) => ({
    ...o,
    country: o.country || countryCode || 'IN',
  }));
};

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  // International Study Abroad & Multi-National Opportunities
  ...GLOBAL_STUDY_ABROAD_OPPORTUNITIES,
  ...USA_OPPORTUNITIES,
  ...UK_OPPORTUNITIES,
  ...CANADA_OPPORTUNITIES,
  ...GERMANY_OPPORTUNITIES,
  ...AUSTRALIA_OPPORTUNITIES,

  // India Opportunities (Default 'IN')
  ...tagCountry(EXAM_OPPORTUNITIES, 'IN'),
  ...tagCountry(PRIVATE_JOB_OPPORTUNITIES, 'IN'),
  ...tagCountry(INTERNSHIP_OPPORTUNITIES, 'IN'),
  ...tagCountry(EDUCATION_OPPORTUNITIES, 'IN'),
  ...tagCountry(ABROAD_OPPORTUNITIES, 'GLOBAL'),
  ...tagCountry(CAREER_OPPORTUNITIES, 'IN'),
  ...tagCountry(STARTUP_OPPORTUNITIES, 'IN'),
  ...tagCountry(SCHEME_OPPORTUNITIES, 'IN'),
  ...tagCountry(FREEBIE_OPPORTUNITIES, 'IN'),
  ...tagCountry(HEALTH_OPPORTUNITIES, 'IN'),
];
