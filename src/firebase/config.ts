import { initializeApp } from 'firebase/app';
import { getAuth, browserPopupRedirectResolver, initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';solver, initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);firebaseConfig);

// Initialize Auth with persistence and popup supportwith persistence and popup support
export const auth = initializeAuth(app, {export const auth = initializeAuth(app, {












});  console.warn('Firestore persistence initialization warning:', err);enableIndexedDbPersistence(db).catch((err) => {// Enable offline persistence for Firestoreexport const db = getFirestore(app);// Initialize Firestore});  popupRedirectResolver: browserPopupRedirectResolver  persistence: [indexedDBLocalPersistence],  persistence: [indexedDBLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver
});

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  console.warn('Firestore persistence initialization warning:', err);
});
