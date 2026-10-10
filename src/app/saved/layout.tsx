import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenlifeos.com';

export const metadata: Metadata = {
  title: 'My Saved Schemes & Bookmarks | Citizen Life OS',
  description:
    'Access your personal bookmarks for verified government schemes, scholarship deadlines, exam alerts, and learning roadmaps on Citizen Life OS.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${siteUrl}/saved`,
  },
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
