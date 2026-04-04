import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCoOTg5RhUU-pPDUa0mEuHKpF9_OnudgPg",
  authDomain: "vivahaplan.firebaseapp.com",
  projectId: "vivahaplan",
  storageBucket: "vivahaplan.firebasestorage.app",
  messagingSenderId: "645796573009",
  appId: "1:645796573009:web:3b677c7b3b2ab0e8f2ad70",
  measurementId: "G-D1MKLXSJ0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication with persistent login
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to set persistence:", error);
});

export default app;
