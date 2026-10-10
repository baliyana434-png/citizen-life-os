import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenlifeos.com';

export const metadata: Metadata = {
  title: 'Official Civic Disclaimer | Citizen Life OS',
  description:
    'Civic technology disclaimer: Citizen Life OS is an independent civic portal indexing publicly accessible official government programs and gazettes. We do not represent any government agency directly.',
  alternates: {
    canonical: `${siteUrl}/disclaimer`,
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
