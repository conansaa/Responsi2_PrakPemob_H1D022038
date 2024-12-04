// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDjp1ocGEu9AZLqDBa6Kcfc4IGorbjtlcw",
    authDomain: "coba-ddb7b.firebaseapp.com",
    projectId: "coba-ddb7b",
    storageBucket: "coba-ddb7b.firebasestorage.app",
    messagingSenderId: "1025116725796",
    appId: "1:1025116725796:web:ada145804a8d19fafdaeb1"
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db };