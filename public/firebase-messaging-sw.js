/* eslint-env serviceworker */
/* global clients */

// Firebase Auth Service Worker with enhanced security
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      // Clear any old caches that might cause CORS issues
      caches.keys().then(keys => 
        Promise.all(
          keys.map(key => caches.delete(key))
        )
      )
    ])
  );
  notifyWindowsAboutReadyState();
});

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
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

// Enhanced popup handling with security improvements
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

// Handle fetch events to ensure proper CORS headers
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle same-origin auth-related requests
  if (url.origin === self.location.origin && 
      (url.pathname.includes('/__/auth/') || url.pathname.includes('/oauth2/')) 
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response so we can modify headers
          const newResponse = response.clone();
          
          // Add security headers
          const headers = new Headers(newResponse.headers);
          headers.set('Cross-Origin-Opener-Policy', 'same-origin');
          headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
          
          return new Response(newResponse.body, {
            status: newResponse.status,
            statusText: newResponse.statusText,
            headers
          });
        })
    );
  }
});