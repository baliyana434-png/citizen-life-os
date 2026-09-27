import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TranslationProvider } from '@/i18n/useTranslation';

export const metadata: Metadata = {
  title: 'Citizen Life OS | 100% Verified National Opportunities & Benefits',
  description: 'Military-grade, zero-scam platform for Govt Schemes, Competitive Exams, Verified Jobs, Free AI Tools, and Healthcare.',
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
    <html lang="hi">
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950">
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
