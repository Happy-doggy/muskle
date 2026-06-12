/**
 * One-time migration: static exercises → Firestore catalogExercises.
 *
 * Usage (requires Firebase Application Default Credentials):
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \
 *     npx ts-node --project scripts/tsconfig.json scripts/migrateExercises.ts
 *
 * Or: npm run migrate:exercises
 *
 * Requires Application Default Credentials (service account or `gcloud auth application-default login`).
 * Aborts if catalogExercises already contains documents.
 */

import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { exerciseDefinitions } from './exerciseDefinitions'
import type { CatalogExercise } from '../src/types/catalogExercise'
import type { MuscleGroup } from '../src/types/exercise'

const PROJECT_ID = 'muskle-e0af6'

function sanitize<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item)) as T
  }

  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(value)) {
    if (val === undefined) continue
    result[key] = sanitize(val)
  }
  return result as T
}

function staticToCatalogExercise(
  ex: (typeof exerciseDefinitions)[number],
): CatalogExercise {
  const muscleGroups: MuscleGroup[] =
    ex.muscleGroups?.length ? ex.muscleGroups : [ex.category]

  const now = new Date().toISOString()

  return {
    id: ex.id,
    name: ex.name,
    category: ex.category,
    description: ex.description,
    type: ex.type,
    defaultReps: ex.defaultReps,
    defaultSets: ex.defaultSets,
    defaultDuration: ex.defaultDuration,
    equipment: ex.equipment,
    muscleGroups,
    muscles: muscleGroups,
    tags: ex.tags,
    imageUrl: undefined,
    videoUrl: undefined,
    createdAt: now,
    updatedAt: now,
  }
}

async function main() {
  if (getApps().length === 0) {
    initializeApp({ projectId: PROJECT_ID })
  }

  const db = getFirestore()
  const collectionRef = db.collection('catalogExercises')

  const existing = await collectionRef.limit(1).get()
  if (!existing.empty) {
    console.log(
      `[migrateExercises] catalogExercises already has ${existing.size > 0 ? 'documents' : 'data'}. Aborting.`,
    )
    process.exit(0)
  }

  const batch = db.batch()
  const catalogExercises = exerciseDefinitions.map(staticToCatalogExercise)

  for (const exercise of catalogExercises) {
    batch.set(collectionRef.doc(exercise.id), sanitize(exercise))
  }

  await batch.commit()

  console.log(
    `[migrateExercises] Migrated ${catalogExercises.length} exercises to catalogExercises.`,
  )
}

main().catch((err) => {
  console.error('[migrateExercises] Failed:', err)
  process.exit(1)
})
