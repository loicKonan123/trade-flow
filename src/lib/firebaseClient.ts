// lib/firebaseClient.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB70j6MZ7Fd2a2aEzMucKJfhR4wl667plw",
  authDomain: "tradeflow-77398.firebaseapp.com",
  projectId: "tradeflow-77398",
  storageBucket: "tradeflow-77398.appspot.com", // Correction: utilisez .appspot.com au lieu de .firebasestorage.app
  messagingSenderId: "210912833760",
  appId: "1:210912833760:web:ca452c81b49c7a50276085",
  measurementId: "G-NXGB5K44YS"
};

// Initialisation unique de Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Services Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics (seulement côté client et si supporté)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export { app, auth, db, storage, analytics };