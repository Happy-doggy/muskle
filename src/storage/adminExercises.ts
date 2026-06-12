/**
 * storage/adminExercises.ts
 *
 * Firestore adapter for the global exercise catalog (admin-managed).
 * Collection: catalogExercises/{id}
 */

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { AdminExercise, AdminExerciseInput } from '@/types/adminExercise'
import type { CatalogExercise } from '@/types/catalogExercise'

function docToCatalogExercise(
  id: string,
  data: Record<string, unknown>,
): CatalogExercise {
  return { id, ...data } as CatalogExercise
}

function catalogRef() {
  return collection(db, 'catalogExercises')
}

function catalogDocRef(id: string) {
  return doc(db, 'catalogExercises', id)
}

export async function getAdminExercises(): Promise<AdminExercise[]> {
  const snap = await getDocs(catalogRef())
  return snap.docs.map((d) => docToCatalogExercise(d.id, d.data()) as AdminExercise)
}

export function subscribeCatalogExercises(
  onData: (exercises: CatalogExercise[]) => void,
  onError?: (error: Error) => void,
): () => void {
  return onSnapshot(
    catalogRef(),
    (snap) => {
      onData(snap.docs.map((d) => docToCatalogExercise(d.id, d.data())))
    },
    (err) => {
      onError?.(err)
    },
  )
}

export async function createAdminExercise(
  input: AdminExerciseInput,
): Promise<AdminExercise> {
  const now = new Date().toISOString()
  const exercise: AdminExercise = { ...input, createdAt: now, updatedAt: now }
  await setDoc(catalogDocRef(exercise.id), exercise)
  return exercise
}

export async function updateAdminExercise(
  exercise: AdminExercise,
): Promise<AdminExercise> {
  const updated: AdminExercise = {
    ...exercise,
    updatedAt: new Date().toISOString(),
  }
  await setDoc(catalogDocRef(updated.id), updated, { merge: true })
  return updated
}

export async function deleteAdminExercise(id: string): Promise<void> {
  await deleteDoc(catalogDocRef(id))
}
