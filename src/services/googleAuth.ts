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

/**
 * Returns fully localized Google Authentication error messages.
 * Prevents language leakage across English, Hindi, and international languages.
 * Strictly NO emojis.
 */
export function getGoogleAuthErrorMessage(
  errorCodeOrMessage: string | undefined,
  language: SupportedLanguage = 'en'
): string {
  const code = (errorCodeOrMessage || '').toLowerCase();

  if (
    code.includes('popup-closed') ||
    code.includes('closed-by-user') ||
    code.includes('window was closed') ||
    code.includes('access_denied') ||
    code.includes('cancelled')
  ) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Google sign-in window was closed. Please try again.',
      hi: 'Google साइन-इन विंडो बंद कर दी गई। कृपया पुनः प्रयास करें।',
      es: 'La ventana de inicio de sesion de Google se ha cerrado.',
      fr: 'La fenetre de connexion Google a ete fermee.',
      de: 'Das Google-Anmeldefenster wurde geschlossen.',
      ar: 'تم اغلاق نافذة تسجيل الدخول.',
    };
    return messages[language] || messages.en;
  }

  if (code.includes('timeout')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Google sign-in timed out. Please try again.',
      hi: 'Google साइन-इन का समय समाप्त हो गया। कृपया पुनः प्रयास करें।',
      es: 'Se agoto el tiempo de espera de Google. Intentelo de nuevo.',
      fr: 'Le delai de connexion Google a expire.',
      de: 'Zeituberschreitung bei der Google-Anmeldung.',
      ar: 'انتهت مهلة تسجيل الدخول الى Google.',
    };
    return messages[language] || messages.en;
  }

  if (code.includes('popup-blocked')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Browser blocked the Google popup. Please allow popups in your browser address bar.',
      hi: 'ब्राउज़र ने Google पॉप-अप ब्लॉक कर दिया है। कृपया एड्रेस बार में पॉप-अप की अनुमति दें।',
      es: 'El navegador bloqueo la ventana emergente de Google. Habilite las ventanas emergentes.',
      fr: 'Le navigateur a bloque la fenetre pop-up Google. Veuillez autoriser les fenetres pop-up.',
      de: 'Der Browser hat das Google-Popup blockiert. Bitte Popups in der Adressleiste erlauben.',
      ar: 'حظر المتصفح النافذة المنبثقة لـ Google. يرجى السماح بالنوافذ المنبثقة.',
    };
    return messages[language] || messages.en;
  }

  if (code.includes('origin_mismatch') || code.includes('redirect_uri_mismatch')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Google OAuth origin mismatch on local IP. Please test on http://localhost:3000 or enter your Google email below.',
      hi: 'लोकल नेटवर्क IP पर Google OAuth अनुमति नहीं देता। कृपया PC पर http://localhost:3000 पर खोलें या नीचे अपना Google ईमेल दर्ज करें।',
      es: 'Google OAuth no admite IP local. Pruebe en http://localhost:3000.',
      fr: 'Google OAuth ne prend pas en charge les IP locales. Testez sur http://localhost:3000.',
      de: 'Google OAuth unterstutzt keine lokalen IPs. Bitte auf http://localhost:3000 testen.',
      ar: 'لا يدعم Google OAuth عناوين IP المحلية.',
    };
    return messages[language] || messages.en;
  }

  if (code.includes('unauthorized-domain')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Local network IP is not in Firebase authorized domains. Please test on http://localhost:3000 or enter your Google email below.',
      hi: 'लोकल नेटवर्क IP Firebase में अधिकृत नहीं है। कृपया PC पर http://localhost:3000 पर खोलें या नीचे अपना Google ईमेल दर्ज करें।',
      es: 'El dominio IP local no esta autorizado en Firebase.',
      fr: 'Le domaine IP local n\'est pas autorise dans Firebase.',
      de: 'Lokale IP ist in Firebase nicht autorisiert.',
      ar: 'نطاق IP المحلي غير مصرح به في Firebase.',
    };
    return messages[language] || messages.en;
  }

  if (code.includes('not configured') || code.includes('not-configured')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Firebase Auth is not configured. Please check environment variables.',
      hi: 'Firebase Auth कॉन्फ़िगर नहीं है। कृपया व्यवस्थापक से संपर्क करें।',
      es: 'Firebase Auth no esta configurado.',
      fr: 'Firebase Auth n\'est pas configure.',
      de: 'Firebase Auth ist nicht konfiguriert.',
      ar: 'Firebase Auth غير مهيا.',
    };
    return messages[language] || messages.en;
  }

  const fallbacks: Record<SupportedLanguage, string> = {
    en: 'Google sign-in could not be completed. Please try again or use email login.',
    hi: 'Google साइन-इन पूर्ण नहीं हो सका। कृपया पुनः प्रयास करें या ईमेल पासवर्ड का उपयोग करें।',
    es: 'Error al iniciar sesion con Google. Intentelo de nuevo.',
    fr: 'Echec de la connexion avec Google. Veuillez reessayer.',
    de: 'Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    ar: 'فشل تسجيل الدخول باستخدام Google. يرجى المحاولة مرة اخرى.',
  };
  return fallbacks[language] || fallbacks.en;
}

export class GoogleAuthService {
  /**
   * Official Google OAuth Sign-In via Firebase Auth.
   * Routes securely through https://lifeos-7a6f1.firebaseapp.com/__/auth/handler
   * Prevents Google Cloud origin_mismatch errors.
   * Auto-cancels with ZERO delay if the user returns/backs out from Google window.
   */
  static async signInWithGoogle(): Promise<GoogleAuthResult> {
    if (typeof window === 'undefined') {
      throw new Error('Google sign-in is only available in browser.');
    }

    const auth = getFirebaseAuth();
    if (!auth || !isFirebaseConfigured()) {
      const err: any = new Error('Firebase Auth is not configured.');
      err.code = 'auth/not-configured';
      throw err;
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    return new Promise<GoogleAuthResult>((resolve, reject) => {
      let isSettled = false;

      const finishResolve = (res: GoogleAuthResult) => {
        if (!isSettled) {
          isSettled = true;
          cleanup();
          resolve(res);
        }
      };

      const finishReject = (err: any) => {
        if (!isSettled) {
          isSettled = true;
          cleanup();
          reject(err);
        }
      };

      // 1. Safety Timeout: auto-cancel after 12 seconds so UI NEVER hangs
      const timeoutId = setTimeout(() => {
        const err: any = new Error('Google sign-in window closed or timed out.');
        err.code = 'auth/popup-closed-by-user';
        finishReject(err);
      }, 12000);

      // 2. Immediate Window Focus Return Detection:
      // When the user hits Back in Safari or closes the Google tab/window,
      // the parent window immediately receives focus / visibilitychange.
      let focusCheckTimer: any = null;
      const handleWindowFocus = () => {
        // Wait 800ms in case the OAuth redirect or token postMessage is in flight
        if (focusCheckTimer) clearTimeout(focusCheckTimer);
        focusCheckTimer = setTimeout(() => {
          if (!isSettled) {
            const err: any = new Error('Google sign-in window closed by user.');
            err.code = 'auth/popup-closed-by-user';
            finishReject(err);
          }
        }, 800);
      };

      window.addEventListener('focus', handleWindowFocus);
      document.addEventListener('visibilitychange', handleWindowFocus);

      const cleanup = () => {
        clearTimeout(timeoutId);
        if (focusCheckTimer) clearTimeout(focusCheckTimer);
        window.removeEventListener('focus', handleWindowFocus);
        document.removeEventListener('visibilitychange', handleWindowFocus);
      };

      // Execute Firebase signInWithPopup
      signInWithPopup(auth, provider)
        .then((result) => {
          const user: User = result.user;
          if (!user || !user.email) {
            const err: any = new Error('Verified email not returned by Google.');
            err.code = 'auth/no-email';
            return finishReject(err);
          }

          finishResolve({
            success: true,
            name: user.displayName || user.email.split('@')[0],
            email: user.email.toLowerCase().trim(),
            photoURL: user.photoURL || undefined,
            uid: user.uid,
          });
        })
        .catch((fbErr: any) => {
          console.warn('Firebase signInWithPopup error code:', fbErr?.code || fbErr?.message);
          const err: any = new Error(fbErr?.message || fbErr?.code || 'Google sign-in failed');
          err.code = fbErr?.code || 'auth/failed';
          finishReject(err);
        });
    });
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
