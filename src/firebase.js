import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDHld9rj8ufffzbeYN2t8E7Ap0ctUFLqnI",
  authDomain: "friend-1d675.firebaseapp.com",
  projectId: "friend-1d675",
  storageBucket: "friend-1d675.firebasestorage.app",
  messagingSenderId: "400981800842",
  appId: "1:400981800842:web:9956f6a53fe004d529ba73",
  measurementId: "G-SM5HDGE0P3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);

export default app; 