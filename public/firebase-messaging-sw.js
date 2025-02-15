/* eslint-env serviceworker */
/* global clients, firebase, importScripts */

// Load Firebase essentials first
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Load Firebase configuration
importScripts('./firebase-config.js');

// Initialize Firebase
const FIREBASE_CONFIG = self.FIREBASE_CONFIG || {};
firebase.initializeApp(FIREBASE_CONFIG);

const CACHE_NAME = 'geaux-academy-cache-v1';
const OFFLINE_URL = '/offline.html';
const SECURE_ORIGIN = self.location.protocol === 'https:';

// Define allowed domains for different purposes
const ANALYTICS_DOMAINS = [
  'www.googletagmanager.com',
  'www.google-analytics.com',
  'analytics.google.com',
  'tagmanager.google.com'
];

const FIREBASE_DOMAINS = [
  'firebaseinstallations.googleapis.com',
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'firebaseio.com',
  'firebase.googleapis.com'
];

const FONT_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  '*.public.atl-paas.net'
];

const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/vite.svg',
  '/google-icon.svg',
  '/images/logo.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CACHE_ASSETS);
        console.info('Service worker installed successfully');
      } catch (error) {
        console.error('Failed to install service worker:', error);
      }
    })()
  );
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
});

async function notifyWindowsAboutReadyState() {
  const allClients = await clients.matchAll({
    includeUncontrolled: true,
    type: 'window'
  });
  
  allClients.forEach(client => {
    client.postMessage({
      type: 'FIREBASE_SERVICE_WORKER_READY',
      secure: SECURE_ORIGIN
    });
  });
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Allow Google Analytics/Tag Manager requests
  if (ANALYTICS_DOMAINS.some(domain => url.hostname.includes(domain))) {
    event.respondWith(
      fetch(event.request, {
        mode: 'cors',
        credentials: 'omit'
      })
    );
    return;
  }

  // Handle Firebase/Google API requests
  if (FIREBASE_DOMAINS.some(domain => url.hostname.includes(domain)) || 
      event.request.url.includes('/__/auth/')) {
    event.respondWith(
      fetch(event.request, {
        credentials: 'include',
        mode: 'cors',
      })
    );
    return;
  }

  // Handle font requests
  if (FONT_DOMAINS.some(domain => {
    if (domain.startsWith('*.')) {
      return url.hostname.endsWith(domain.slice(2));
    }
    return url.hostname === domain;
  })) {
    event.respondWith(
      fetch(event.request, {
        mode: 'cors',
        credentials: 'omit'
      })
    );
    return;
  }

  // Handle auth popup requests
  if (event.request.url.includes('/__/auth/handler')) {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: 'AUTH_RESPONSE',
            status: response.status,
            ok: response.ok
          });
        });
        return response;
      } catch (error) {
        console.error('Auth handler error:', error);
        return new Response(null, { status: 500 });
      }
    })());
    return;
  }

  // Handle all other requests
  event.respondWith((async () => {
    try {
      // Try network first
      const response = await fetch(event.request);
      if (!response || response.status === 404) {
        throw new Error('Resource not found');
      }
      
      // Cache successful responses
      if (response.ok && event.request.method === 'GET') {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      
      return response;
    } catch (error) {
      // Fall back to cache
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      return cachedResponse || await cache.match(OFFLINE_URL);
    }
  })());
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'FIREBASE_AUTH_POPUP') {
    event.waitUntil(handleFirebaseAuthPopup());
  }
});

// Handle auth state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Notify all clients about the auth state change
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

async function handleFirebaseAuthPopup() {
  const isReady = 'serviceWorker' in navigator && self.registration.active;
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
    await notifyMainWindow('FIREBASE_AUTH_POPUP_ERROR', { 
      error: error.message,
      fallbackToRedirect: true,
      https: true
    });
  }
}