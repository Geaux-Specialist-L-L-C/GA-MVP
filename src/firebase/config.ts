import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB0V4iL1aQ_xtWeO_iWL1fuhu4_SLfqZeo",
  authDomain: "geaux-academy.firebaseapp.com",
  databaseURL: "https://geaux-academy-default-rtdb.firebaseio.com",
  projectId: "geaux-academy",
  storageBucket: "geaux-academy.firebasestorage.app",
  messagingSenderId: "145629211979",
  appId: "1:145629211979:web:1f9c854ecb392916adccce",
  measurementId: "G-6MBLBQ3NWS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
