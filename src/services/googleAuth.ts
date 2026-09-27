import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from './firebase';

export interface GoogleAuthResult {
  success: boolean;
  name: string;
  email: string;
  photoURL?: string;
  uid: string;
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
      throw new Error(
        'Firebase Auth configuration active nahi hai. Kripya .env.local check karein.'
      );
    }

    const provider = new GoogleAuthProvider();
    // Forces Google to show account selection dialog so user chooses their real existing Google account
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const user: User = result.user;

      if (!user.email) {
        throw new Error('Google account se verified email praapt nahi hua.');
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

      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google साइन-इन विंडो बंद कर दी गई। कृपया पुनः प्रयास करें।');
      }
      if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Google साइन-इन अनुरोध रद्द कर दिया गया।');
      }
      if (error.code === 'auth/popup-blocked') {
        throw new Error('ब्राउज़र ने Google पॉप-अप ब्लॉक कर दिया है। कृपया एड्रेस बार में पॉप-अप की अनुमति दें।');
      }
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error(
          'FIREBASE_GOOGLE_DISABLED: Firebase Console me Google Provider "Enable" nahi hai! Kripya Firebase Console > Authentication > Sign-in method me Google ko Enable karein.'
        );
      }
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error(
          'Firebase Console me localhost domain authorized nahi hai. Kripya Firebase Console > Authentication > Settings > Authorized domains me localhost add karein.'
        );
      }

      throw new Error(error.message || 'Google साइन-इन विफल रहा।');
    }
  }
}
