import type { PlayerStep } from '../types'

const PHASE_LABELS: Record<PlayerStep['phase'], string> = {
  prepare: 'Prépa',
  work: 'Effort',
  rest: 'Repos',
  done: 'Terminé',
}

export function formatPlayerStepMeta(step: PlayerStep): string {
  const parts = [`Série ${step.set}/${step.totalSets}`]
  if (step.totalExercisesInBlock > 1) {
    parts.push(`Exercice ${step.exerciseIndexInBlock + 1}/${step.totalExercisesInBlock}`)
  }
  return parts.join(' · ')
}

export function formatPlayerStepPreview(step: PlayerStep): string {
  if (step.phase === 'rest') return step.exerciseTitle
  if (step.reps) return `${step.exerciseTitle} · ${step.reps} reps`
  if (step.duration > 0) return `${step.exerciseTitle} · ${step.duration}s`
  return step.exerciseTitle
}

export function getPlayerStepPhaseLabel(phase: PlayerStep['phase']): string {
  return PHASE_LABELS[phase]
}

export function getUpcomingPlayerSteps(
  steps: PlayerStep[],
  currentIndex: number,
  limit = 4,
): { index: number; step: PlayerStep }[] {
  const upcoming: { index: number; step: PlayerStep }[] = []
  for (let i = currentIndex + 1; i < steps.length && upcoming.length < limit; i++) {
    upcoming.push({ index: i, step: steps[i] })
  }
  return upcoming
}
