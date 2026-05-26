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
import { formatExerciseDefaults } from '../lib/customExercises'
import { Button } from '../components/ui/button'
import { cn } from '@/lib/utils'
import { Dumbbell, Plus } from 'lucide-react'

export default function ExercisesPage() {
  const { exercises } = useExerciseCatalog()
  const [category, setCategory] = useState<MuscleGroup | null>(null)

  const filteredExercises = useMemo(() => {
    if (!category) return exercises
    return filterExercisesByCategory(exercises, category)
  }, [exercises, category])

  const count = filteredExercises.length

  return (
    <div>
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

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={category === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategory(null)}
        >
          Tous
        </Button>
        {muscleGroups.map((group) => (
          <Button
            key={group}
            variant={category === group ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(group)}
          >
            {group}
          </Button>
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
        <div className="grid gap-3">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              className={cn(
                'bg-paper-warm border border-paper-muted rounded-lg p-4 flex gap-4 items-start shadow-card hover:shadow-card-hover transition-shadow'
              )}
            >
              {ex.image ? (
                <img src={ex.image} alt={ex.name} className="w-14 h-14 object-cover rounded" />
              ) : (
                <div className="w-14 h-14 bg-paper-muted rounded flex items-center justify-center shrink-0">
                  <Dumbbell size={20} className="text-ink/30" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-medium text-ink">{ex.name}</h3>
                  <span className="text-[10px] px-1.5 py-0 rounded-full bg-paper-muted text-ink/60 font-medium">
                    {ex.category}
                  </span>
                </div>
                {ex.description && (
                  <p className="text-sm text-ink/60 line-clamp-2 mb-1">{ex.description}</p>
                )}
                <p className="text-xs text-ink/40">{formatExerciseDefaults(ex)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
