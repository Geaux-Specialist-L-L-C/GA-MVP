// File: /src/firebase/messaging-utils.ts
// Description: Firebase messaging utilities with proper TypeScript support and error handling
// Author: GitHub Copilot
// Created: 2024-02-17

import { getToken, getMessaging } from 'firebase/messaging';
import { app } from './config';

// Get VAPID key from environment variables
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export interface ServiceWorkerRegistrationResult {
  success: boolean;
  token?: string;
  error?: string;
}

export async function registerMessagingWorker(): Promise<ServiceWorkerRegistrationResult> {
  if (!window.isSecureContext) {
    return {
      success: false,
      error: 'Service Worker registration requires a secure context (HTTPS or localhost)'
    };
  }

  if (!('serviceWorker' in navigator)) {
    return {
      success: false,
      error: 'Service Worker is not supported in this browser'
    };
  }

  try {
    // Unregister any existing service workers first
    const existingRegistrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(existingRegistrations.map(reg => reg.unregister()));

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
      type: 'module',
      updateViaCache: 'none'
    });

    await registration.update();

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      return {
        success: false,
        error: 'Failed to get messaging token'
      };
    }

    return {
      success: true,
      token
    };
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register service worker'
    };
  }
}

export async function unregisterMessagingWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }
}