import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenlifeos.com';

export const metadata: Metadata = {
  title: 'Terms of Service | Citizen Life OS',
  description:
    'Terms of Service, user commitments, and legal agreements governing the use of Citizen Life OS civic services and access passes.',
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
