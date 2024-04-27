// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKmtfqiXWG1bSETEVxW9zvv08bKBcnCRc",
  authDomain: "uinsports-mobile-app.firebaseapp.com",
  projectId: "uinsports-mobile-app",
  storageBucket: "uinsports-mobile-app.appspot.com",
  messagingSenderId: "1039521033465",
  appId: "1:1039521033465:web:5a95cce0d439a269128628",
  measurementId: "G-WQDP9MNYPD",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// connectFirestoreEmulator(db, "localhost", 8080);
// connectAuthEmulator(auth, "http://localhost:9099");
// connectFunctionsEmulator(functions, "localhost", 5001);
