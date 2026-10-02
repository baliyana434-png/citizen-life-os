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
 * Prevents any language leakage across English, Hindi, and international languages.
 */
export function getGoogleAuthErrorMessage(
  errorCodeOrMessage: string | undefined,
  language: SupportedLanguage = 'en'
): string {
  const code = errorCodeOrMessage || '';

  if (
    code.includes('popup-closed-by-user') ||
    code.includes('विंडो बंद') ||
    code.includes('window was closed')
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

  if (code.includes('cancelled-popup-request')) {
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

  if (code.includes('FIREBASE_GOOGLE_DISABLED') || code.includes('operation-not-allowed')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Firebase Google sign-in is not enabled in Firebase Console.',
      hi: 'Firebase Console में गूगल साइन-इन सक्षम नहीं है।',
      es: 'El inicio de sesión de Google no está habilitado en Firebase Console.',
      fr: 'La connexion Google n\'est pas activée dans Firebase Console.',
      de: 'Google-Anmeldung ist in der Firebase-Konsole nicht aktiviert.',
      ar: 'تسجيل الدخول عبر Google غير مفعّل في Firebase Console.',
    };
    return messages[language] || messages.en;
  }

  if (code.includes('unauthorized-domain')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Domain is not authorized in Firebase Console > Authentication > Settings.',
      hi: 'Firebase Console में डोमेन अधिकृत नहीं है।',
      es: 'El dominio actual no está autorizado en Firebase Console.',
      fr: 'Le domaine actuel n\'est pas autorisé dans Firebase Console.',
      de: 'Die aktuelle Domain ist in der Firebase-Konsole nicht autorisiert.',
      ar: 'هذا النطاق غير مصرح به في Firebase Console.',
    };
    return messages[language] || messages.en;
  }

  if (code.includes('not configured') || code.includes('configuration active nahi')) {
    const messages: Record<SupportedLanguage, string> = {
      en: 'Firebase Auth is not configured. Please check environment variables.',
      hi: 'Firebase Auth कॉन्फ़िगर नहीं है। कृपया व्यवस्थापक से संपर्क करें।',
      es: 'Firebase Auth no está configurado.',
      fr: 'Firebase Auth n\'est pas configuré.',
      de: 'Firebase Auth ist nicht konfiguriert.',
      ar: 'Firebase Auth غير مهيأ.',
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
   * Triggers official Google OAuth sign-in popup via Firebase Auth (100% Free)
   * Strictly authenticates real existing Google accounts with prompt: 'select_account'.
   * Never uses any dummy or fake accounts.
   */
  static async signInWithGoogle(): Promise<GoogleAuthResult> {
    const auth = getFirebaseAuth();

    if (!auth || !isFirebaseConfigured()) {
      const err: any = new Error('Firebase Auth is not configured.');
      err.code = 'auth/not-configured';
      throw err;
    }

    const provider = new GoogleAuthProvider();
    // Forces Google to show account selection dialog so user chooses their real existing Google account
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const user: User = result.user;

      if (!user.email) {
        const err: any = new Error('Verified email not returned by Google account.');
        err.code = 'auth/no-email';
        throw err;
      }

      return {
        success: true,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || undefined,
        uid: user.uid,
      };
    } catch (error: any) {
      console.error('Firebase Google Auth error:', error);
      // Preserve code so localized helper can translate accurately
      const err: any = new Error(error.message || error.code || 'Google sign-in failed');
      err.code = error.code || 'auth/failed';
      throw err;
    }
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
