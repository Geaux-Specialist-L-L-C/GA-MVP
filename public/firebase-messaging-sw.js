/* eslint-env serviceworker */
/* global clients */

// Firebase Service Worker for Auth and Messaging
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
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(CACHE_ASSETS);
      }),
      self.skipWaiting() // Ensure new service worker takes over immediately
    ])
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages immediately
      self.clients.claim()
    ])
  );
});

let isReady = false;

function notifyWindowsAboutReadyState() {
  isReady = true;
  self.clients.matchAll({ 
    type: 'window',
    includeUncontrolled: true 
  }).then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'FIREBASE_SERVICE_WORKER_READY', ready: true });
    });
  });
}

// Handle fetch events and provide offline support
self.addEventListener('fetch', (event) => {
  // Handle auth-related requests
  if (event.request.url.includes('/__/auth/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before returning it
          const clonedResponse = response.clone();
          
          // Post message to main window about auth status
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: 'AUTH_RESPONSE',
                status: response.status,
                ok: response.ok
              });
            });
          });

          return clonedResponse;
        })
        .catch((error) => {
          console.error('Auth fetch error:', error);
          // Notify clients about the error
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: 'AUTH_ERROR',
                error: error.message
              });
            });
          });
          throw error;
        })
    );
    return;
  }

  // Network-first strategy for dynamic content
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Cache-first strategy for static assets
  if (event.request.destination === 'image' ||
      event.request.destination === 'style' ||
      event.request.destination === 'script') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
    return;
  }

  // Network-first strategy for other requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Handle auth popup messages
self.addEventListener('message', (event) => {
  if (event.data.type === 'FIREBASE_AUTH_POPUP') {
    event.waitUntil(
      (async () => {
        const isReady = 'serviceWorker' in navigator && navigator.serviceWorker.controller;
        let retryCount = 0;
        const maxRetries = 3;
        const retryDelay = 1000; // 1 second

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
              await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, retryCount)));
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
      })()
    );
  }
});