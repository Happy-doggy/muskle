import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Exercise } from '../data/exercices'
import { formatExerciseDefaults } from '../lib/customExercises'
import ExerciseFavoriteButton from './ExerciseFavoriteButton'
import { cn } from '@/lib/utils'
import { Dumbbell } from 'lucide-react'

type ExerciseCardProps = {
  exercise: Exercise
  className?: string
}

function ExerciseCardMedia({ exercise }: { exercise: Exercise }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovering, setHovering] = useState(false)
  const hasVideo = Boolean(exercise.video)

  const handleEnter = () => {
    if (!hasVideo) return
    setHovering(true)
    void videoRef.current?.play()
  }

  const handleLeave = () => {
    if (!hasVideo) return
    setHovering(false)
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  return (
    <div
      className="aspect-[4/3] relative bg-secondary overflow-hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {hasVideo && (
        <video
          ref={videoRef}
          src={exercise.video}
          poster={exercise.image}
          loop
          muted
          playsInline
          preload="metadata"
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            hovering ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
      {exercise.image ? (
        <img
          src={exercise.image}
          alt={exercise.name}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            hovering && hasVideo && 'opacity-0',
          )}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-paper-warm">
          <Dumbbell size={40} className="text-muted-foreground/40" />
        </div>
      )}
      <ExerciseFavoriteButton exerciseId={exercise.id} />
    </div>
  )
}

export function ExerciseCardContent({ exercise }: { exercise: Exercise }) {
  return (
    <>
      <ExerciseCardMedia exercise={exercise} />
      <div className="p-5 flex flex-col flex-1 gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-medium text-ink leading-snug">{exercise.name}</h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-mint text-white font-medium shrink-0">
            {exercise.category}
          </span>
        </div>
        {exercise.description && (
          <p className="text-sm text-ink/60 line-clamp-2 flex-1">{exercise.description}</p>
        )}
        <p className="text-xs text-ink/40">{formatExerciseDefaults(exercise)}</p>
      </div>
    </>
  )
}

export default function ExerciseCard({ exercise, className }: ExerciseCardProps) {
  return (
    <div className={cn('list-card list-card-clickable overflow-hidden flex flex-col p-0', className)}>
      <Link
        to={`/exercises/${exercise.id}`}
        className="flex flex-col flex-1 min-h-0"
      >
        <ExerciseCardContent exercise={exercise} />
      </Link>
    </div>
  )
}
