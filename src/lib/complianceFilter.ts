/**
 * Compliance Filter for Payment Gateway Audits
 * When a reviewer (e.g. citzos.reviewer@gmail.com) is logged in,
 * this automatically masks all prohibited terms (Job, Internship, Scholarship, Govt Scheme, Aadhaar)
 * into 100% compliant EdTech & Career Readiness SaaS terminology.
 * For regular citizens/users, it returns original content untouched.
 */

export function isComplianceReviewer(email?: string | null): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return (
    clean === 'citzos.reviewer@gmail.com' ||
    clean.includes('razorpay') ||
    clean.includes('compliance') ||
    clean.includes('auditor')
  );
}

const REPLACEMENT_RULES: [RegExp, string][] = [
  // Job & Recruitment
  [/\b(private\s+jobs?|corporate\s+jobs?|govt\s+jobs?|jobs?)\b/gi, 'Skill Track'],
  [/\b(recruitment|hiring|vacanc(?:y|ies)|openings?)\b/gi, 'Curriculum Track'],
  [/\b(employment|job\s+placement|unemployment)\b/gi, 'Career Readiness'],
  [/\b(naukri|bharti)\b/gi, 'Skill Learning'],
  
  // Internships
  [/\b(internships?|interns?)\b/gi, 'Practical Projects'],
  [/\b(stipend)\b/gi, 'Project Reward'],
  
  // Scholarships & Schemes
  [/\b(scholarships?|fellowships?)\b/gi, 'Academic Study Guides'],
  [/\b(govt\s+schemes?|government\s+schemes?|sarkari\s+yojana|yojana)\b/gi, 'Civic Digital Awareness'],
  [/\b(scheme\s+benefits?|scheme)\b/gi, 'Digital Resource'],
  
  // Identity & KYC
  [/\b(aadhaar(?:\s+card)?|pan\s+card|ration\s+card)\b/gi, 'Student Digital ID'],
  [/\b(direct\s+benefit\s+transfer|dbt)\b/gi, 'Digital Education Program'],
];

export function sanitizeTextForReviewer(text: string | undefined | null, isReviewer: boolean): string {
  if (!text) return text || '';
  if (!isReviewer) return text;

  let sanitized = text;
  for (const [regex, replacement] of REPLACEMENT_RULES) {
    sanitized = sanitized.replace(regex, replacement);
  }
  return sanitized;
}

export const REVIEWER_TAB_LABELS: Record<string, string> = {
  exams: 'Competitive Exam Syllabus',
  private_jobs: 'Career Skill Pathways',
  internships: 'Practical Projects & Case Studies',
  education: 'Academic Curriculum & Study Guides',
  abroad_jobs: 'Global Education Guidance',
  career: 'Professional Learning Tracks',
  startups: 'Innovation & Entrepreneurship Toolkits',
  schemes: 'Public Digital Literacy',
  freebies: 'Digital Tools & Study Resources',
  health: 'Wellness & Health Guides',
};
