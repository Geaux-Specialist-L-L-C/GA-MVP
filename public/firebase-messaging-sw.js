
// File: public/firebase-messaging-sw.js
// Description: Modular Firebase Cloud Messaging service worker (background notifications)
// Author: GitHub Copilot
// Created: 2025-09-07
// Version: 2.1.1
// Registration example (in app code):
// navigator.serviceWorker.register(`/firebase-messaging-sw.js?${new URLSearchParams({ apiKey: ..., authDomain: ..., projectId: ..., storageBucket: ..., messagingSenderId: ..., appId: ... })}`, { type: 'module' });

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getMessaging, onBackgroundMessage } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-sw.js';

const params = new URL(self.location.href).searchParams;
const getParam = (k) => params.get(k) || '';
const firebaseConfig = {
  apiKey: getParam('apiKey'),
  authDomain: getParam('authDomain'),
  projectId: getParam('projectId'),
  storageBucket: getParam('storageBucket'),
  messagingSenderId: getParam('messagingSenderId'),
  appId: getParam('appId')
};

let messaging;
try {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
  console.info('[firebase-messaging-sw] init ok', { projectId: firebaseConfig.projectId });
} catch (err) {
  console.error('[firebase-messaging-sw] init failed', err);
}

if (messaging) {
  onBackgroundMessage(messaging, (payload) => {
    const title = payload?.notification?.title || 'Notification';
    const options = {
      body: payload?.notification?.body || '',
      icon: '/images/logo.svg',
      badge: '/images/logo.svg',
      tag: 'geaux-academy-notification',
      data: payload?.data || {}
    };
    self.registration.showNotification(title, options);
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.clickAction || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsArr => {
      for (const client of clientsArr) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
      return null;
    })
  );
});

console.info('[firebase-messaging-sw] loaded');

// End of file
