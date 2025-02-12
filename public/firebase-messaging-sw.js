/* eslint-env serviceworker */
/* global clients */

// Firebase Service Worker configuration
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      // Clear old caches if needed
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
      // Initialize any background sync or periodic sync if needed
      self.registration.sync?.register('firebaseAuth')
    ])
  );
});

// Enhanced popup handling for Firefox and other browsers
self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_AUTH_POPUP') {
    event.waitUntil(
      (async () => {
        try {
          const allClients = await clients.matchAll({
            type: 'window',
            includeUncontrolled: true
          });
          
          // Keep track of popup window
          const authClient = allClients.find(client => 
            client.url.includes('/__/auth/handler')
          );

          if (authClient) {
            // Ensure popup stays focused
            await authClient.focus();
          }
        } catch (error) {
          console.error('Firebase auth popup handling error:', error);
        }
      })()
    );
  }
});

// Add fetch handler for auth requests if needed
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/__/auth/')) {
    // Special handling for auth-related requests
    event.respondWith(
      fetch(event.request).catch(error => {
        console.error('Auth fetch error:', error);
        // Return a custom response or handle error
        return new Response(JSON.stringify({ error: 'Auth request failed' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
  }
});