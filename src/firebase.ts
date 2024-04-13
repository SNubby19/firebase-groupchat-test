import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBKmtfqiXWG1bSETEVxW9zvv08bKBcnCRc",
  authDomain: "uinsports-mobile-app.firebaseapp.com",
  projectId: "uinsports-mobile-app",
  storageBucket: "uinsports-mobile-app.appspot.com",
  messagingSenderId: "1039521033465",
  appId: "1:1039521033465:web:5a95cce0d439a269128628",
  measurementId: "G-WQDP9MNYPD",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
