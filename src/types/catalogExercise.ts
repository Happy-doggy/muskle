import type { Exercise } from './exercise'
import type { OnboardingNiveau } from './onboarding'
import type { MuscleGroup } from './exercise'

export type CatalogExercise = Exercise & {
  createdAt: string
  updatedAt: string
  /** Admin UI field — persisted alongside muscleGroups */
  muscles?: MuscleGroup[]
  difficulty?: OnboardingNiveau
}
