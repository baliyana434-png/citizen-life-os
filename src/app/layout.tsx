import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TranslationProvider } from '@/i18n/useTranslation';
import { CountryProvider } from '@/context/CountryContext';

export const metadata: Metadata = {
  title: 'Citizen Life OS | Verified National & Global Opportunities',
  description: 'Zero-scam civic platform for verified government schemes, competitive exams, study abroad scholarships, jobs, and healthcare.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950">
        <TranslationProvider>
          <CountryProvider>
            {children}
          </CountryProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
