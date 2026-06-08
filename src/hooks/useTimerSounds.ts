/**
 * hooks/useTimerSounds.ts
 *
 * Bip court les 3 dernières secondes d'un exercice ou d'un repos.
 * Bip long au début d'un exercice.
 */

import { useEffect, useRef } from 'react'
import type { TimerPhase } from '../types'
import { playLongBeep, playShortBeep } from '../lib/timerSounds'

interface UseTimerSoundsOptions {
  remaining: number
  isRunning: boolean
  phase: TimerPhase
  duration: number
  stepIndex: number
}

export function useTimerSounds({
  remaining,
  isRunning,
  phase,
  duration,
  stepIndex,
}: UseTimerSoundsOptions) {
  const prevStepIndex = useRef(-1)
  const lastBeepedRemaining = useRef<number | null>(null)

  useEffect(() => {
    if (stepIndex === prevStepIndex.current) return

    prevStepIndex.current = stepIndex
    lastBeepedRemaining.current = null

    if (phase === 'work') {
      playLongBeep()
    }
  }, [stepIndex, phase])

  useEffect(() => {
    if (!isRunning) return
    if (phase !== 'work' && phase !== 'rest') return
    if (duration <= 0) return
    if (remaining > 3 || remaining < 1) return
    if (lastBeepedRemaining.current === remaining) return

    lastBeepedRemaining.current = remaining
    playShortBeep()
  }, [remaining, isRunning, phase, duration])
}
