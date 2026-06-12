import type {
  OnboardingContrainte,
  OnboardingMateriel,
  OnboardingNiveau,
  OnboardingObjectif,
  OnboardingSport,
  OnboardingZone,
} from './onboarding'

export type MuscleGroup =
  | 'Gainage'
  | 'Cuisses & Fessiers'
  | 'Ischio-jambiers'
  | 'Pectoraux'
  | 'Épaules'
  | 'Dos'
  | 'Biceps'
  | 'Triceps'
  | 'Mollets'
  | 'Cardio / Full Body'

export type ExerciseTags = {
  objectifs?: OnboardingObjectif[]
  sports?: OnboardingSport[]
  zones?: OnboardingZone[]
  materiel?: OnboardingMateriel[]
  niveau?: OnboardingNiveau[]
  contraindications?: OnboardingContrainte[]
}

export type Exercise = {
  id: string
  name: string
  category: MuscleGroup
  description: string
  type: 'reps' | 'duration'
  defaultReps?: number
  defaultSets?: number
  defaultDuration?: number
  equipment?: string
  muscleGroups?: MuscleGroup[]
  tags?: ExerciseTags
  imageUrl?: string
  videoUrl?: string
}

export const muscleGroups: MuscleGroup[] = [
  'Gainage',
  'Cuisses & Fessiers',
  'Ischio-jambiers',
  'Pectoraux',
  'Épaules',
  'Dos',
  'Biceps',
  'Triceps',
  'Mollets',
  'Cardio / Full Body',
]
