import type { CatalogExercise } from '@/types/catalogExercise'
import type { Exercise, MuscleGroup } from '@/types/exercise'

export function filterExercisesByCategory(
  exercises: Exercise[],
  category: MuscleGroup,
): Exercise[] {
  return exercises.filter((e) => e.category === category)
}

export function filterExercisesByFavorites(
  exercises: Exercise[],
  favoriteIds: Set<string>,
): Exercise[] {
  return exercises.filter((e) => favoriteIds.has(e.id))
}

export function filterExercisesBySearch(
  exercises: Exercise[],
  query: string,
): Exercise[] {
  const q = query.trim().toLowerCase()
  if (!q) return exercises
  return exercises.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q),
  )
}

export function findExerciseById(
  exercises: Exercise[],
  id: string,
): Exercise | undefined {
  return exercises.find((e) => e.id === id)
}

export function catalogToExercise(catalog: CatalogExercise): Exercise {
  const {
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    muscles: _muscles,
    difficulty: _difficulty,
    ...exercise
  } = catalog
  return exercise
}
