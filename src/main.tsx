// File: /home/wicked/geauxai/GA-MVP/src/main.tsx
// Description: Main entry point for the React application
// Author: GitHub Copilot
// Created: 2024-02-12

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import App from './App';
import ErrorBoundary from './components/shared/ErrorBoundary';
import './index.css';

// Configure future flags for React Router v7
const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <ErrorBoundary>
        <AuthProvider>
          <ProfileProvider>
            <App />
          </ProfileProvider>
        </AuthProvider>
      </ErrorBoundary>
    ),
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

// Listen for auth service worker status events
window.addEventListener('firebase-auth-worker-status', (event: Event) => {
  const { success, isSecure, error } = (event as CustomEvent).detail;
  if (!success) {
    console.warn(
      'Auth service worker initialization status:', 
      { success, isSecure, error }
    );
  }
});

// Listen for auth errors from service worker
window.addEventListener('firebase-auth-error', (event: Event) => {
  const { error, fallbackToRedirect } = (event as CustomEvent).detail;
  console.error('Firebase auth error:', error);
  if (fallbackToRedirect) {
    console.info('Falling back to redirect method for authentication');
  }
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
