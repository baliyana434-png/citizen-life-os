import { SkillTopic } from './types';
import { SKILL_SECTORS } from './sectors';
import { FOREIGN_LANGUAGE_TOPICS } from './foreignLanguages';
import { VIDEO_ANIMATION_TOPICS } from './videoAnimation';
import { GRAPHICS_PHOTOGRAPHY_TOPICS } from './graphicsPhotography';
import { TECH_CODING_TOPICS } from './techCoding';
import { GOVT_EXAMS_TOPICS } from './govtExams';
import { VOCATIONAL_TRADES_TOPICS } from './vocationalTrades';
import { DIGITAL_BUSINESS_TOPICS } from './digitalBusiness';
import { FINANCE_ACCOUNTING_TOPICS } from './financeAccounting';
import { HEALTHCARE_FIRSTAID_TOPICS } from './healthcareFirstAid';

export * from './types';
export * from './sectors';
export * from './foreignLanguages';
export * from './videoAnimation';
export * from './graphicsPhotography';
export * from './techCoding';
export * from './govtExams';
export * from './vocationalTrades';
export * from './digitalBusiness';
export * from './financeAccounting';
export * from './healthcareFirstAid';

export const SKILL_TOPICS: SkillTopic[] = [
  ...FOREIGN_LANGUAGE_TOPICS,
  ...VIDEO_ANIMATION_TOPICS,
  ...GRAPHICS_PHOTOGRAPHY_TOPICS,
  ...TECH_CODING_TOPICS,
  ...GOVT_EXAMS_TOPICS,
  ...VOCATIONAL_TRADES_TOPICS,
  ...DIGITAL_BUSINESS_TOPICS,
  ...FINANCE_ACCOUNTING_TOPICS,
  ...HEALTHCARE_FIRSTAID_TOPICS,
];
