import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "process.env.REACT_APP_FIREBASE_API_KEY",
  authDomain: "ip-rentro.firebaseapp.com",
  projectId: "ip-rentro",
  storageBucket: "ip-rentro.appspot.com",
  messagingSenderId: "790699698860",
  appId: "1:790699698860:web:6bae967450816126a74d09",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();
