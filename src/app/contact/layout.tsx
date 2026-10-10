import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenlifeos.com';

export const metadata: Metadata = {
  title: 'Contact Us | Citizen Support & Verification Desk | Citizen Life OS',
  description:
    'Reach out to Citizen Life OS editorial and citizen grievance team. Contact info, verification queries, and platform support.',
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
