import type { MuscleGroup } from '@/data/exercices'
import type { OnboardingNiveau } from '@/types/onboarding'

export interface AdminExercise {
  id: string
  name: string
  description: string
  category: MuscleGroup
  muscles: MuscleGroup[]
  imageUrl?: string
  videoUrl?: string
  difficulty?: OnboardingNiveau
  equipment?: string
  type: 'reps' | 'duration'
  defaultReps?: number
  defaultSets?: number
  defaultDuration?: number
  createdAt: string
  updatedAt: string
}

export type AdminExerciseInput = Omit<AdminExercise, 'createdAt' | 'updatedAt'>
