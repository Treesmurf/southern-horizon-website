import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8aiXqcGdq8E-KL7fdj_1TVNasLeFRz-o",
  authDomain: "shco-bookings.firebaseapp.com",
  projectId: "shco-bookings",
  storageBucket: "shco-bookings.firebasestorage.app",
  messagingSenderId: "323672970916",
  appId: "1:323672970916:web:8e7d50eb91f0505bfb3831"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
