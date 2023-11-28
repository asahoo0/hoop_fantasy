// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1jZOk45g812r1OyhPCEC0-TZLcHPtp_Q",
  authDomain: "authentication-a3822.firebaseapp.com",
  projectId: "authentication-a3822",
  storageBucket: "authentication-a3822.appspot.com",
  messagingSenderId: "777851357862",
  appId: "1:777851357862:web:9e37a45a516a98c7f20267",
  measurementId: "G-C9SFYLEVRY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };