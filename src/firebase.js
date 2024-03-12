// Import the functions you need from the SDKs you need
import { initializeApp }  from "firebase/app";
import 'firebase/storage'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-c8aa4.firebaseapp.com",
  projectId: "real-estate-c8aa4",
  storageBucket: "real-estate-c8aa4.appspot.com",
  messagingSenderId: "940584063355",
  appId: "1:940584063355:web:35b46d959e0ac3cc53adde"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);