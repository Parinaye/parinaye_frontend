// Import the functions you need from the SDKs you need
import { initializeApp }  from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/storage'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "parinaye-firebase.firebaseapp.com",
  projectId: "parinaye-firebase",
  storageBucket: "parinaye-firebase.appspot.com",
  messagingSenderId: "864232050248",
  appId: "1:864232050248:web:1362885205f81ee5ed527d",
  measurementId: "G-SGS3CVF8L2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
