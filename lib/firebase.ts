import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDx6HC9BRbkS-2eDSyqTx5Xi4UN2lUqwFg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "adse-1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "adse-1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "adse-1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "296526482001",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:296526482001:web:7aacf903d1aefe0c144670",
}

function getFirebaseApp() {
  try {
    return getApps().length ? getApp() : initializeApp(firebaseConfig as any)
  } catch (e) {
    console.error("[v0] Firebase init error:", e)
    throw e
  }
}

export const app = getFirebaseApp()
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
