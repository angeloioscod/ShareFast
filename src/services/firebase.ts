import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCMyhs6J67Tby3M9DDTX8SEQXb_4Vu3FYs",
  authDomain: "sharefast-d889a.firebaseapp.com",
  projectId: "sharefast-d889a",
  storageBucket: "sharefast-d889a.firebasestorage.app",
  messagingSenderId: "698620835619",
  appId: "1:698620835619:web:bee1f179587a660db23e96"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);