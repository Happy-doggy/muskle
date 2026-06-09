import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Exercise } from '../data/exercices'
import { exercisesDB } from '../data/exercices'
import {
  getCatalogExercises,
  loadCustomExercises,
  saveCustomExercise,
} from '../lib/customExercises'

export function useExerciseCatalog() {
  const [customVersion, setCustomVersion] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void loadCustomExercises()
      .then(() => {
        if (!cancelled) setReady(true)
      })
      .catch((err) => {
        console.error('[useExerciseCatalog] Failed to load custom exercises', err)
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [customVersion])

  const exercises = useMemo(() => {
    void customVersion
    void ready
    return getCatalogExercises()
  }, [customVersion, ready])

  const addExercise = useCallback(async (exercise: Exercise) => {
    await saveCustomExercise(exercise)
    setCustomVersion((v) => v + 1)
  }, [])

  const customExercises = useMemo(() => {
    void customVersion
    void ready
    return getCatalogExercises().filter(
      (ex) => !exercisesDB.some((builtIn) => builtIn.id === ex.id),
    )
  }, [customVersion, ready])

  return { exercises, customExercises, addExercise, refresh: () => setCustomVersion((v) => v + 1) }
}
