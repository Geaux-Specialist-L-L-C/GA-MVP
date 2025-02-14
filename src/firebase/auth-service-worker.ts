// File: /src/firebase/auth-service-worker.ts
// Description: Service worker initialization with enhanced security
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

interface ServiceWorkerRegistrationResult {
  success: boolean;
  isSecure: boolean;
  supportsServiceWorker: boolean;
  error?: string;
}

const SW_TIMEOUT = 10000; // 10 seconds timeout for service worker registration

const isSecureContext = (): boolean => {
  return window.isSecureContext && (
    window.location.protocol === 'https:' || 
    window.location.hostname === 'localhost'
  );
};

let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

export const registerAuthServiceWorker = async (): Promise<{
  success: boolean;
  isSecure: boolean;
  supportsServiceWorker: boolean;
  error?: string;
}> => {
  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: false,
      error: 'Service workers are not supported in this browser'
    };
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    // Remove any existing service workers to avoid conflicts
    await Promise.all(registrations.map(registration => registration.unregister()));

    const scope = '/__/auth';
    serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope,
      type: 'module',
      updateViaCache: 'none'
    });

    // Wait for the service worker to be ready
    if (serviceWorkerRegistration.active) {
      return {
        success: true,
        isSecure: true,
        supportsServiceWorker: true
      };
    }

    // Wait for activation
    await new Promise<void>((resolve) => {
      if (serviceWorkerRegistration?.active) {
        resolve();
        return;
      }

      serviceWorkerRegistration?.addEventListener('activate', () => {
        resolve();
      });
    });

    return {
      success: true,
      isSecure: window.isSecureContext,
      supportsServiceWorker: true
    };
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return {
      success: false,
      isSecure: window.isSecureContext,
      supportsServiceWorker: true,
      error: error instanceof Error ? error.message : 'Service worker registration failed'
    };
  }
};

export const initAuthServiceWorker = async (): Promise<boolean> => {
  const result = await registerAuthServiceWorker();
  
  // Dispatch initialization status event
  window.dispatchEvent(new CustomEvent('firebase-auth-worker-status', { 
    detail: result 
  }));

  if (!result.success) {
    console.warn('Auth service worker initialization failed:', result.error);
    // Log telemetry or analytics here if needed
    return false;
  }

  return true;
};

function handleServiceWorkerMessage(event: MessageEvent<AuthServiceWorkerMessage>) {
  const { type, status, ok, fallbackToRedirect, error, secure } = event.data;

  const dispatch = (eventName: string, detail: any) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  switch (type) {
    case 'FIREBASE_SERVICE_WORKER_READY':
      console.debug('Firebase auth service worker ready');
      dispatch('firebase-auth-worker-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_READY':
      console.debug('Firebase auth popup ready');
      dispatch('firebase-auth-popup-ready', { secure });
      break;
      
    case 'FIREBASE_AUTH_POPUP_ERROR':
      if (fallbackToRedirect) {
        console.warn('Popup authentication failed, falling back to redirect method');
      }
      dispatch('firebase-auth-error', { error, fallbackToRedirect });
      break;
      
    case 'AUTH_RESPONSE':
      if (!ok) {
        console.error('Authentication response error:', status);
        dispatch('firebase-auth-error', { status, error });
      } else {
        dispatch('firebase-auth-success', { status });
      }
      break;
      
    case 'SECURE_CONTEXT_CHECK':
      if (!secure) {
        console.warn('Authentication requires a secure context (HTTPS)');
        dispatch('firebase-auth-security', { secure: false });
      }
      break;
  }
}

export default initAuthServiceWorker;