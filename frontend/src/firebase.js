import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6j7XOilJdEygXWfXvEn1-gBEk9pYj7k0",
  authDomain: "bccp-20bf5.firebaseapp.com",
  projectId: "bccp-20bf5",
  storageBucket: "bccp-20bf5.appspot.com",
  messagingSenderId: "143587927547",
  appId: "1:143587927547:web:4dc8ca4181b17b0b11575e",
  measurementId: "G-4Y0VV6KP81"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export { auth };