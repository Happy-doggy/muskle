import { useCallback, useMemo, useState } from 'react'
import type { Exercise } from '../data/exercices'
import {
  getCatalogExercises,
  loadCustomExercises,
  saveCustomExercise,
} from '../lib/customExercises'

export function useExerciseCatalog() {
  const [customVersion, setCustomVersion] = useState(0)

  const exercises = useMemo(() => {
    void customVersion
    return getCatalogExercises()
  }, [customVersion])

  const addExercise = useCallback((exercise: Exercise) => {
    saveCustomExercise(exercise)
    setCustomVersion((v) => v + 1)
  }, [])

  const customExercises = useMemo(() => {
    void customVersion
    return loadCustomExercises()
  }, [customVersion])

  return { exercises, customExercises, addExercise, refresh: () => setCustomVersion((v) => v + 1) }
}
