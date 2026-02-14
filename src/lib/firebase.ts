import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGjY_-zk9NV-EeC82idU_gsxMejCrlLeI",
  authDomain: "controlesolar-92343.firebaseapp.com",
  projectId: "controlesolar-92343",
  storageBucket: "controlesolar-92343.firebasestorage.app",
  messagingSenderId: "982365669692",
  appId: "1:982365669692:web:72821077d36f19a341f639",
  measurementId: "G-EWBQ7LVFZQ",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
