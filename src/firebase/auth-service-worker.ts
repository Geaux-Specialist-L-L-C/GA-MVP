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

const registerAuthServiceWorker = async (): Promise<ServiceWorkerRegistrationResult> => {
  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      isSecure: isSecureContext(),
      supportsServiceWorker: false,
      error: 'Service Workers are not supported in this browser'
    };
  }

  if (!isSecureContext()) {
    return {
      success: false,
      isSecure: false,
      supportsServiceWorker: true,
      error: 'Authentication requires a secure context (HTTPS)'
    };
  }

  try {
    // Unregister any existing service workers to ensure clean state
    const existingRegistrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(existingRegistrations.map(reg => reg.unregister()));

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/__/auth/',
      type: 'module'
    });

    const timeout = Number(import.meta.env.VITE_SERVICE_WORKER_TIMEOUT) || SW_TIMEOUT;
    
    // Wait for the service worker to be ready with timeout
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Service Worker registration timeout')), timeout)
      )
    ]);

    // Configure service worker
    if (registration.active) {
      registration.active.postMessage({
        type: 'FIREBASE_AUTH_POPUP',
        origin: window.location.origin,
        timestamp: Date.now()
      });

      // Add message listener for service worker communication
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

      return {
        success: true,
        isSecure: true,
        supportsServiceWorker: true
      };
    }

    throw new Error('Service worker registration succeeded but worker is not active');
  } catch (error) {
    const serviceWorkerError = error as ServiceWorkerError;
    console.error('Service worker registration failed:', serviceWorkerError);
    
    return {
      success: false,
      isSecure: isSecureContext(),
      supportsServiceWorker: true,
      error: serviceWorkerError.message
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