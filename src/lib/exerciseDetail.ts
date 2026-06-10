import type { Exercise, MuscleGroup } from '../data/exercices'

export type ExerciseLevel = 'débutant' | 'confirmé' | 'expert'

const EQUIPMENT_BY_ID: Record<string, string> = {
  'wall-sit': 'Mur',
  'bulgarian-split-squat': 'Banc',
  'hip-thrust': 'Banc',
  rdl: 'Haltères',
  'pull-up': 'Barre de traction',
  'row-dumbbell': 'Haltère, banc',
  'lateral-raise': 'Haltères',
  'bicep-curl': 'Haltères',
  'hammer-curl': 'Haltères',
  'tricep-extension': 'Haltère',
  dips: 'Chaise',
  'calf-raise': 'Marche (optionnel)',
}

export function getExerciseEquipment(exercise: Exercise): string {
  return exercise.equipment ?? EQUIPMENT_BY_ID[exercise.id] ?? 'Aucun matériel'
}

export function getExerciseMuscleGroups(exercise: Exercise): MuscleGroup[] {
  if (exercise.muscleGroups?.length) return exercise.muscleGroups
  return [exercise.category]
}

export function getExerciseLevelProposals(
  exercise: Exercise,
): { level: ExerciseLevel; label: string }[] {
  if (exercise.type === 'duration') {
    const duration = exercise.defaultDuration ?? 30
    const sets = exercise.defaultSets ?? 3
    return [
      {
        level: 'débutant',
        label: `${Math.max(10, Math.round(duration * 0.65))}s × ${Math.max(2, sets - 1)} séries`,
      },
      { level: 'confirmé', label: `${duration}s × ${sets} séries` },
      { level: 'expert', label: `${Math.round(duration * 1.35)}s × ${sets + 1} séries` },
    ]
  }

  const reps = exercise.defaultReps ?? 10
  const sets = exercise.defaultSets ?? 3
  return [
    {
      level: 'débutant',
      label: `${Math.max(1, Math.round(reps * 0.65))} reps × ${Math.max(2, sets - 1)} séries`,
    },
    { level: 'confirmé', label: `${reps} reps × ${sets} séries` },
    { level: 'expert', label: `${Math.round(reps * 1.35)} reps × ${sets + 1} séries` },
  ]
}
