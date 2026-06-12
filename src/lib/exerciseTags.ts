import type { Exercise, MuscleGroup } from '@/data/exercices'
import type {
  OnboardingContrainte,
  OnboardingMateriel,
  OnboardingNiveau,
  OnboardingObjectif,
  OnboardingSport,
  OnboardingZone,
} from '@/types/onboarding'
import type { ExerciseTags } from '@/data/exercices'

export const MUSCLE_GROUP_TO_ZONES: Record<MuscleGroup, OnboardingZone[]> = {
  Gainage: ['abdos'],
  'Cuisses & Fessiers': ['jambes'],
  'Ischio-jambiers': ['ischio', 'jambes'],
  Pectoraux: ['pecs'],
  Épaules: ['epaules'],
  Dos: ['dos'],
  Biceps: ['bras'],
  Triceps: ['bras'],
  Mollets: ['mollets'],
  'Cardio / Full Body': [],
}

export const ZONE_TO_MUSCLE_GROUPS: Record<OnboardingZone, MuscleGroup[]> = {
  jambes: ['Cuisses & Fessiers'],
  ischio: ['Ischio-jambiers'],
  mollets: ['Mollets'],
  abdos: ['Gainage'],
  dos: ['Dos'],
  pecs: ['Pectoraux'],
  epaules: ['Épaules'],
  bras: ['Biceps', 'Triceps'],
}

const MATERIEL_LABELS: Record<OnboardingMateriel, string> = {
  'poids-corps': 'Poids du corps',
  tapis: 'Tapis',
  halteres: 'Haltères',
  elastiques: 'Élastiques',
  kettlebell: 'Kettlebell',
  barre: 'Barre & poids',
  banc: 'Banc',
  trx: 'Sangles TRX',
}

const EQUIPMENT_STRING_TO_MATERIEL: Record<string, OnboardingMateriel[]> = {
  mur: ['poids-corps'],
  banc: ['banc'],
  haltères: ['halteres'],
  haltère: ['halteres'],
  barre: ['barre'],
  chaise: ['poids-corps', 'banc'],
  marche: ['poids-corps'],
  élastique: ['elastiques'],
  elastique: ['elastiques'],
  tapis: ['tapis', 'poids-corps'],
}

export type ResolvedExerciseTags = {
  objectifs: OnboardingObjectif[]
  sports: OnboardingSport[]
  zones: OnboardingZone[]
  muscleGroups: MuscleGroup[]
  materiel: OnboardingMateriel[]
  niveau: OnboardingNiveau[]
  contraindications: OnboardingContrainte[]
}

export function mapOnboardingZonesToMuscleGroups(zones: OnboardingZone[]): MuscleGroup[] {
  const groups = new Set<MuscleGroup>()
  for (const zone of zones) {
    for (const group of ZONE_TO_MUSCLE_GROUPS[zone]) {
      groups.add(group)
    }
  }
  return [...groups]
}

export function mapMuscleGroupsToOnboardingZones(groups: MuscleGroup[]): OnboardingZone[] {
  const zones = new Set<OnboardingZone>()
  for (const group of groups) {
    for (const zone of MUSCLE_GROUP_TO_ZONES[group]) {
      zones.add(zone)
    }
  }
  return [...zones]
}

function inferMaterielFromEquipmentString(equipment: string): OnboardingMateriel[] {
  const lower = equipment.toLowerCase()
  const found = new Set<OnboardingMateriel>()
  for (const [needle, materiels] of Object.entries(EQUIPMENT_STRING_TO_MATERIEL)) {
    if (lower.includes(needle)) {
      for (const m of materiels) found.add(m)
    }
  }
  if (found.size === 0 && (lower.includes('aucun') || lower === '')) {
    found.add('poids-corps')
  }
  return [...found]
}

function inferMaterielFromExercise(exercise: Exercise): OnboardingMateriel[] {
  if (exercise.tags?.materiel?.length) return exercise.tags.materiel
  if (exercise.equipment) return inferMaterielFromEquipmentString(exercise.equipment)
  return ['poids-corps']
}

function inferZonesFromExercise(exercise: Exercise): OnboardingZone[] {
  if (exercise.tags?.zones?.length) return exercise.tags.zones
  const groups = exercise.muscleGroups?.length
    ? exercise.muscleGroups
    : [exercise.category]
  return mapMuscleGroupsToOnboardingZones(groups)
}

function inferMuscleGroupsFromExercise(exercise: Exercise): MuscleGroup[] {
  if (exercise.muscleGroups?.length) return exercise.muscleGroups
  return [exercise.category]
}

export function resolveExerciseTags(exercise: Exercise): ResolvedExerciseTags {
  const tags: ExerciseTags | undefined = exercise.tags
  return {
    objectifs: tags?.objectifs ?? [],
    sports: tags?.sports ?? [],
    zones: inferZonesFromExercise(exercise),
    muscleGroups: inferMuscleGroupsFromExercise(exercise),
    materiel: inferMaterielFromExercise(exercise),
    niveau: tags?.niveau ?? [],
    contraindications: tags?.contraindications ?? [],
  }
}

export function formatMaterielList(materiel: OnboardingMateriel[]): string {
  if (materiel.length === 0) return 'Aucun matériel'
  return materiel.map((m) => MATERIEL_LABELS[m]).join(', ')
}

export function getMaterielLabel(materiel: OnboardingMateriel): string {
  return MATERIEL_LABELS[materiel]
}
