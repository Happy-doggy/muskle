import { Heart } from 'lucide-react'
import { useExerciseFavorites } from '../hooks/useExerciseFavorites'
import { cn } from '@/lib/utils'

type ExerciseFavoriteButtonProps = {
  exerciseId: string
  variant?: 'overlay' | 'inline'
  className?: string
}

export default function ExerciseFavoriteButton({
  exerciseId,
  variant = 'overlay',
  className,
}: ExerciseFavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useExerciseFavorites()
  const favorited = isFavorite(exerciseId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(exerciseId)
      }}
      className={cn(
        'flex items-center justify-center rounded-full transition-colors',
        variant === 'overlay' &&
          'absolute top-2.5 right-2.5 z-10 size-9 bg-white/90 backdrop-blur-sm border border-border/60 shadow-sm hover:bg-white',
        variant === 'inline' &&
          'size-10 shrink-0 border border-border bg-white hover:border-mint/60',
        favorited && 'text-mint border-mint/40',
        className,
      )}
      aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={favorited}
    >
      <Heart size={18} className={cn(favorited && 'fill-current')} />
    </button>
  )
}
