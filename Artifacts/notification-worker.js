// File: /public/monitoring-worker.js

const CACHE_NAME = 'monitoring-cache-v1';

// Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/static/monitoring-icons/error.png',
        '/static/monitoring-icons/warning.png',
        '/static/monitoring-icons/info.png'
      ]);
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Open monitoring dashboard when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/monitoring') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/monitoring');
    })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.message,
      icon: `/static/monitoring-icons/${data.severity}.png`,
      badge: '/static/monitoring-icons/badge.png',
      data: {
        timestamp: new Date().getTime(),
        alert: data
      },
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ],
      requireInteraction: data.severity === 'error'
    };

    event.waitUntil(
      self.registration.showNotification(
        `${data.type} Alert`,
        options
      )
    );
  }
});

// Handle background sync for offline support
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-monitoring-data') {
    event.waitUntil(syncMonitoringData());
  }
});

// Utility function to sync monitoring data
async function syncMonitoringData() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('/api/monitoring')) {
        try {
          const response = await fetch(request);
          await cache.put(request, response.clone());
        } catch (error) {
          console.error('Error syncing monitoring data:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error in syncMonitoringData:', error);
  }
}

// File: /src/services/monitoring.ts
// Description: Monitoring service for handling notifications

import { useState, useEffect } from 'react';

interface NotificationPermission {
  granted: boolean;
  error?: string;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false
  });

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    try {
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        setPermission({ granted: result === 'granted' });
      } else {
        setPermission({
          granted: false,
          error: 'Notifications not supported'
        });
      }
    } catch (error) {
      setPermission({
        granted: false,
        error: error.message
      });
    }
  };

  const registerServiceWorker = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register(
          '/monitoring-worker.js',
          { scope: '/' }
        );
        
        return registration;
      }
      throw new Error('Service Worker not supported');
    } catch (error) {
      console.error('Error registering service worker:', error);
      throw error;
    }
  };

  const subscribeToNotifications = async () => {
    try {
      const registration = await registerServiceWorker();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY
      });

      // Send subscription to backend
      await fetch('/api/monitoring/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });

      return subscription;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      throw error;
    }
  };

  return {
    permission,
    checkNotificationPermission,
    subscribeToNotifications
  };
};
