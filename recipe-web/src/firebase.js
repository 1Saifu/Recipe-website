import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDEKDbTOzwOc6c0sTHRwU3fApYm_5mfu78",
    authDomain: "recipe-98eed.firebaseapp.com",
    projectId: "recipe-98eed",
    storageBucket: "recipe-98eed.appspot.com",
    messagingSenderId: "692295798382",
    appId: "1:692295798382:web:ddb959c7d656d6114d207f",
    measurementId: "G-498NV6S58N"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const imgDB = getStorage(app)

export {imgDB};
