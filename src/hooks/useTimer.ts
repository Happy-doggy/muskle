/**
 * hooks/useTimer.ts
 *
 * Timer pour le player de séance.
 * Gère les phases : prepare → work → rest → (next step)
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import type { TimerPhase } from '../types'

interface UseTimerOptions {
  duration: number          // durée totale de la phase (secondes)
  onComplete?: () => void   // appelé quand le timer atteint 0
  autoStart?: boolean
}

interface UseTimerReturn {
  remaining: number         // secondes restantes
  elapsed: number           // secondes écoulées
  progress: number          // 0 → 1
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
}

export function useTimer({
  duration,
  onComplete,
  autoStart = false,
}: UseTimerOptions): UseTimerReturn {
  const [remaining, setRemaining] = useState(duration)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onCompleteRef = useRef(onComplete)

  // Toujours garder la ref à jour sans re-créer l'interval
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Reset quand la durée change (nouvelle phase)
  useEffect(() => {
    setRemaining(duration)
    setIsRunning(autoStart)
  }, [duration, autoStart])

  // Tick
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          onCompleteRef.current?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback(() => {
    setIsRunning(false)
    setRemaining(duration)
  }, [duration])
  const skip = useCallback(() => {
    setIsRunning(false)
    setRemaining(0)
    onCompleteRef.current?.()
  }, [])

  return {
    remaining,
    elapsed: duration - remaining,
    progress: duration > 0 ? (duration - remaining) / duration : 0,
    isRunning,
    start,
    pause,
    reset,
    skip,
  }
}

// ── hook de phase (enchaîne prepare → work → rest) ────

interface UsePhaseTimerOptions {
  prepareTime: number
  workTime: number
  restTime: number
  hasReps?: boolean     // si true, skip automatiquement work (durée = 0)
  onPhaseChange?: (phase: TimerPhase) => void
  onComplete?: () => void
  autoStart?: boolean
}

export function usePhaseTimer({
  prepareTime,
  workTime,
  restTime,
  hasReps = false,
  onPhaseChange,
  onComplete,
  autoStart = false,
}: UsePhaseTimerOptions) {
  const [phase, setPhase] = useState<TimerPhase>('prepare')
  const onPhaseRef = useRef(onPhaseChange)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => { onPhaseRef.current = onPhaseChange }, [onPhaseChange])
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  // Durée de la phase courante
  const phaseDuration =
    phase === 'prepare' ? prepareTime :
    phase === 'work'    ? (hasReps ? 0 : workTime) :
    phase === 'rest'    ? restTime : 0

  const handlePhaseComplete = useCallback(() => {
    setPhase((current) => {
      let next: TimerPhase
      if (current === 'prepare') next = 'work'
      else if (current === 'work') next = restTime > 0 ? 'rest' : 'done'
      else next = 'done'

      if (next === 'done') {
        onCompleteRef.current?.()
      } else {
        onPhaseRef.current?.(next)
      }
      return next
    })
  }, [restTime])

  const timer = useTimer({
    duration: phaseDuration,
    onComplete: handlePhaseComplete,
    autoStart: autoStart && phase === 'prepare',
  })

  // Reset quand les durées changent (nouvel exercice)
  useEffect(() => {
    setPhase('prepare')
  }, [prepareTime, workTime, restTime])

  return { phase, timer, phaseDuration }
}
