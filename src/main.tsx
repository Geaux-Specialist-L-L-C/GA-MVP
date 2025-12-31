import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import App from './App';
import ErrorBoundary from './components/shared/ErrorBoundary';
import './index.css';
import './styles/global.css';
// Firebase app initialized centrally in config/firebase.ts (tree-shaken singletons)
import './config/firebase';

if (import.meta.env.DEV) {
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspMeta) {
    cspMeta.remove();
    console.info('[CSP] Removed Content-Security-Policy meta tag in DEV for HMR.');
  }

  const metas = [
    'Cross-Origin-Embedder-Policy',
    'Cross-Origin-Opener-Policy',
    'Cross-Origin-Resource-Policy'
  ];
  metas.forEach((name) => {
    const el = document.querySelector(`meta[http-equiv="${name}"]`);
    if (el) {
      el.remove();
      console.warn(`[DEV] Removed ${name} meta tag for Firebase auth compatibility.`);
    }
  });
}

// Configure future flags for React Router v7
const future = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

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
  future
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
