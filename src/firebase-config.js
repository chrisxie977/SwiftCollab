import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYw3nIAqaFU0B5zF9JB6b9AZZvQDStZwI",
  authDomain: "swiftcollab.firebaseapp.com",
  projectId: "swiftcollab",
  storageBucket: "swiftcollab.appspot.com",
  messagingSenderId: "411635818787",
  appId: "1:411635818787:web:aa878f876f547034d0ac96",
  measurementId: "G-9EPXTBEL3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
