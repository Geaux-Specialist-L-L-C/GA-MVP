// Helper to check and load Firebase auth service worker
export async function initializeAuthServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported in this browser');
    return false;
  }

  try {
    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/__/auth/'
    });

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    // Add message listener for service worker communication
    navigator.serviceWorker.addEventListener('message', (event) => {
      switch (event.data.type) {
        case 'FIREBASE_SERVICE_WORKER_READY':
          console.debug('Firebase auth service worker ready');
          break;
        case 'FIREBASE_AUTH_POPUP_READY':
          console.debug('Firebase auth popup ready');
          break;
        case 'FIREBASE_AUTH_POPUP_ERROR':
          if (event.data.fallbackToRedirect) {
            console.warn('Popup failed, falling back to redirect method');
            // The AuthContext will handle the redirect automatically
          }
          break;
        case 'AUTH_RESPONSE':
          if (!event.data.ok) {
            console.error('Auth response error:', event.data.status);
          }
          break;
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to register auth service worker:', error);
    return false;
  }
}