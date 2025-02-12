/* eslint-env serviceworker */
/* global clients, firebase, importScripts */

// File: /public/firebase-messaging-sw.js
// Description: Firebase service worker for auth popup handling
// Author: GitHub Copilot
// Created: 2024-02-12

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');
importScripts('./firebase-config.js');

const TIMEOUT = parseInt(self.VITE_SERVICE_WORKER_TIMEOUT || '10000', 10);
const AUTH_ERROR_MESSAGES = {
  'auth/popup-closed-by-user': 'Sign-in window was closed. Please try again.',
  'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups and try again.',
  'auth/network-request-failed': 'Network error. Please check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/unauthorized-domain': 'Authentication not allowed on this domain.',
};

firebase.initializeApp({
  apiKey: self.VITE_FIREBASE_API_KEY,
  authDomain: self.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: self.VITE_FIREBASE_PROJECT_ID,
  storageBucket: self.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: self.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: self.VITE_FIREBASE_APP_ID,
  measurementId: self.VITE_FIREBASE_MEASUREMENT_ID
});

const CACHE_NAME = 'geaux-academy-cache-v1';
const OFFLINE_URL = '/offline.html';

const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/vite.svg',
  '/google-icon.svg',
  '/.cert/cert.pem'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CACHE_ASSETS);
        await self.skipWaiting();
        console.info('Service worker installed successfully');
      } catch (error) {
        console.error('Failed to install service worker:', error);
      }
    })()
  );
  console.log('Service worker installed successfully');
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
      await self.clients.claim();
      notifyWindowsAboutReadyState();
    } catch (error) {
      console.error('Activation error:', error);
    }
  })());
  console.log('Service worker installed successfully');
});
function notifyWindowsAboutReadyState() {
  self.clients.matchAll({ 
    type: 'window',
    includeUncontrolled: true 
  }).then(clients => {
    clients.forEach(client => {
      client.postMessage({ 
        type: 'FIREBASE_SERVICE_WORKER_READY', 
        ready: true,
        https: true 
      });
    });
  });
}

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    try {
      if (event.request.url.includes('/__/auth/')) {
        const response = await fetch(event.request);
        const clonedResponse = response.clone();

        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: 'AUTH_RESPONSE',
            status: response.status,
            ok: response.ok,
            secure: event.request.url.startsWith('https')
          });
        });

        return clonedResponse;
      }

      if (event.request.mode === 'navigate') {
        try {
          const response = await fetch(event.request);
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, response.clone());
          }
          return response;
        } catch {
          const cached = await caches.match(OFFLINE_URL);
          return cached || new Response('Offline');
        }
      }

      if (event.request.destination === 'image' ||
          event.request.destination === 'style' ||
          event.request.destination === 'script') {
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || await fetch(event.request);
      }

      const response = await fetch(event.request);
      if (response.ok) {
        const clonedResponse = response.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, clonedResponse);
      }
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      return await caches.match(event.request) || caches.match(OFFLINE_URL);
    }
  })());
});
self.addEventListener('message', (event) => {
  if (event.data.type === 'FIREBASE_AUTH_POPUP') {
    event.waitUntil(handleFirebaseAuthPopup());
  }
  if (event.data && event.data.type === 'AUTH_ERROR') {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'AUTH_ERROR',
          error: event.data.error
        });
      });
    });
  }
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'AUTH_STATE_CHANGED',
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          }
        });
      });
    });
  }
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { notification } = payload;
  if (notification) {
    const options = {
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      data: payload.data
    };
    
    self.registration.showNotification(notification.title, options);
  }
});

const keepAliveInterval = setInterval(() => {
  self.clients.matchAll().then((clients) => {
    if (clients.length === 0) {
      clearInterval(keepAliveInterval);
      self.registration.unregister();
    }
  });
}, TIMEOUT);

async function handleFirebaseAuthPopup() {
  const isReady = 'serviceWorker' in navigator && self.registration.active;
  let retryCount = 0;
  const maxRetries = 3;

  const handleAuthError = async (error) => {
    const errorCode = error.code || 'auth/unknown';
    const userMessage = AUTH_ERROR_MESSAGES[errorCode] || 'Authentication failed. Please try again.';
    
    await notifyMainWindow('FIREBASE_AUTH_POPUP_ERROR', { 
      error: userMessage,
      code: errorCode,
      fallbackToRedirect: error.code === 'auth/popup-blocked',
      https: true,
      retryAvailable: retryCount < maxRetries
    });

    if (error.code === 'auth/popup-closed-by-user') {
      await notifyMainWindow('AUTH_RETRY_AVAILABLE', {
        message: 'Would you like to try signing in again?'
      });
    }
  };

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

  const retryDelay = (count) => new Promise(resolve => 
    setTimeout(resolve, Math.min(1000 * Math.pow(2, count), 10000))
  );

  try {
    await notifyMainWindow('FIREBASE_SERVICE_WORKER_READY', { 
      ready: isReady,
      https: true
    });
    
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
      await notifyMainWindow('FIREBASE_AUTH_POPUP_READY', { 
        status: 'ready',
        secure: true
      });
    } else {
      throw new Error('Could not find auth popup after retries');
    }
  } catch (error) {
    console.error('Firebase auth popup handling error:', error);
    await handleAuthError(error);
  }
}

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'FIREBASE_AUTH_POPUP') {
    self.popupOrigin = event.data.origin;
  }
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('/__/auth/')) {
    event.respondWith(
      fetch(event.request).catch(error => {
        console.error('Auth popup fetch error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to complete authentication' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
  }
});