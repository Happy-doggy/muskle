import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBrblAiMC402E5_bR0lKZvIDJ8gUoK1q4g",
  authDomain: "muskle-e0af6.firebaseapp.com",
  projectId: "muskle-e0af6",
  storageBucket: "muskle-e0af6.firebasestorage.app",
  messagingSenderId: "492508294941",
  appId: "1:492508294941:web:8cfed51e669ed6e1683bf4"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
