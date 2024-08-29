// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQjZ93ZbQ0DGUSd8hzbVWGmh8l7AHB-EM",
    authDomain: "crypto-app-48a03.firebaseapp.com",
    projectId: "crypto-app-48a03",
    storageBucket: "crypto-app-48a03.appspot.com",
    messagingSenderId: "348798185586",
    appId: "1:348798185586:web:f39dabd2ff2d874dbe12eb",
    measurementId: "G-73GG5YJJND"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app)
export { auth, db, analytics };
