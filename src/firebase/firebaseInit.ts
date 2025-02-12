// File: /src/firebase/firebaseInit.ts
// Description: Initializes Firebase with Analytics for the Geaux Academy project.
// Author: [Your Name]
// Created: [Date]

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// See: https://firebase.google.com/docs/web/setup#available-libraries

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
