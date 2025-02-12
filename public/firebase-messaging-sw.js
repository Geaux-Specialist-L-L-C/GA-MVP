/* eslint-env serviceworker */
/* global clients */

// Firebase Service Worker configuration
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
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
  event.waitUntil(clients.claim());
});

// Enhanced popup handling
self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_AUTH_POPUP') {
    event.waitUntil(
      (async () => {
        try {
          const allClients = await clients.matchAll({
            type: 'window',
            includeUncontrolled: true
          });
          
          // Find and focus the auth popup
          const authClient = allClients.find(client => 
            client.url.includes('/__/auth/handler')
          );

          if (authClient) {
            await authClient.focus();
          }
        } catch (error) {
          console.error('Firebase auth popup handling error:', error);
          // Notify main window about the error
          const mainClient = await clients.matchAll({ type: 'window' })
            .then(clients => clients.find(c => !c.url.includes('/__/auth/')));
          if (mainClient) {
            mainClient.postMessage({
              type: 'FIREBASE_AUTH_ERROR',
              error: 'Popup handling failed'
            });
          }
        }
      })()
    );
  }
});

// Add fetch handler for auth requests
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/__/auth/')) {
    event.respondWith(
      fetch(event.request).catch(error => {
        console.error('Auth fetch error:', error);
        return Response.error();
      })
    );
  }
});