// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDKVK6DUDZbLYelcwTCmSMNyH2FyMmsOSg",
    authDomain: "weather-2517d.firebaseapp.com",
    projectId: "weather-2517d",
    storageBucket: "weather-2517d.firebasestorage.app",
    messagingSenderId: "475662565994",
    appId: "1:475662565994:web:88d0210b4d95ce14e90013",
    measurementId: "G-9HGYLXL388"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
