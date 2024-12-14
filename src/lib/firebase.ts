import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCk4z821c-Ez3Tn8cGovna7c5hVnH4RpHI",
  authDomain: "pharmacare2-7d517.firebaseapp.com",
  projectId: "pharmacare2-7d517",
  storageBucket: "pharmacare2-7d517.firebasestorage.app",
  messagingSenderId: "341800487735",
  appId: "1:341800487735:web:153e6aafa1e89711ede8b2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);