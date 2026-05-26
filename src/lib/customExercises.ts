import { exercisesDB, type Exercise } from '../data/exercices'

const STORAGE_KEY = 'muskle:custom-exercises'

function readCustom(): Exercise[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Exercise[]) : []
  } catch {
    return []
  }
}

function writeCustom(exercises: Exercise[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises))
}

export function loadCustomExercises(): Exercise[] {
  return readCustom()
}

export function saveCustomExercise(exercise: Exercise): void {
  const list = readCustom()
  writeCustom([...list, exercise])
}

export function getCatalogExercises(): Exercise[] {
  return [...exercisesDB, ...readCustom()]
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
