import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";
import {getFunctions} from "firebase-admin/functions";

initializeApp();

export const db = getFirestore();
export const auth = getAuth();
export const functions = getFunctions();
