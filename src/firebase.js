import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-0fBjLqpqVqtY0UcWdansPaYXM5PECAo",
  authDomain: "southern-horizon-booking.firebaseapp.com",
  projectId: "southern-horizon-booking",
  storageBucket: "southern-horizon-booking.firebasestorage.app",
  messagingSenderId: "100361443130",
  appId: "1:100361443130:web:27d6ebb69658b523daa203",
  measurementId: "G-BTQN1R5V8H"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Keep Troy signed in across page refreshes
setPersistence(auth, browserLocalPersistence);
