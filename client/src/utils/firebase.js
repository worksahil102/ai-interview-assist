// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRBASE_APIKEY,
  authDomain: "interviewiq-51850.firebaseapp.com",
  projectId: "interviewiq-51850",
  storageBucket: "interviewiq-51850.firebasestorage.app",
  messagingSenderId: "1053439840352",
  appId: "1:1053439840352:web:f7aef93b48f994b4927305",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();
export { auth, provider };
