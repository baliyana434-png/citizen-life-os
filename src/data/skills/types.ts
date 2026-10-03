export interface SkillVideo {
  id: string;
  youtubeId: string;
  title: string;
  titleHi: string;
  channelName: string;
  duration: string;
  language: 'Hindi' | 'English' | 'Hinglish';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  viewsApprox?: string;
  description: string;
  descriptionHi: string;
  keyTakeaways: string[];
}

export interface SkillTopic {
  id: string;
  sectorId: string;
  name: string;
  nameHi: string;
  shortDesc: string;
  shortDescHi: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estTimeToLearn: string;
  averageEarningMonthly: string;
  demandLevel: 'trending' | 'very_high' | 'high';
  demandBadge: string;
  demandBadgeHi: string;
  hiringScope?: string;
  govtCertificateUrl?: string;
  govtCertificateTitle?: string;
  careerRoadmapSteps: { stepNumber: number; title: string; titleHi: string; desc: string; descHi: string }[];
  videos: SkillVideo[];
}

export interface SkillSector {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  icon: string;
  badge: string;
}
