import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Default config to prevent crash if global is missing
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDgudYTCoWDVsSNejtzBD10GLbfUfntr-8",
    authDomain: "stone-wall-books.firebaseapp.com",
    projectId: "stone-wall-books",
    storageBucket: "stone-wall-books.firebasestorage.app",
    messagingSenderId: "627004157616",
    appId: "1:627004157616:web:2932b73547b63404111575",
    measurementId: "G-J3816673BN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'stone-wall-books-v2';

export { auth, db, appId };
export default app;
