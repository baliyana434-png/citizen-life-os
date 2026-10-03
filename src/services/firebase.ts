import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = (): boolean => {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return Boolean(key && key !== 'YOUR_FIREBASE_API_KEY' && key.startsWith('AIzaSy'));
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === 'undefined') return null;
  if (!app && isFirebaseConfigured()) {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    } catch (error) {
      console.warn('Firebase app initialization error:', error);
    }
  }
  return app;
};

export const getFirebaseAuth = (): Auth | null => {
  if (typeof window === 'undefined') return null;
  if (!auth && isFirebaseConfigured()) {
    try {
      const firebaseApp = getFirebaseApp();
      if (firebaseApp) {
        auth = getAuth(firebaseApp);
      }
    } catch (error) {
      console.warn('Firebase auth initialization error:', error);
    }
  }
  return auth;
};

// Initial client-side attempt
if (typeof window !== 'undefined' && isFirebaseConfigured()) {
  getFirebaseAuth();
}

export { app, auth };
