/**
 * hooks/useSessionPlayer.ts
 *
 * Transforme une Session en une liste plate de PlayerStep[]
 * et gère la navigation entre les steps.
 */

import { useMemo, useState, useCallback } from 'react'
import type { Block } from '../data/blocks'
import type { Session } from '../data/sessions'
import type { Exercise } from '../data/exercices'
import type { PlayerStep } from '../types'

interface UseSessionPlayerOptions {
  session: Session
  blocks: Block[]
  exercises: Exercise[]
}

function pushWorkAndRest(
  steps: PlayerStep[],
  opts: {
    blockName: string
    blockIndex: number
    exercise: Exercise
    blockEx: Block['exercises'][number]
    set: number
    totalSets: number
    exIdx: number
    totalExercisesInBlock: number
  },
) {
  const {
    blockName,
    blockIndex,
    exercise,
    blockEx,
    set,
    totalSets,
    exIdx,
    totalExercisesInBlock,
  } = opts

  const base = {
    blockTitle: blockName,
    blockIndex,
    exerciseTitle: exercise.name,
    exerciseDescription: exercise.description,
    exerciseImageUrl: exercise.image,
    exerciseVideoUrl: exercise.video,
    set,
    totalSets,
    exerciseIndexInBlock: exIdx,
    totalExercisesInBlock,
  }

  if (exercise.type === 'duration' || blockEx.duration) {
    steps.push({
      ...base,
      phase: 'work',
      duration: blockEx.duration ?? exercise.defaultDuration ?? 30,
    })
  } else {
    steps.push({
      ...base,
      phase: 'work',
      duration: 0,
      reps: blockEx.reps ?? exercise.defaultReps ?? 12,
    })
  }

  const rest = blockEx.restSeconds ?? 0
  if (rest > 0) {
    steps.push({
      ...base,
      phase: 'rest',
      duration: rest,
    })
  }
}

export function buildPlayerSteps(
  session: Session,
  blocks: Block[],
  exercises: Exercise[],
): PlayerStep[] {
  const steps: PlayerStep[] = []
  const blockMap = new Map(blocks.map((b) => [b.id, b]))
  const exerciseMap = new Map(exercises.map((e) => [e.id, e]))

  session.blockIds.forEach((blockId, blockIndex) => {
    const block = blockMap.get(blockId)
    if (!block) return

    if (block.mode === 'circuit') {
      const rounds = block.rounds ?? 1
      for (let round = 0; round < rounds; round++) {
        block.exercises.forEach((blockEx, exIdx) => {
          const exercise = exerciseMap.get(blockEx.exerciseId)
          if (!exercise) return
          pushWorkAndRest(steps, {
            blockName: block.name,
            blockIndex,
            exercise,
            blockEx,
            set: round + 1,
            totalSets: rounds,
            exIdx,
            totalExercisesInBlock: block.exercises.length,
          })
        })
        const between = block.restBetweenRounds ?? 0
        if (between > 0 && round < rounds - 1) {
          steps.push({
            blockTitle: block.name,
            blockIndex,
            exerciseTitle: 'Repos entre rounds',
            exerciseDescription: '',
            set: round + 1,
            totalSets: rounds,
            exerciseIndexInBlock: 0,
            totalExercisesInBlock: block.exercises.length,
            phase: 'rest',
            duration: between,
          })
        }
      }
    } else {
      block.exercises.forEach((blockEx, exIdx) => {
        const exercise = exerciseMap.get(blockEx.exerciseId)
        if (!exercise) return
        const totalSets = blockEx.sets ?? exercise.defaultSets ?? 1
        for (let setIdx = 0; setIdx < totalSets; setIdx++) {
          pushWorkAndRest(steps, {
            blockName: block.name,
            blockIndex,
            exercise,
            blockEx,
            set: setIdx + 1,
            totalSets,
            exIdx,
            totalExercisesInBlock: block.exercises.length,
          })
        }
      })
    }
  })

  return steps
}

export function useSessionPlayer({ session, blocks, exercises }: UseSessionPlayerOptions) {
  const steps = useMemo(
    () => buildPlayerSteps(session, blocks, exercises),
    [session, blocks, exercises],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const currentStep = steps[currentIndex] ?? null

  const goNext = useCallback(() => {
    if (currentIndex >= steps.length - 1) {
      setIsFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, steps.length])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
    }
  }, [currentIndex])

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < steps.length) {
        setCurrentIndex(index)
        setIsFinished(false)
      }
    },
    [steps.length],
  )

  const restart = useCallback(() => {
    setCurrentIndex(0)
    setIsFinished(false)
  }, [])

  const progress = steps.length > 0 ? currentIndex / steps.length : 0

  const totalDuration = useMemo(
    () => steps.reduce((acc, s) => acc + s.duration, 0),
    [steps],
  )

  return {
    steps,
    currentStep,
    currentIndex,
    isFinished,
    progress,
    totalDuration,
    canGoPrev: currentIndex > 0,
    canGoNext: currentIndex < steps.length - 1,
    goNext,
    goPrev,
    goToStep,
    restart,
  }
}
