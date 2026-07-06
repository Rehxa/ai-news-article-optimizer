// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { initializeApp, cert, getApps } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsbEEDSTcWOj6tDDRnPvRbPNzK_WofNl8",
  authDomain: "ai-news-article-optimizer.firebaseapp.com",
  projectId: "ai-news-article-optimizer",
  storageBucket: "ai-news-article-optimizer.firebasestorage.app",
  messagingSenderId: "279808875853",
  appId: "1:279808875853:web:835da145f017b8c9f52b04",
  measurementId: "G-MW1279LJPD",
};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// // const analytics = getAnalytics(app);

// export const db = getFirestore(app);
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("[Firebase] Initialized successfully");
} catch (error) {
  console.error("[Firebase] Initialization error:", error);
}

if (!db) {
  throw new Error("Firebase not initialized");
}

export { db };
