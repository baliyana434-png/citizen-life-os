// Firebase Cloud Messaging Service Worker for Citizen Life OS
// Handles background lock-screen & system drawer push notifications

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAOHH-q4-mKpTHcwUjezHrlBFDo9Xs3u44",
  authDomain: "lifeos-7a6f1.firebaseapp.com",
  projectId: "lifeos-7a6f1",
  storageBucket: "lifeos-7a6f1.firebasestorage.app",
  messagingSenderId: "316506287911",
  appId: "1:316506287911:web:cfda70c003fa4f31864302"
});

const messaging = firebase.messaging();

// 1. Background Message Listener (FCM payload)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background push:', payload);

  const title = payload.notification?.title || payload.data?.title || 'Citizen Life OS — नया अवसर अलर्ट';
  const body = payload.notification?.body || payload.data?.body || 'आपके लिए नया सत्यापित सरकारी अवसर उपलब्ध है। अभी देखें।';
  const icon = payload.notification?.icon || payload.data?.icon || '/icon.png';
  const targetUrl = payload.data?.url || payload.fcmOptions?.link || '/';

  const notificationOptions = {
    body,
    icon,
    badge: '/icon.png',
    vibrate: [200, 100, 200],
    data: {
      url: targetUrl,
      timestamp: Date.now()
    },
    actions: [
      { action: 'open_url', title: 'विवरण देखें (View)' },
      { action: 'dismiss', title: 'बंद करें (Close)' }
    ],
    tag: payload.data?.tag || 'citizen-opportunity-alert',
    renotify: true
  };

  self.registration.showNotification(title, notificationOptions);
});

// 2. Direct Raw Web Push Listener (Fallback for standard web push)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || data.notification?.title || 'Citizen Life OS Alert';
    const body = data.body || data.notification?.body || 'New government scheme announcement.';
    const url = data.url || data.data?.url || '/';

    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: '/icon.png',
        badge: '/icon.png',
        vibrate: [200, 100, 200],
        data: { url },
        tag: 'citizen-alert',
        renotify: true
      })
    );
  } catch (e) {
    // Non-JSON string push
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('Citizen Life OS Alert', {
        body: text,
        icon: '/icon.png',
        badge: '/icon.png'
      })
    );
  }
});

// 3. User Clicks Notification on Lock Screen or Notification Drawer
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it and navigate
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client && targetUrl !== '/') {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
