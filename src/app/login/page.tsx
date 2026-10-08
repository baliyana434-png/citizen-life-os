'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthModal } from '@/components/auth/AuthModal';
import { CitizenProfile } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { ShieldCheck } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const fromLogout = searchParams.get('from') === 'logout';
  const initialNotice = fromLogout
    ? language === 'hi'
      ? 'सफलतापूर्वक लॉग आउट हो गया। नागरिक पोर्टल में प्रवेश हेतु पुनः लॉगिन करें।'
      : 'You have been logged out successfully. Please log in to continue.'
    : undefined;

  useEffect(() => {
    try {
      const isLoggedOut = localStorage.getItem('citizen_logged_out');
      const saved = localStorage.getItem('citizen_profile');
      if (isLoggedOut !== 'true' && saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          parsed.id &&
          parsed.id !== 'cit-guest' &&
          parsed.id !== 'cit-default' &&
          (parsed.isAadhaarVerified || parsed.isOnboarded)
        ) {
          // Already authenticated: redirect to main dashboard
          window.location.href = '/';
          return;
        }
      }
    } catch (e) {}
    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = (profile: Partial<CitizenProfile>) => {
    try {
      localStorage.removeItem('citizen_logged_out');
      if (profile && profile.id) {
        localStorage.setItem('citizen_profile', JSON.stringify(profile));
      }
    } catch (e) {}
    window.location.href = '/';
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 selection:bg-emerald-500 selection:text-white">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 animate-pulse">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <p className="mt-4 text-xs font-mono font-bold text-emerald-700 tracking-wider uppercase">
          CITIZEN LIFE OS
        </p>
      </div>
    );
  }

  return (
    <AuthModal
      isOpen={true}
      isFullPageGate={true}
      onClose={() => {}}
      initialScreen="login"
      initialNotice={initialNotice}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 animate-pulse">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
