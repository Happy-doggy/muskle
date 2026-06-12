import { useCallback, useEffect, useState } from 'react'
import {
  createAdminExercise,
  deleteAdminExercise,
  getAdminExercises,
  updateAdminExercise,
} from '@/storage/adminExercises'
import type { AdminExercise, AdminExerciseInput } from '@/types/adminExercise'

export function useAdminExercises() {
  const [exercises, setExercises] = useState<AdminExercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await getAdminExercises()
      setExercises(list)
    } catch (err) {
      console.error('[useAdminExercises] Failed to fetch exercises', err)
      setError('Impossible de charger les exercices.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const createExercise = useCallback(async (input: AdminExerciseInput) => {
    const created = await createAdminExercise(input)
    setExercises((prev) => [...prev, created])
    return created
  }, [])

  const updateExercise = useCallback(async (exercise: AdminExercise) => {
    const updated = await updateAdminExercise(exercise)
    setExercises((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e)),
    )
    return updated
  }, [])

  const deleteExercise = useCallback(async (id: string) => {
    await deleteAdminExercise(id)
    setExercises((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return {
    exercises,
    loading,
    error,
    refresh,
    createExercise,
    updateExercise,
    deleteExercise,
  }
}
