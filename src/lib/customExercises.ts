import type { Exercise } from '@/types/exercise'

export function formatExerciseDefaults(ex: Exercise): string {
  if (ex.type === 'duration') {
    return `${ex.defaultDuration}s × ${ex.defaultSets} séries`
  }
  return `${ex.defaultReps} reps × ${ex.defaultSets} séries`
}
