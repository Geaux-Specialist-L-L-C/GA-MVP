// File: /src/firebase/auth-service-worker.ts
// Description: Service worker registration for Firebase auth
// Author: GitHub Copilot
// Created: 2024-02-12

import { enableIndexedDbPersistence, type FirestoreSettings } from 'firebase/firestore';
import { db } from './config';

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

const SW_TIMEOUT = 10000; // 10 seconds timeout for service worker registration

const registerAuthServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/__/auth/'
      });

      // Configure service worker timeout
      const timeout = Number(import.meta.env.VITE_SERVICE_WORKER_TIMEOUT) || 10000;
      
      // Wait for the service worker to be ready
      await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Service Worker registration timeout')), timeout)
        )
      ]);

      // Send initial configuration
      registration.active?.postMessage({
        type: 'FIREBASE_AUTH_POPUP',
        origin: window.location.origin
      });

      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw error;
    }
  }
  throw new Error('Service workers are not supported in this browser');
};

export const initAuthServiceWorker = async () => {
  try {
    await registerAuthServiceWorker();
  } catch (error) {
    console.warn('Auth service worker initialization failed, falling back to redirect method:', error);
    // Service worker failed, will use redirect method instead
    return false;
  }
  return true;
};

export default initAuthServiceWorker;

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