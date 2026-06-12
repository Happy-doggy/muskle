import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  increment,
  type Timestamp,
} from 'firebase/firestore'
import type { User as FirebaseUser } from 'firebase/auth'
import { db } from '../lib/firebase'

export interface TrackedUser {
  email: string
  displayName: string
  createdAt: Timestamp
  lastLoginAt: Timestamp
  sessionCount: number
  completedWorkouts: number
}

function userDocRef(uid: string) {
  return doc(db, 'users', uid)
}

export async function trackUserLogin(user: FirebaseUser): Promise<void> {
  const ref = userDocRef(user.uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      sessionCount: 1,
      completedWorkouts: 0,
    })
    return
  }

  await updateDoc(ref, {
    email: user.email ?? '',
    displayName: user.displayName ?? '',
    lastLoginAt: serverTimestamp(),
    sessionCount: increment(1),
  })
}

export async function trackWorkoutCompleted(uid: string): Promise<void> {
  const ref = userDocRef(uid)
  const snap = await getDoc(ref)

  if (!snap.exists()) {
    await setDoc(ref, {
      email: '',
      displayName: '',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      sessionCount: 0,
      completedWorkouts: 1,
    })
    return
  }

  await updateDoc(ref, {
    completedWorkouts: increment(1),
  })
}
