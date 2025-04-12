
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZqNP-BuLQoDdQgS9xjB9ZrORlGjLVkKk",
  authDomain: "ecohop-app.firebaseapp.com",
  projectId: "ecohop-app",
  storageBucket: "ecohop-app.appspot.com",
  messagingSenderId: "303756945727",
  appId: "1:303756945727:web:3db7a0bcb6c78e4a2de068"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
