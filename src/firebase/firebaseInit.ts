import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, browserPopupRedirectResolver, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Register service worker for improved popup handling
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then(registration => {
      console.log('✅ Firebase Service Worker registered successfully');
    })
    .catch(err => {
      console.error('❌ Firebase Service Worker registration failed:', err);
    });
}

// Configure Google provider with improved popup settings
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  'access_type': 'offline',
  'include_granted_scopes': 'true'
});

// Ensure proper security checks
auth.settings.appVerificationDisabledForTesting = false;

// Create a wrapper function that uses the popup resolver
const signInWithGooglePopup = async () => {
  // Notify service worker about popup
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'FIREBASE_AUTH_POPUP'
    });
  }
  return signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
};

export { app, analytics, auth, googleProvider, signInWithGooglePopup };
