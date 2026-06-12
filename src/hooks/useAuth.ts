import { useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { trackUserLogin } from '../firebase/userTracking'

const MAGIC_EMAIL_KEY = 'muskle_magic_email'

const actionCodeSettings = {
  url: import.meta.env.DEV ? 'http://localhost:5173' : 'https://muskle.vercel.app',
  handleCodeInApp: true,
}

let magicLinkHandled = false

export async function sendMagicLink(email: string): Promise<void> {
  const trimmed = email.trim()
  localStorage.setItem(MAGIC_EMAIL_KEY, trimmed)
  await sendSignInLinkToEmail(auth, trimmed, actionCodeSettings)
}

export async function completeMagicLink(): Promise<void> {
  if (magicLinkHandled) return
  if (!isSignInWithEmailLink(auth, window.location.href)) return

  const email = localStorage.getItem(MAGIC_EMAIL_KEY)
  if (!email) {
    throw new Error('[auth] Email manquant pour compléter la connexion par lien')
  }

  await signInWithEmailLink(auth, email, window.location.href)
  localStorage.removeItem(MAGIC_EMAIL_KEY)
  magicLinkHandled = true
  window.history.replaceState({}, document.title, window.location.pathname)
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [completingLink, setCompletingLink] = useState(() =>
    isSignInWithEmailLink(auth, window.location.href),
  )

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
      if (u) {
        void trackUserLogin(u).catch((err) => {
          console.error('[useAuth] Failed to track user login', err)
        })
      }
    })
  }, [])

  useEffect(() => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return
    setCompletingLink(true)
    void completeMagicLink()
      .catch((err) => {
        console.error('[useAuth] Magic link sign-in failed', err)
      })
      .finally(() => {
        setCompletingLink(false)
      })
  }, [])

  const signIn = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return { user, loading, completingLink, signIn, signOut, sendMagicLink, completeMagicLink }
}
