// File: /src/firebase/auth-service-worker.ts
// Description: Firebase auth service worker initialization and management
// Author: GitHub Copilot
// Created: 2023-10-10

interface ServiceWorkerError extends Error {
  name: string;
  code?: string;
}

interface AuthServiceWorkerMessage {
  type: string;
  status?: number;
  ok?: boolean;
  fallbackToRedirect?: boolean;
  error?: string;
  secure?: boolean;
}

export async function initializeAuthServiceWorker(retryAttempts = 3, retryDelay = 1000) {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported in this browser');
    return false;
  }

  if (!window.isSecureContext) {
    console.warn('Service Worker registration requires a secure context (HTTPS or localhost)');
    return false;
  }

  const registerWithRetry = async (attempt = 0): Promise<boolean> => {
    try {
      // Clean up existing service workers
      const existingRegistrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(existingRegistrations.map(reg => reg.unregister()));

      // Register service worker with proper scope for auth
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/__/auth/',
        updateViaCache: 'none'
      });

      // Wait for the service worker to be ready with timeout
      await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Service worker registration timeout')), 10000)
        )
      ]);

      // Add message listener for service worker communication
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

      // Wait for activation if needed
      if (!registration.active || registration.active.state !== 'activated') {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Service worker activation timeout'));
          }, 10000);

          registration.addEventListener('activate', () => {
            clearTimeout(timeout);
            resolve();
          });
        });
      }

      // Verify https is available for auth operations
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        throw new Error('HTTPS is required for secure authentication operations');
      }

      console.debug('Firebase auth service worker registered and activated successfully');
      return true;

    } catch (error: any) {
      const serviceWorkerError = error as ServiceWorkerError;
      
      if (attempt < retryAttempts) {
        const delay = retryDelay * Math.pow(2, attempt);
        
        if (serviceWorkerError.name === 'SecurityError') {
          console.warn(`SSL certificate error, retrying in ${delay}ms... (${attempt + 1}/${retryAttempts})`);
        } else if (serviceWorkerError.name === 'NetworkError') {
          console.warn(`Network error during service worker registration, retrying in ${delay}ms... (${attempt + 1}/${retryAttempts})`);
        } else {
          console.warn(`Service worker registration failed, retrying in ${delay}ms... (${attempt + 1}/${retryAttempts})`);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return registerWithRetry(attempt + 1);
      }

      console.error('Failed to register auth service worker:', {
        error: serviceWorkerError.message,
        name: serviceWorkerError.name,
        code: serviceWorkerError.code
      });
      
      return false;
    }
  };

  return registerWithRetry();
}

function handleServiceWorkerMessage(event: MessageEvent<AuthServiceWorkerMessage>) {
  const { type, status, ok, fallbackToRedirect, error } = event.data;

  switch (type) {
    case 'FIREBASE_SERVICE_WORKER_READY':
      console.debug('Firebase auth service worker ready');
      break;
      
    case 'FIREBASE_AUTH_POPUP_READY':
      console.debug('Firebase auth popup ready');
      break;
      
    case 'FIREBASE_AUTH_POPUP_ERROR':
      if (fallbackToRedirect) {
        console.warn('Popup authentication failed, falling back to redirect method');
      }
      if (error) {
        console.error('Popup error:', error);
      }
      break;
      
    case 'AUTH_RESPONSE':
      if (!ok) {
        console.error('Authentication response error:', status);
        // Broadcast auth error to main app
        window.dispatchEvent(new CustomEvent('firebase-auth-error', { 
          detail: { status, error } 
        }));
      }
      break;
      
    case 'SECURE_CONTEXT_CHECK':
      if (!event.data.secure) {
        console.warn('Authentication requires a secure context (HTTPS)');
      }
      break;
  }
}