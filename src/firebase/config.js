
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJCdYX_yk07EOd0sHp2YAvgNaVCc1FtX4",
  authDomain: "fir-authentication-addc0.firebaseapp.com",
  projectId: "fir-authentication-addc0",
  storageBucket: "fir-authentication-addc0.firebasestorage.app",
  messagingSenderId: "413629039590",
  appId: "1:413629039590:web:a3e2fde4d7b93d624f8c27",
  measurementId: "G-GZZBX3N6DL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

