import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Dumbbell } from 'lucide-react'
import { findExerciseById } from '../data/exercices'
import { useExerciseCatalog } from '../hooks/useExerciseCatalog'
import { formatExerciseDefaults } from '../lib/customExercises'

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { exercises } = useExerciseCatalog()

  if (!id) {
    return <Navigate to="/exercises" replace />
  }

  const exercise = findExerciseById(exercises, id)

  if (!exercise) {
    return <Navigate to="/exercises" replace />
  }

  return (
    <div>
      <Link
        to="/exercises"
        className="inline-flex items-center gap-2 text-sm font-medium text-ink/55 hover:text-mint transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Retour aux exercices
      </Link>

      <article className="list-card overflow-hidden p-0">
        {exercise.video ? (
          <video
            src={exercise.video}
            poster={exercise.image}
            loop
            muted
            autoPlay
            playsInline
            className="w-full aspect-[4/3] object-cover bg-ink"
          />
        ) : (
          <div className="aspect-[4/3] relative bg-secondary overflow-hidden">
            {exercise.image ? (
              <img
                src={exercise.image}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-paper-warm">
                <Dumbbell size={40} className="text-muted-foreground/40" />
              </div>
            )}
          </div>
        )}

        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl text-ink leading-snug">{exercise.name}</h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-mint text-white font-medium shrink-0">
              {exercise.category}
            </span>
          </div>

          {exercise.description && (
            <p className="text-sm text-ink/60 leading-relaxed">{exercise.description}</p>
          )}

          <p className="text-sm text-ink/40">{formatExerciseDefaults(exercise)}</p>
        </div>
      </article>
    </div>
  )
}
