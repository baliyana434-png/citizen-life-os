'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthModal } from '@/components/auth/AuthModal';
import { CitizenProfile } from '@/types';
import { useTranslation } from '@/i18n/useTranslation';
import { BrandSplashScreen } from '@/components/common/BrandSplashScreen';
import { getGoogleRedirectResultSafe } from '@/services/googleAuth';

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

    async function checkLoginState() {
      // 1. Check if returning from a mobile Google OAuth redirect
      try {
        const redirectUser = await getGoogleRedirectResultSafe();
        if (cancelled) return;
        if (redirectUser && redirectUser.email) {
          const cleanEmail = redirectUser.email.toLowerCase().trim();
          let activeCitizen: Partial<CitizenProfile> = {
            id: `cit-google-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
            fullName: redirectUser.name || 'Google User',
            email: cleanEmail,
            photoURL: redirectUser.photoURL || '',
            isOnboarded: true,
            isAadhaarVerified: true,
            age: 24,
            dob: '2002-05-18',
            lifePhase: 'college_student',
            casteCategory: 'General',
          };

          try {
            const res = await fetch(`/api/citizens/profile?email=${encodeURIComponent(cleanEmail)}`, {
              cache: 'no-store',
            });
            const data = await res.json();
            if (res.ok && data.success && data.citizen) {
              activeCitizen = {
                ...activeCitizen,
                ...data.citizen,
                isOnboarded: true,
                isAadhaarVerified: true,
              };
            }
          } catch (e) {}

          try {
            await fetch('/api/citizens/profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...activeCitizen,
                email: cleanEmail,
                isOnboarded: true,
                isAadhaarVerified: true,
              }),
            });
          } catch (_) {}

          try {
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ citizenId: activeCitizen.id, email: cleanEmail }),
            });
          } catch (_) {}

          try {
            localStorage.removeItem('citizen_logged_out');
            localStorage.setItem('citizen_profile', JSON.stringify(activeCitizen));
          } catch (e) {}

          window.location.replace('/');
          return;
        }
      } catch (err) {
        console.warn('Redirect auth notice:', err);
      }

      // 2. Check if already logged in
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
            // Restore server session cookie for middleware
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ citizenId: parsed.id, email: parsed.email }),
            }).catch(() => {});

            window.location.replace('/');
            return;
          }
        }
      } catch (e) {}

      setCheckingAuth(false);
    }

    checkLoginState();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoginSuccess = async (profile: Partial<CitizenProfile>) => {
    try {
      localStorage.removeItem('citizen_logged_out');
      if (profile && profile.id) {
        localStorage.setItem('citizen_profile', JSON.stringify(profile));
      }
      if (profile && profile.email) {
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ citizenId: profile.id, email: profile.email }),
        }).catch(() => {});
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
