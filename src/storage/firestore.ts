/**
 * storage/firestore.ts
 *
 * Firestore implementation of StorageAdapter.
 * Data lives under users/{uid}/blocks|sessions.
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { Block, Session, StorageAdapter } from '../types'

function getUid(): string {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('[firestore] User not authenticated')
  return uid
}

function blocksRef(uid: string) {
  return collection(db, 'users', uid, 'blocks')
}

function sessionsRef(uid: string) {
  return collection(db, 'users', uid, 'sessions')
}

function favoritesRef(uid: string) {
  return doc(db, 'users', uid, 'preferences', 'favorites')
}

export const firestoreAdapter: StorageAdapter = {
  async getBlocks() {
    const uid = getUid()
    const snap = await getDocs(blocksRef(uid))
    return snap.docs.map((d) => d.data() as Block)
  },

  async saveBlock(block) {
    const uid = getUid()
    await setDoc(doc(blocksRef(uid), block.id), block, { merge: true })
  },

  async deleteBlock(id) {
    const uid = getUid()
    await deleteDoc(doc(blocksRef(uid), id))
  },

  async getSessions() {
    const uid = getUid()
    const snap = await getDocs(sessionsRef(uid))
    return snap.docs.map((d) => d.data() as Session)
  },

  async saveSession(session) {
    const uid = getUid()
    await setDoc(doc(sessionsRef(uid), session.id), session, { merge: true })
  },

  async deleteSession(id) {
    const uid = getUid()
    await deleteDoc(doc(sessionsRef(uid), id))
  },

  async getFavoriteExerciseIds() {
    const uid = getUid()
    const snap = await getDoc(favoritesRef(uid))
    if (!snap.exists()) return []
    const ids = snap.data().exerciseIds
    return Array.isArray(ids) ? ids : []
  },

  async saveFavoriteExerciseIds(ids) {
    const uid = getUid()
    await setDoc(favoritesRef(uid), { exerciseIds: ids }, { merge: true })
  },
}
