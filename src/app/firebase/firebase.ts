//firebase
import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const chatApp = initializeApp(firebaseConfig);
export const auth = getAuth(chatApp);
export const firestore = getFirestore(chatApp);
export const googleProvider = new GoogleAuthProvider();
