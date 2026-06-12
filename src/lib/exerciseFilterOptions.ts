import { ONBOARDING_STEPS } from '@/data/onboarding'
import { muscleGroups, type MuscleGroup } from '@/types/exercise'
import type {
  OnboardingMateriel,
  OnboardingNiveau,
  OnboardingObjectif,
  OnboardingSport,
} from '@/types/onboarding'

function optionsFromStep<K extends string>(stepId: string): { value: K; label: string }[] {
  const step = ONBOARDING_STEPS.find((s) => s.id === stepId)
  if (!step || step.kind === 'rythme') return []
  return step.options.map((o) => ({ value: o.value as K, label: o.label }))
}

export const EXERCISE_FILTER_MUSCLE_GROUPS: MuscleGroup[] = muscleGroups

export const EXERCISE_FILTER_OBJECTIFS = optionsFromStep<OnboardingObjectif>('objectif')
export const EXERCISE_FILTER_SPORTS = optionsFromStep<OnboardingSport>('sport')
export const EXERCISE_FILTER_MATERIEL = optionsFromStep<OnboardingMateriel>('materiel')
export const EXERCISE_FILTER_NIVEAUX = optionsFromStep<OnboardingNiveau>('niveau')

export const OBJECTIF_LABELS = Object.fromEntries(
  EXERCISE_FILTER_OBJECTIFS.map((o) => [o.value, o.label]),
) as Record<OnboardingObjectif, string>

export const SPORT_LABELS = Object.fromEntries(
  EXERCISE_FILTER_SPORTS.map((o) => [o.value, o.label]),
) as Record<OnboardingSport, string>

export const NIVEAU_LABELS = Object.fromEntries(
  EXERCISE_FILTER_NIVEAUX.map((o) => [o.value, o.label]),
) as Record<OnboardingNiveau, string>
