/* eslint-env serviceworker */
/* global clients */

let isReady = false;

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
    ]).then(() => {
      isReady = true;
      notifyWindowsAboutReadyState();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // Clear any old IndexedDB data
      indexedDB.databases().then(dbs => {
        return Promise.all(dbs.map(db => {
          if (db.name.includes('firebaseauth')) {
            return indexedDB.deleteDatabase(db.name);
          }
        }));
      }).catch(() => {
        // Ignore errors if IndexedDB is not available
      })
    ]).then(() => {
      isReady = true;
      notifyWindowsAboutReadyState();
    })
  );
});

function notifyWindowsAboutReadyState() {
  clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'FIREBASE_SERVICE_WORKER_READY',
        ready: isReady
      });
    });
  });
}

// Enhanced popup handling with retry logic and connection state
self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_AUTH_POPUP') {
    event.waitUntil(
      (async () => {
        let retryCount = 0;
        const maxRetries = 3;
        const retryDelay = 100;
        
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
          const windows = await clients.matchAll({ 
            type: 'window',
            includeUncontrolled: true
          });
          
          const mainClient = windows.find(c => !c.url.includes('/__/auth/'));
          if (mainClient) {
            mainClient.postMessage({ type, message });
          }
        };

        try {
          // Send ready state immediately
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
            await notifyMainWindow('FIREBASE_AUTH_POPUP_READY', 'Auth popup is ready');
          } else {
            throw new Error('Could not find auth popup after retries');
          }
        } catch (error) {
          console.error('Firebase auth popup handling error:', error);
          await notifyMainWindow('FIREBASE_AUTH_ERROR', {
            message: 'Popup handling failed',
            error: error.message,
            code: 'auth/popup-connection-failed'
          });
        }
      })()
    );
  }
});

// Handle auth requests with improved error handling
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/__/auth/')) {
    event.respondWith(
      (async () => {
        const timeout = 30000;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(event.request, {
            signal: controller.signal,
            credentials: 'include'
          });
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('Auth fetch error:', error);
          
          // Notify main window about fetch errors
          const mainClient = await clients.matchAll({ type: 'window' })
            .then(clients => clients.find(c => !c.url.includes('/__/auth/')));
          
          if (mainClient) {
            mainClient.postMessage({
              type: 'FIREBASE_AUTH_FETCH_ERROR',
              error: error.name === 'AbortError' ? 'Request timed out' : error.message,
              code: 'auth/network-request-failed'
            });
          }
          
          return Response.error();
        }
      })()
    );
  }
});