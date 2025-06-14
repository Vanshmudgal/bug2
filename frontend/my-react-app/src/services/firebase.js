// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCxgI6yma9_GsxU5uD0ieQbrkFkoY4N21I",
  authDomain: "bugg-d7abc.firebaseapp.com",
  projectId: "bugg-d7abc",
  storageBucket: "bugg-d7abc.appspot.com",
  messagingSenderId: "172353356229",
  appId: "1:172353356229:web:324ce5c9a2a73525b98bac",
  measurementId: "G-HBN26DL5Y3"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };  // Make sure to export both db and auth