'use client';

import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { getFirebaseApp, isFirebaseConfigured } from './firebase';

export interface PushNotificationResult {
  success: boolean;
  token?: string;
  error?: string;
  permission?: NotificationPermission;
}

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'BFOvuKbxQeu_rLLK3KUk_KwbDBD0I_nyJM0klC2bwaluSMwfiiVmpfFwszBRMOy_uzEausl7sTNKICuxc9IgUeI';

class PushNotificationService {
  private messaging: Messaging | null = null;
  private isInitialized = false;

  // 1. Check current browser permission status
  public getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined') return 'unsupported';
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  // 2. Initialize Firebase Messaging
  private async getMessagingInstance(): Promise<Messaging | null> {
    if (typeof window === 'undefined') return null;

    const supported = await isSupported();
    if (!supported || !isFirebaseConfigured()) {
      return null;
    }

    if (!this.messaging) {
      const app = getFirebaseApp();
      if (app) {
        this.messaging = getMessaging(app);
      }
    }
    return this.messaging;
  }

  // 3. Register Service Worker and Request Notification Permission
  public async requestPermission(userIdentifier?: {
    email?: string;
    phone?: string;
    citizenId?: string;
    country?: string;
  }): Promise<PushNotificationResult> {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Window is undefined' };
    }

    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      return {
        success: false,
        error: 'Push notifications are not supported in this browser.',
        permission: 'denied',
      };
    }

    try {
      // Step A: Request native browser permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return {
          success: false,
          error: permission === 'denied' 
            ? 'सूचनाएं अस्वीकृत की गईं। ब्राउज़र सेटिंग्स में जाकर अनुमति दें।' 
            : 'Permission dismissed.',
          permission,
        };
      }

      // Step B: Register the Firebase Service Worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
      });
      await navigator.serviceWorker.ready;

      // Step C: Retrieve FCM Device Push Token
      const messaging = await this.getMessagingInstance();
      if (!messaging) {
        return {
          success: true,
          permission: 'granted',
          error: 'Firebase Messaging not supported, but native notifications enabled.',
        };
      }

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        // Save token locally
        localStorage.setItem('citizen_fcm_token', token);
        localStorage.setItem('citizen_web_push_enabled', 'true');

        // Step D: Send token to server backend to store in DB
        try {
          await fetch('/api/notifications/register-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              token,
              email: userIdentifier?.email || localStorage.getItem('citizen_remember_email') || '',
              phone: userIdentifier?.phone || '',
              citizenId: userIdentifier?.citizenId || '',
              country: userIdentifier?.country || localStorage.getItem('citizen_country') || 'IN',
              userAgent: navigator.userAgent,
            }),
          });
        } catch (apiErr) {
          console.warn('Failed to sync push token with server:', apiErr);
        }

        return { success: true, token, permission: 'granted' };
      }

      return {
        success: false,
        error: 'Failed to retrieve FCM device token.',
        permission: 'granted',
      };
    } catch (err: any) {
      console.error('Error enabling push notifications:', err);
      return {
        success: false,
        error: err?.message || 'Error configuring notifications',
      };
    }
  }

  // 4. Foreground Message Handler (When user is currently using the app)
  public async setupForegroundListener(
    onMessageCallback: (payload: { title: string; body: string; url?: string }) => void
  ) {
    const messaging = await this.getMessagingInstance();
    if (!messaging) return;

    return onMessage(messaging, (payload) => {
      const title = payload.notification?.title || payload.data?.title || 'Citizen Life OS Alert';
      const body = payload.notification?.body || payload.data?.body || 'New verified opportunity available.';
      const url = payload.data?.url || payload.fcmOptions?.link || '/';

      onMessageCallback({ title, body, url });

      // Also display a system alert if permitted
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: '/icon.png',
            data: { url },
          });
        } catch (e) {
          // Silent fallback
        }
      }
    });
  }

  // 5. Instant Test Notification (Triggers a real notification on lock screen / drawer right now)
  public async sendLocalTestNotification(language: 'hi' | 'en' = 'hi'): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;

    if (Notification.permission !== 'granted') {
      const res = await this.requestPermission();
      if (!res.success) return false;
    }

    const title = language === 'hi' 
      ? '🔔 Citizen Life OS — टेस्ट अलर्ट' 
      : '🔔 Citizen Life OS — Test Alert';
    const body = language === 'hi'
      ? 'बधाई! आपके फोन की लॉक स्क्रीन व होम स्क्रीन पर सूचनाएं सफलतापूर्वक सक्रिय हो गई हैं।'
      : 'Success! Push notifications are now active on your lock screen and home screen.';

    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification(title, {
          body,
          icon: '/icon.png',
          badge: '/icon.png',
          vibrate: [200, 100, 200],
          data: { url: '/' },
          tag: 'test-notification',
          renotify: true,
        } as any);
        return true;
      } else {
        new Notification(title, {
          body,
          icon: '/icon.png',
        });
        return true;
      }
    } catch (err) {
      console.warn('Local test notification notice:', err);
      return false;
    }
  }
}

export const pushNotificationService = new PushNotificationService();
