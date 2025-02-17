// File: /src/firebase/firebase-messaging-sw.ts
// Description: Firebase service worker configuration for handling background messages and notifications
// Author: GitHub Copilot
// Created: 2024-02-17

/// <reference lib="webworker" />

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage, MessagePayload } from 'firebase/messaging/sw';
import { firebaseConfig } from './config';

declare const self: ServiceWorkerGlobalScope;

// Initialize Firebase in the service worker
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload: MessagePayload) => {
  console.log('[Firebase Messaging SW] Received background message:', payload);

  // Customize notification here
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
  
  // Add custom click handling here
  const clickAction = event.notification.data?.clickAction || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // If a window client is already open, focus it
        for (const client of windowClients) {
          if (client.url === clickAction && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(clickAction);
        }
      })
  );
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Take control of all pages immediately
      self.clients.claim(),
      // Optional: Clean up old caches here if needed
    ])
  );
});