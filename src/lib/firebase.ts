import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDYrcJmNxZcXlmqnN_0TQK2zrV4qxSNC-M",
  authDomain: "pharmacare-394723.firebaseapp.com",
  projectId: "pharmacare-394723",
  storageBucket: "pharmacare-394723.appspot.com",
  messagingSenderId: "394723394723",
  appId: "1:394723394723:web:394723394723394723"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);