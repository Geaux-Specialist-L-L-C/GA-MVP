/* eslint-env serviceworker */
/* global clients */

// Firebase Service Worker configuration
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      // Clear any old auth caches
      caches.keys().then(keys => 
        Promise.all(
          keys.filter(key => key.startsWith('firebase-auth-'))
            .map(key => caches.delete(key))
        )
      )
    ])
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // Clear any old IndexedDB data
      indexedDB.databases().then(dbs => {
        dbs.forEach(db => {
          if (db.name.includes('firebaseauth')) {
            indexedDB.deleteDatabase(db.name);
          }
        });
      }).catch(() => {
        // Ignore errors if IndexedDB is not available
      })
    ])
  );
});

// Enhanced popup handling with retry logic
self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_AUTH_POPUP') {
    event.waitUntil(
      (async () => {
        let retryCount = 0;
        const maxRetries = 3;
        
        const findAuthPopup = async () => {
          const allClients = await clients.matchAll({
            type: 'window',
            includeUncontrolled: true
          });
          
          return allClients.find(client => 
            client.url.includes('/__/auth/handler')
          );
        };

        const notifyMainWindow = async (type, message) => {
          const mainClient = await clients.matchAll({ type: 'window' })
            .then(clients => clients.find(c => !c.url.includes('/__/auth/')));
          
          if (mainClient) {
            mainClient.postMessage({ type, message });
          }
        };

        try {
          let authClient;
          // Retry logic for finding the auth popup
          while (!authClient && retryCount < maxRetries) {
            authClient = await findAuthPopup();
            if (!authClient) {
              retryCount++;
              await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, retryCount)));
            }
          }

          if (authClient) {
            await authClient.focus();
            await notifyMainWindow('FIREBASE_AUTH_POPUP_READY', 'Auth popup is ready');
          } else {
            throw new Error('Could not find auth popup after retries');
          }
        } catch (error) {
          console.error('Firebase auth popup handling error:', error);
          await notifyMainWindow('FIREBASE_AUTH_ERROR', {
            message: 'Popup handling failed',
            error: error.message
          });
        }
      })()
    );
  }
});

// Enhanced fetch handler for auth requests with timeout and retry
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/__/auth/')) {
    event.respondWith(
      (async () => {
        const timeout = 30000; // 30 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(event.request, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('Auth fetch error:', error);
          
          // Notify main window about the fetch error
          const mainClient = await clients.matchAll({ type: 'window' })
            .then(clients => clients.find(c => !c.url.includes('/__/auth/')));
          
          if (mainClient) {
            mainClient.postMessage({
              type: 'FIREBASE_AUTH_FETCH_ERROR',
              error: error.name === 'AbortError' ? 'Request timed out' : error.message
            });
          }
          
          return Response.error();
        }
      })()
    );
  }
});