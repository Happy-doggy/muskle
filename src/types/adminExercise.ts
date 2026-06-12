import type { CatalogExercise } from '@/types/catalogExercise'
import type { MuscleGroup } from '@/types/exercise'

export type AdminExercise = CatalogExercise & {
  muscles: MuscleGroup[]
}

export type AdminExerciseInput = Omit<AdminExercise, 'createdAt' | 'updatedAt'>
