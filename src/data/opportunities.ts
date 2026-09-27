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

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  ...EXAM_OPPORTUNITIES,
  ...PRIVATE_JOB_OPPORTUNITIES,
  ...INTERNSHIP_OPPORTUNITIES,
  ...EDUCATION_OPPORTUNITIES,
  ...ABROAD_OPPORTUNITIES,
  ...CAREER_OPPORTUNITIES,
  ...STARTUP_OPPORTUNITIES,
  ...SCHEME_OPPORTUNITIES,
  ...FREEBIE_OPPORTUNITIES,
  ...HEALTH_OPPORTUNITIES,
];
