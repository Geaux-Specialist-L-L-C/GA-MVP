/* eslint-env serviceworker */
/* global clients, firebase */

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');
importScripts('./firebase-config.js');

// Firebase Service Worker for Auth and Messaging
firebase.initializeApp(self.FIREBASE_CONFIG);

const CACHE_NAME = 'geaux-academy-cache-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache for offline support
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/vite.svg',
  '/google-icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CACHE_ASSETS);
        await self.skipWaiting(); // Ensure new service worker takes over immediately
      } catch (error) {
        console.error('Failed to install service worker:', error);
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
      // Take control of all pages immediately
      await self.clients.claim();
      notifyWindowsAboutReadyState();
    } catch (error) {
      console.error('Activation error:', error);
    }
  })());
});
function notifyWindowsAboutReadyState() {
  self.clients.matchAll({ 
    type: 'window',
    includeUncontrolled: true 
  }).then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'FIREBASE_SERVICE_WORKER_READY', ready: true });
    });
  });
}

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    try {
      // Handle auth-related requests
      if (event.request.url.includes('/__/auth/')) {
        const response = await fetch(event.request);
        const clonedResponse = response.clone();

        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: 'AUTH_RESPONSE',
            status: response.status,
            ok: response.ok
          });
          // Log the auth fetch error to help diagnose issues with authentication requests
        });

        return clonedResponse;
      }

      // Network-first strategy for dynamic content
      if (event.request.mode === 'navigate') {
        try {
          return await fetch(event.request);
        } catch {
          return await caches.match(OFFLINE_URL);
        }
      }

      // Cache-first strategy for static assets
      if (event.request.destination === 'image' ||
          event.request.destination === 'style' ||
          event.request.destination === 'script') {
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || await fetch(event.request);
      }

      // Network-first strategy for other requests
      const response = await fetch(event.request);
      if (response.ok) {
        const clonedResponse = response.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, clonedResponse);
      }
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      return await caches.match(event.request);
    }
  })());
});
self.addEventListener('message', (event) => {
  if (event.data.type === 'FIREBASE_AUTH_POPUP') {
    event.waitUntil(handleFirebaseAuthPopup());
  }
});

async function handleFirebaseAuthPopup() {
  const isReady = 'serviceWorker' in navigator && navigator.serviceWorker.controller;
  let retryCount = 0;
  const maxRetries = 3;

  const findAuthPopup = async () => {
    const allClients = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });
    
    return allClients.find(client => 
      client.url.includes('/__/auth/handler') &&
      new URL(client.url).origin === self.location.origin
    );
  };

  const notifyMainWindow = async (type, message) => {
    const windows = await clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true
    });
    
    const mainClient = windows.find(c => 
      !c.url.includes('/__/auth/') && 
      new URL(c.url).origin === self.location.origin
    );
    
    if (mainClient) {
      mainClient.postMessage({ type, message });
    }
  };

  const retryDelay = (retryCount) => new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));

  try {
    await notifyMainWindow('FIREBASE_SERVICE_WORKER_READY', { ready: isReady });
    
    if (!isReady) {
      throw new Error('Service worker not ready');
    }

    let authClient;
    while (!authClient && retryCount < maxRetries) {
      authClient = await findAuthPopup();
      if (!authClient) {
        retryCount++;
        await retryDelay(retryCount);
      }
    }

    if (authClient) {
      await authClient.focus();
      await notifyMainWindow('FIREBASE_AUTH_POPUP_READY', { status: 'ready' });
    } else {
      throw new Error('Could not find auth popup after retries');
    }
  } catch (error) {
    console.error('Firebase auth popup handling error:', error);
    await notifyMainWindow('FIREBASE_AUTH_POPUP_ERROR', { 
      error: error.message,
      fallbackToRedirect: true 
    });
  }
}