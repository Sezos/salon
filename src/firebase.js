// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBU7gxWv-lBJvZXrPcYiDneRY5GPDFIJY8",
  authDomain: "dagina-fd8bc.firebaseapp.com",
  projectId: "dagina-fd8bc",
  storageBucket: "dagina-fd8bc.appspot.com",
  messagingSenderId: "161583737307",
  appId: "1:161583737307:web:e0e4aacacae21cae759ffe",
  measurementId: "G-7SJJ3TBTVE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default firestore;
