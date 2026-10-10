import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenlifeos.com';

export const metadata: Metadata = {
  title: 'Privacy Policy | Citizen Life OS',
  description:
    'Official Privacy Policy and Data Protection standards of Citizen Life OS. Google OAuth 2.0 compliant and ISO/DPDP citizen data protection architecture.',
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
