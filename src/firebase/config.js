// Import the functions from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuSf5W4ff0Yjng-bShsTerwhgNj9tQD6k",
  authDomain: "homework8-18ae9.firebaseapp.com",
  projectId: "homework8-18ae9",
  storageBucket: "homework8-18ae9.firebasestorage.app",
  messagingSenderId: "906594959810",
  appId: "1:906594959810:web:0052fe83e13839078ed65b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db} 