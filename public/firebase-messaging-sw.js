// Firebase Service Worker for improved popup handling
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Handle auth popups in Firefox and other browsers
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'FIREBASE_AUTH_POPUP') {
    // Keep service worker alive during auth popup
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      })
    );
  }
});