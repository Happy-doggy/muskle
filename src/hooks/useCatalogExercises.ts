import { useEffect, useState } from 'react'
import { catalogToExercise } from '@/lib/exercises'
import { subscribeCatalogExercises } from '@/storage/adminExercises'
import type { Exercise } from '@/types/exercise'

export function useCatalogExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeCatalogExercises(
      (catalog) => {
        setExercises(catalog.map(catalogToExercise))
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('[useCatalogExercises] Failed to fetch exercises', err)
        setError('Impossible de charger les exercices.')
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  return { exercises, loading, error }
}
