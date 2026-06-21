import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMBLecPeDfqqsZNoIlxmpseLuupcPaVS8",
  authDomain: "househelp-ae379.firebaseapp.com",
  projectId: "househelp-ae379",
  storageBucket: "househelp-ae379.firebasestorage.app",
  messagingSenderId: "184466331818",
  appId: "1:184466331818:web:b6fa0e253e206b836d18d3",
  measurementId: "G-9RCR1E5E5T"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;