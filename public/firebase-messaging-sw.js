/* eslint-env serviceworker */
/* global clients */

// Firebase Auth Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  notifyWindowsAboutReadyState();
});

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

let isReady = false;

function notifyWindowsAboutReadyState() {
  isReady = true;
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'FIREBASE_SERVICE_WORKER_READY', ready: true });
    });
  });
}

// Enhanced popup handling with retry logic
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
            message: 'Authentication popup handling failed. Please try again.',
            error: error.message,
            code: 'auth/popup-connection-failed'
          });
        }
      })()
    );
  }
});

// Handle auth requests with improved error handling and CORS support
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
            credentials: 'include',
            // Add headers to handle CORS and COEP issues
            mode: 'cors',
            headers: {
              'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
              'Cross-Origin-Embedder-Policy': 'credentialless'
            }
          });
          clearTimeout(timeoutId);
          
          // Clone the response and add CORS headers
          const corsHeaders = new Headers(response.headers);
          corsHeaders.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
          corsHeaders.set('Cross-Origin-Embedder-Policy', 'credentialless');
          
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: corsHeaders
          });
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