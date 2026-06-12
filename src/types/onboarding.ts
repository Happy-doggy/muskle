import type { ExerciseCategory } from './index'

export type OnboardingObjectif =
  | 'force'
  | 'muscle'
  | 'cardio'
  | 'mobilite'
  | 'gainage'
  | 'forme'

export type OnboardingDiscipline =
  | 'musculation'
  | 'renforcement'
  | 'cardio'
  | 'mobilite'
  | 'yoga'
  | 'kine'

export type OnboardingSport =
  | 'running'
  | 'velo'
  | 'natation'
  | 'rando'
  | 'raquettes'
  | 'collectif'

export type OnboardingNiveau = 'debutant' | 'intermediaire' | 'confirme' | 'expert'

export type OnboardingZone =
  | 'jambes'
  | 'ischio'
  | 'mollets'
  | 'abdos'
  | 'dos'
  | 'pecs'
  | 'epaules'
  | 'bras'

export type OnboardingMateriel =
  | 'poids-corps'
  | 'tapis'
  | 'halteres'
  | 'elastiques'
  | 'kettlebell'
  | 'barre'
  | 'banc'
  | 'trx'

export type OnboardingContrainte =
  | 'genoux'
  | 'dos'
  | 'epaules'
  | 'poignets'
  | 'chevilles'
  | 'nuque'

export type OnboardingFrequence = 2 | 3 | 4 | 5
export type OnboardingDuree = 15 | 30 | 45 | 60

export interface OnboardingRythme {
  frequence: OnboardingFrequence
  duree: OnboardingDuree
}

/** Multi-select with optional « none » marker for contraintes. */
export type MultiWithNone<T> = T[] & { __none?: boolean }

export interface OnboardingAnswers {
  objectif?: OnboardingObjectif
  disciplines: OnboardingDiscipline[]
  sport: OnboardingSport[]
  niveau?: OnboardingNiveau
  zones: OnboardingZone[]
  materiel: OnboardingMateriel[]
  rythme?: OnboardingRythme
  contraintes: MultiWithNone<OnboardingContrainte>
}

export type OnboardingPhase = 'welcome' | number | 'recap' | 'done' | 'skipped'

export interface OnboardingPreferencesDoc {
  answers: OnboardingAnswers
  onboardingCompleted: boolean
  onboardingSkipped: boolean
  updatedAt: string
}

export interface OnboardingCardOption {
  value: string
  label: string
  desc?: string
  icon?: string
  cat?: ExerciseCategory
}

export interface OnboardingStepBase {
  id: keyof OnboardingAnswers | 'rythme'
  eyebrow: string
  title: string
  help: string
  optional?: boolean
}

export interface OnboardingSelectionStep extends OnboardingStepBase {
  kind: 'single' | 'multi'
  display: 'cards' | 'chips'
  hasNone?: boolean
  options: OnboardingCardOption[]
}

export interface OnboardingRythmeStep extends OnboardingStepBase {
  kind: 'rythme'
  frequence: {
    label: string
    options: { value: OnboardingFrequence; label: string }[]
  }
  duree: {
    label: string
    options: { value: OnboardingDuree; label: string; desc: string }[]
  }
}

export type OnboardingStep = OnboardingSelectionStep | OnboardingRythmeStep

export interface OnboardingSeanceCandidate {
  name: string
  cat: ExerciseCategory
  blocks: number
  suits: {
    obj?: OnboardingObjectif[]
    disc?: OnboardingDiscipline[]
    sport?: OnboardingSport[]
    zones?: OnboardingZone[]
    lvl?: OnboardingNiveau[]
  }
}
