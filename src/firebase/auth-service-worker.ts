// Helper to check and load Firebase auth service worker
export async function initializeAuthServiceWorker(retryAttempts = 3, retryDelay = 1000) {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported in this browser');
    return false;
  }

  const registerWithRetry = async (attempt = 0): Promise<boolean> => {
    try {
      // Register service worker with proper scope for auth
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/__/auth/',
        updateViaCache: 'none' // Prevent caching issues with SSL certificates
      });

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;

      // Add message listener for service worker communication
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

      // Verify the service worker is active
      if (registration.active?.state === 'activated') {
        console.debug('Firebase auth service worker registered and activated');
        return true;
      }

      // Wait for activation if needed
      await new Promise<void>((resolve) => {
        if (registration.active) {
          resolve();
          return;
        }

        registration.addEventListener('activate', () => resolve());
      });

      return true;
    } catch (error: any) {
      if (error.name === 'SecurityError' && attempt < retryAttempts) {
        console.warn(`SSL certificate error, retrying in ${retryDelay}ms... (${attempt + 1}/${retryAttempts})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        return registerWithRetry(attempt + 1);
      }

      console.error('Failed to register auth service worker:', error);
      return false;
    }
  };

  return registerWithRetry();
}

function handleServiceWorkerMessage(event: MessageEvent) {
  switch (event.data?.type) {
    case 'FIREBASE_SERVICE_WORKER_READY':
      console.debug('Firebase auth service worker ready');
      break;
    case 'FIREBASE_AUTH_POPUP_READY':
      console.debug('Firebase auth popup ready');
      break;
    case 'FIREBASE_AUTH_POPUP_ERROR':
      if (event.data.fallbackToRedirect) {
        console.warn('Popup failed, falling back to redirect method');
      }
      break;
    case 'AUTH_RESPONSE':
      if (!event.data.ok) {
        console.error('Auth response error:', event.data.status);
      }
      break;
  }
}