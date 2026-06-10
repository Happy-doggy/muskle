/**
 * ExercisesPage.tsx
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import {
  filterExercisesByCategory,
  filterExercisesByFavorites,
  filterExercisesBySearch,
  muscleGroups,
  type MuscleGroup,
} from '../data/exercices'
import { useExerciseCatalog } from '../hooks/useExerciseCatalog'
import { useExerciseFavorites } from '../hooks/useExerciseFavorites'
import { Input } from '../components/ui/input'
import { cn } from '@/lib/utils'
import { Dumbbell, Heart, Search } from 'lucide-react'
import ExerciseCard from '../components/ExerciseCard'

const cardVariants = {
  initial: { opacity: 0, y: 14, scale: 0.97 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.04,
      duration: 0.28,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
}

export default function ExercisesPage() {
  const { exercises } = useExerciseCatalog()
  const { favoriteIds } = useExerciseFavorites()
  const [category, setCategory] = useState<MuscleGroup | null>(null)
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCategoryChange = (next: MuscleGroup | null) => {
    setFavoritesOnly(false)
    setCategory(next)
  }

  const handleFavoritesToggle = () => {
    setFavoritesOnly((active) => {
      if (!active) setCategory(null)
      return !active
    })
  }

  const filteredExercises = useMemo(() => {
    let result = exercises
    if (favoritesOnly) result = filterExercisesByFavorites(result, favoriteIds)
    else if (category) result = filterExercisesByCategory(result, category)
    if (searchQuery.trim()) result = filterExercisesBySearch(result, searchQuery)
    return result
  }, [exercises, category, favoritesOnly, favoriteIds, searchQuery])

  const count = filteredExercises.length
  const filterLabel = searchQuery.trim()
    ? 'Recherche'
    : favoritesOnly
      ? 'Favoris'
      : category

  const emptyMessage = searchQuery.trim()
    ? 'Aucun exercice ne correspond à votre recherche.'
    : favoritesOnly
      ? 'Aucun exercice favori. Cliquez sur le cœur d\'une carte pour l\'ajouter.'
      : 'Aucun exercice dans cette catégorie.'

  return (
    <div className="exercise-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink">Exercices</h1>
          <p className="text-ink/50 text-sm mt-1">
            {count} exercice{count !== 1 ? 's' : ''}
            {filterLabel ? ` · ${filterLabel}` : ''}
          </p>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un exercice…"
            className="h-10 pl-9"
            aria-label="Rechercher un exercice"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6 w-full md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="tabs tabs-static w-fit max-w-full overflow-x-auto scrollbar-hide">
          <button
            type="button"
            onClick={() => handleCategoryChange(null)}
            className={cn('tab', category === null && !favoritesOnly && 'tab-active')}
          >
            Tous
          </button>
          {muscleGroups.map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => handleCategoryChange(group)}
              className={cn('tab', category === group && !favoritesOnly && 'tab-active')}
            >
              {group}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleFavoritesToggle}
          className={cn(
            'shrink-0 flex items-center justify-center gap-2 h-10 px-3 rounded-lg border border-border bg-white transition-colors',
            'hover:border-mint/60 w-full md:w-auto md:ml-auto',
            favoritesOnly && 'bg-mint text-white border-mint',
          )}
          aria-label={favoritesOnly ? 'Afficher tous les exercices' : 'Afficher mes favoris'}
          aria-pressed={favoritesOnly}
        >
          <Heart size={18} className={cn(favoritesOnly && 'fill-current')} />
          <span className="text-sm font-medium">Mes favoris</span>
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {filteredExercises.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-20 text-center gap-3"
          >
            <Dumbbell size={32} className="text-ink/20" />
            <h3 className="font-medium text-ink">Aucun exercice</h3>
            <p className="text-sm text-ink/50 max-w-xs">{emptyMessage}</p>
          </motion.div>
        ) : (
          <motion.div layout className="exercise-grid">
            <AnimatePresence mode="popLayout">
              {filteredExercises.map((ex, index) => (
                <motion.div
                  key={ex.id}
                  layout
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={index}
                  transition={{
                    layout: { type: 'spring', stiffness: 420, damping: 36 },
                  }}
                >
                  <ExerciseCard exercise={ex} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
