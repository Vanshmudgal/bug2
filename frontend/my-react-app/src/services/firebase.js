// src/services/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 🔐 Replace these placeholder values with your own Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // (Optional, only needed if using analytics)
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// 📦 Export Firestore and Auth for use in other parts of the app
export { db, auth };
