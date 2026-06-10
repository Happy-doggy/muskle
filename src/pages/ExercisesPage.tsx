/**
 * ExercisesPage.tsx
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  filterExercisesByCategory,
  muscleGroups,
  type MuscleGroup,
} from '../data/exercices'
import { useExerciseCatalog } from '../hooks/useExerciseCatalog'
import { Button } from '../components/ui/button'
import { cn } from '@/lib/utils'
import { Dumbbell, Plus } from 'lucide-react'
import ExerciseCard from '../components/ExerciseCard'

export default function ExercisesPage() {
  const { exercises } = useExerciseCatalog()
  const [category, setCategory] = useState<MuscleGroup | null>(null)

  const filteredExercises = useMemo(() => {
    if (!category) return exercises
    return filterExercisesByCategory(exercises, category)
  }, [exercises, category])

  const count = filteredExercises.length

  return (
    <div className="exercise-page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink">Exercices</h1>
          <p className="text-ink/50 text-sm mt-1">
            {count} exercice{count !== 1 ? 's' : ''}
            {category ? ` · ${category}` : ''}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/exercises/new">
            <Plus size={16} />
            Ajouter
          </Link>
        </Button>
      </div>

      <div className="tabs tabs-static mb-6 w-fit max-w-full">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={cn('tab', category === null && 'tab-active')}
        >
          Tous
        </button>
        {muscleGroups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setCategory(group)}
            className={cn('tab', category === group && 'tab-active')}
          >
            {group}
          </button>
        ))}
      </div>

      {filteredExercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Dumbbell size={32} className="text-ink/20" />
          <h3 className="font-medium text-ink">Aucun exercice</h3>
          <p className="text-sm text-ink/50 max-w-xs">
            Aucun exercice dans cette catégorie.
          </p>
        </div>
      ) : (
        <div className="exercise-grid">
          {filteredExercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  )
}
