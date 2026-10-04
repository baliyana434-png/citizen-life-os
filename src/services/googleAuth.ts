import { GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './firebase';
import { SupportedLanguage } from '@/types';

export interface GoogleAuthResult {
  success: boolean;
  name: string;
  email: string;
  photoURL?: string;
  uid: string;
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '316506287911-es4lbv5m949kmidvr84b1fkjj4hmlqh1.apps.googleusercontent.com';

/**
 * Returns fully localized Google Authentication error messages.
 */
export function getGoogleAuthErrorMessage(
  errorCodeOrMessage: string | undefined,
  language: SupportedLanguage = 'en'
): string {
  const code = errorCodeOrMessage || '';

  if (
    code.includes('popup-closed-by-user') ||
    code.includes('विंडो बंद') ||
    code.includes('window was closed') ||
    code.includes('access_denied')
  ) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Google sign-in window was closed. Please try again.',
      hi: 'गूगल साइन-इन विंडो बंद कर दी गई। कृपया पुनः प्रयास करें।',
      es: 'La ventana de inicio de sesión de Google se ha cerrado. Inténtelo de nuevo.',
      fr: 'La fenêtre de connexion Google a été fermée. Veuillez réessayer.',
      de: 'Das Google-Anmeldefenster wurde geschlossen. Bitte versuchen Sie es erneut.',
      ar: 'تم إغلاق نافذة تسجيل الدخول إلى Google. يرجى المحاولة مرة أخرى.',
    };
    return messages[language] || messages.en;
  }

  if (code.includes('cancelled-popup-request') || code.includes('cancelled')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Google sign-in request was cancelled. Please try again.',
      hi: 'गूगल साइन-इन अनुरोध रद्द कर दिया गया। कृपया पुनः प्रयास करें।',
      es: 'La solicitud de inicio de sesión se ha cancelado.',
      fr: 'La demande de connexion Google a été annulée.',
      de: 'Die Google-Anmeldeanforderung wurde abgebrochen.',
      ar: 'تم إلغاء طلب تسجيل الدخول.',
    };
    return messages[language] || messages.en;
  }

  if (code.includes('popup-blocked')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Browser blocked the Google popup. Please allow popups in your browser address bar.',
      hi: 'ब्राउज़र ने गूगल पॉप-अप ब्लॉक कर दिया है। कृपया एड्रेस बार में पॉप-अप की अनुमति दें।',
      es: 'El navegador bloqueó la ventana emergente de Google. Habilite las ventanas emergentes.',
      fr: 'Le navigateur a bloqué la fenêtre pop-up Google. Veuillez autoriser les fenêtres pop-up.',
      de: 'Der Browser hat das Google-Popup blockiert. Bitte Popups in der Adressleiste erlauben.',
      ar: 'حظر المتصفح النافذة المنبثقة لـ Google. يرجى السماح بالنوافذ المنبثقة.',
    };
    return messages[language] || messages.en;
  }

  const fallbacks: Record<SupportedLanguage, string> = {
    en: 'Google sign-in failed. Please try again.',
    hi: 'गूगल साइन-इन विफल रहा। कृपया पुनः प्रयास करें।',
    es: 'Error al iniciar sesión con Google. Inténtelo de nuevo.',
    fr: 'Échec de la connexion avec Google. Veuillez réessayer.',
    de: 'Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    ar: 'فشل تسجيل الدخول باستخدام Google. يرجى المحاولة مرة أخرى.',
  };
  return fallbacks[language] || fallbacks.en;
}

export class GoogleAuthService {
  /**
   * Dynamically loads official Google Identity Services (GIS) client script.
   */
  static loadGoogleIdentityScript(): Promise<boolean> {
    if (typeof window === 'undefined') return Promise.resolve(false);
    if ((window as any).google?.accounts?.oauth2) return Promise.resolve(true);

    return new Promise((resolve) => {
      const existing = document.getElementById('google-gsi-client');
      if (existing) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  /**
   * Triggers official Google OAuth sign-in popup.
   * Method 1: Google Identity Services (GIS Token Client) - displays real Gmail accounts list.
   * Method 2: Firebase GoogleAuthProvider fallback.
   */
  static async signInWithGoogle(): Promise<GoogleAuthResult> {
    if (typeof window === 'undefined') {
      throw new Error('Google sign-in is only available in browser.');
    }

    // Try Method 1: Google Identity Services (Native Google Account Chooser Popup)
    try {
      const loaded = await this.loadGoogleIdentityScript();
      if (loaded && (window as any).google?.accounts?.oauth2) {
        const result = await new Promise<GoogleAuthResult>((resolve, reject) => {
          try {
            const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
              client_id: GOOGLE_CLIENT_ID,
              scope: 'email profile openid',
              prompt: 'select_account',
              callback: async (tokenResponse: any) => {
                if (tokenResponse.error) {
                  return reject(new Error(tokenResponse.error_description || tokenResponse.error));
                }

                try {
                  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                  });

                  if (!res.ok) {
                    throw new Error('Failed to retrieve user profile from Google.');
                  }

                  const userInfo = await res.json();
                  if (!userInfo.email) {
                    throw new Error('Verified email not returned by Google.');
                  }

                  resolve({
                    success: true,
                    name: userInfo.name || userInfo.email.split('@')[0],
                    email: userInfo.email.toLowerCase().trim(),
                    photoURL: userInfo.picture,
                    uid: userInfo.sub || `g-${Date.now()}`,
                  });
                } catch (fetchErr) {
                  reject(fetchErr);
                }
              },
            });

            tokenClient.requestAccessToken({ prompt: 'select_account' });
          } catch (initErr) {
            reject(initErr);
          }
        });

        return result;
      }
    } catch (gisError: any) {
      console.warn('Google Identity Services attempt note:', gisError?.message || gisError);
    }

    // Method 2: Fallback to Firebase Google Provider popup
    const auth = getFirebaseAuth();
    if (auth && isFirebaseConfigured()) {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });

      try {
        const result = await signInWithPopup(auth, provider);
        const user: User = result.user;

        if (!user.email) {
          throw new Error('Verified email not returned by Google.');
        }

        return {
          success: true,
          name: user.displayName || user.email.split('@')[0],
          email: user.email.toLowerCase().trim(),
          photoURL: user.photoURL || undefined,
          uid: user.uid,
        };
      } catch (fbErr: any) {
        console.error('Firebase Google Auth error:', fbErr);
        const err: any = new Error(fbErr.message || fbErr.code || 'Google sign-in failed');
        err.code = fbErr.code || 'auth/failed';
        throw err;
      }
    }

    throw new Error('Google sign-in is currently unavailable. Please use email and password.');
  }

  /**
   * Signs out the current user session from Firebase Auth
   */
  static async signOut(): Promise<void> {
    try {
      const auth = getFirebaseAuth();
      if (auth && isFirebaseConfigured()) {
        await signOut(auth);
      }
    } catch (error) {
      console.warn('Firebase signOut error:', error);
    }
  }
}
