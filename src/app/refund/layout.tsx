import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenlifeos.com';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Citizen Life OS',
  description:
    'Official Refund and Cancellation Policy for Citizen Life OS 1-Year National Citizen Access Pass and services.',
  alternates: {
    canonical: `${siteUrl}/refund`,
  },
};

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
