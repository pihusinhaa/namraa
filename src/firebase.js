import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase project config details
const firebaseConfig = {
  apiKey: "AIzaSyAi5jejncFTPnYXYbDBP2ZVEs1MGabQX3A",
  authDomain: "namra-822dc.firebaseapp.com",
  projectId: "namra-822dc",
  storageBucket: "namra-822dc.firebasestorage.app",
  messagingSenderId: "306367260056",
  appId: "1:306367260056:web:a6b7242979642be3a737ed",
  measurementId: "G-B5SZNPVG6M",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
