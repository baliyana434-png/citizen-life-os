'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthModal } from '@/components/auth/AuthModal';
import { CitizenProfile } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { BrandSplashScreen } from '@/components/common/BrandSplashScreen';
import { isGoogleRedirectPending, getGoogleRedirectResultSafe } from '@/services/googleAuth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [pendingPrefill, setPendingPrefill] = useState<{
    name: string;
    email: string;
    photoURL?: string;
    isGoogle: boolean;
  } | null>(null);

  const fromLogout = searchParams.get('from') === 'logout';
  const initialNotice = fromLogout
    ? language === 'hi'
      ? 'सफलतापूर्वक लॉग आउट हो गया। नागरिक पोर्टल में प्रवेश हेतु पुनः लॉगिन करें।'
      : 'You have been logged out successfully. Please log in to continue.'
    : undefined;

  useEffect(() => {
    let cancelled = false;

    // Check if returning from a mobile Google OAuth redirect
    if (isGoogleRedirectPending()) {
      getGoogleRedirectResultSafe().then(async (result) => {
        if (cancelled) return;
        if (result && result.email) {
          try {
            const res = await fetch(`/api/citizens/profile?email=${encodeURIComponent(result.email)}`, {
              cache: 'no-store',
            });
            const data = await res.json();
            if (res.ok && data.success && data.citizen && data.citizen.isOnboarded && data.citizen.dob && data.citizen.state) {
              // Registered -> direct instant entry into website with zero delay!
              handleLoginSuccess(data.citizen);
              return;
            }
          } catch (e) {}

          // Non-registered email -> open registration Step 2 with Google details prefilled
          setPendingPrefill({
            name: result.name,
            email: result.email,
            photoURL: result.photoURL,
            isGoogle: true,
          });
        }
        setCheckingAuth(false);
      });
      return () => {
        cancelled = true;
      };
    }

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
          parsed.isOnboarded &&
          parsed.dob
        ) {
          // Already authenticated: redirect to main dashboard
          window.location.replace('/');
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
    window.location.replace('/');
  };

  if (checkingAuth) {
    return <BrandSplashScreen />;
  }

  return (
    <AuthModal
      isOpen={true}
      isFullPageGate={true}
      onClose={() => {}}
      initialScreen={pendingPrefill ? 'signup' : 'login'}
      prefillData={pendingPrefill || undefined}
      initialNotice={initialNotice}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<BrandSplashScreen />}>
      <LoginContent />
    </Suspense>
  );
}
