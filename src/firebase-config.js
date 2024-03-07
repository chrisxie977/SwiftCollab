import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4DgYm3K9_IsM1hEWDo6tCIaqEVFnZKBc",
  authDomain: "swiftcollabv2.firebaseapp.com",
  projectId: "swiftcollabv2",
  storageBucket: "swiftcollabv2.appspot.com",
  messagingSenderId: "377647249909",
  appId: "1:377647249909:web:dd408ca3f73ee2e7cec8bc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
