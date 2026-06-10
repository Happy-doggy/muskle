import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Dumbbell } from 'lucide-react'
import { findExerciseById, type Exercise } from '../data/exercices'
import { useExerciseCatalog } from '../hooks/useExerciseCatalog'
import {
  getExerciseEquipment,
  getExerciseLevelProposals,
  getExerciseMuscleGroups,
} from '../lib/exerciseDetail'
import ExerciseFavoriteButton from '../components/ExerciseFavoriteButton'

function ExerciseDetailMedia({ exercise }: { exercise: Exercise }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-paper-warm">
      {exercise.video ? (
        <video
          src={exercise.video}
          poster={exercise.image}
          loop
          muted
          autoPlay
          playsInline
          className="h-full w-full object-cover bg-ink"
        />
      ) : exercise.image ? (
        <img
          src={exercise.image}
          alt={exercise.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Dumbbell size={48} className="text-muted-foreground/40" />
        </div>
      )}
    </div>
  )
}

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

  const equipment = getExerciseEquipment(exercise)
  const muscleGroups = getExerciseMuscleGroups(exercise)
  const levelProposals = getExerciseLevelProposals(exercise)

  return (
    <div className="exercise-detail-page relative left-1/2 w-screen max-w-none -translate-x-1/2 -my-8">
      <div className="px-6 py-6 sm:px-8 lg:px-12">
        <Link
          to="/exercises"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/55 transition-colors hover:text-mint"
        >
          <ArrowLeft size={16} />
          Retour aux exercices
        </Link>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="order-2 mt-6 flex flex-col px-6 pb-8 sm:px-8 lg:order-1 lg:mt-0 lg:px-12 lg:pb-10 xl:px-16">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              {exercise.name}
            </h1>
            <ExerciseFavoriteButton exerciseId={exercise.id} variant="inline" />
          </div>

          <div className="mt-8 flex flex-col gap-8">
            {exercise.description && (
              <section className="flex flex-col gap-2">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                  Description
                </h2>
                <p className="text-base leading-relaxed text-ink/70">{exercise.description}</p>
              </section>
            )}

            <section className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                Matériel requis
              </h2>
              <p className="text-base text-ink/70">{equipment}</p>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                Groupes musculaires sollicités
              </h2>
              <ul className="flex flex-wrap gap-2">
                {muscleGroups.map((group) => (
                  <li
                    key={group}
                    className="rounded-full bg-mint px-3 py-1 text-sm font-medium text-white"
                  >
                    {group}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                Volume suggéré
              </h2>
              <ul className="flex flex-col gap-2">
                {levelProposals.map(({ level, label }) => (
                  <li
                    key={level}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border bg-white px-4 py-3"
                  >
                    <span className="text-sm font-medium capitalize text-ink">{level}</span>
                    <span className="text-sm text-ink/60">{label}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="order-1 px-6 sm:px-8 lg:order-2 lg:px-12 xl:px-16">
          <ExerciseDetailMedia exercise={exercise} />
        </div>
      </div>
    </div>
  )
}
