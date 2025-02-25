declare const self: ServiceWorkerGlobalScope;

// Firebase configuration will be injected by the build process
declare const FIREBASE_CONFIG: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
};

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage, MessagePayload } from 'firebase/messaging/sw';

// Initialize Firebase in the service worker
const app = initializeApp(FIREBASE_CONFIG);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload: MessagePayload) => {
  console.log('[Firebase Messaging SW] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions: NotificationOptions = {
    body: payload.notification?.body,
    icon: '/images/logo.svg',
    badge: '/images/logo.svg',
    tag: payload.collapseKey || 'default',
    data: payload.data,
    requireInteraction: true,
    silent: false
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const clickAction = event.notification.data?.clickAction || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url === clickAction && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(clickAction);
        }
      })
  );
});

// Handle service worker installation
self.addEventListener('install', () => {
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up any old caches if needed
      caches.keys().then(keys => 
        Promise.all(
          keys.map(key => {
            if (key.startsWith('firebase-messaging-')) {
              return caches.delete(key);
            }
            return Promise.resolve();
          })
        )
      )
    ])
  );
});
