import { exercisesDB, type Exercise } from '../data/exercices'
import { storage } from '../storage'
import type { Exercise as FirestoreExercise } from '../types'

let customCache: Exercise[] = []

function toFirestore(exercise: Exercise): FirestoreExercise {
  return exercise as unknown as FirestoreExercise
}

function fromFirestore(exercise: FirestoreExercise): Exercise {
  return exercise as unknown as Exercise
}

export async function loadCustomExercises(): Promise<Exercise[]> {
  customCache = (await storage.getExercises()).map(fromFirestore)
  return customCache
}

export async function saveCustomExercise(exercise: Exercise): Promise<void> {
  await storage.saveExercise(toFirestore(exercise))
  customCache = [...customCache, exercise]
}

export function getCatalogExercises(): Exercise[] {
  return [...exercisesDB, ...customCache]
}

export function slugifyExerciseName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function generateExerciseId(name: string, existingIds: Set<string>): string {
  const base = slugifyExerciseName(name) || 'exercice'
  if (!existingIds.has(base)) return base
  let i = 2
  while (existingIds.has(`${base}-${i}`)) i++
  return `${base}-${i}`
}

export function formatExerciseDefaults(ex: Exercise): string {
  if (ex.type === 'duration') {
    return `${ex.defaultDuration}s × ${ex.defaultSets} séries`
  }
  return `${ex.defaultReps} reps × ${ex.defaultSets} séries`
}
