import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBU3ci2J0nbQuo_sf7aRSepKmcYtCBe3Zw",
  authDomain: "idle-circle.firebaseapp.com",
  projectId: "idle-circle",
  storageBucket: "idle-circle.firebasestorage.app",
  messagingSenderId: "159638301391",
  appId: "1:159638301391:web:3cb8a0137c2c45b5ede5ba",
  measurementId: "G-1RXHH99NHE"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app