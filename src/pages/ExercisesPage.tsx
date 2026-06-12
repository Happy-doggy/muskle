/**
 * ExercisesPage.tsx
 */
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { useExerciseCatalog } from '../hooks/useExerciseCatalog'
import { useExerciseFavorites } from '../hooks/useExerciseFavorites'
import { useExerciseFilters } from '../hooks/useExerciseFilters'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import {
  buildFilterSummary,
  countExercisesForTab,
  filterExercises,
  suggestFilterRelaxation,
  type ExerciseLibraryTab,
} from '@/lib/exerciseFilters'
import { Link } from 'react-router-dom'
import { Dumbbell, Search } from 'lucide-react'
import ExerciseCard from '../components/ExerciseCard'
import ExerciseFilterSidebar from '../components/exercises/ExerciseFilterSidebar'
import ExerciseFilterSheet from '../components/exercises/ExerciseFilterSheet'
import ExerciseLibraryTabs from '../components/exercises/ExerciseLibraryTabs'

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

const LIBRARY_TABS: ExerciseLibraryTab[] = ['profile', 'favorites', 'all']

export default function ExercisesPage() {
  const { exercises } = useExerciseCatalog()
  const { favoriteIds } = useExerciseFavorites()
  const filterController = useExerciseFilters()
  const {
    browse,
    activeTab,
    setActiveTab,
    profileAnswers,
    setSearchQuery,
    relaxFilter,
    resetBrowseFilters,
  } = filterController

  const filterOptions = useMemo(
    () => ({
      tab: activeTab,
      favoriteIds,
      profileAnswers,
    }),
    [activeTab, favoriteIds, profileAnswers],
  )

  const tabCounts = useMemo(() => {
    const counts = {} as Record<ExerciseLibraryTab, number>
    for (const tab of LIBRARY_TABS) {
      counts[tab] = countExercisesForTab(
        exercises,
        browse,
        tab,
        favoriteIds,
        profileAnswers,
      )
    }
    return counts
  }, [exercises, browse, favoriteIds, profileAnswers])

  const filteredExercises = useMemo(
    () => filterExercises(exercises, browse, filterOptions),
    [exercises, browse, filterOptions],
  )

  const relaxSuggestion = useMemo(
    () =>
      filteredExercises.length === 0
        ? suggestFilterRelaxation(exercises, browse, filterOptions)
        : null,
    [exercises, browse, filterOptions, filteredExercises.length],
  )

  const filterLabel = browse.searchQuery.trim() ? 'Recherche' : buildFilterSummary(browse)

  const emptyMessage = browse.searchQuery.trim()
    ? 'Aucun exercice ne correspond à votre recherche.'
    : activeTab === 'favorites'
      ? "Aucun exercice favori. Cliquez sur le cœur d'une carte pour l'ajouter."
      : activeTab === 'profile' && !profileAnswers
        ? 'Complétez votre profil sportif pour voir des exercices personnalisés.'
        : relaxSuggestion
          ? 'Cette combinaison ne correspond à aucun exercice.'
          : filterLabel
            ? `Aucun exercice pour ${filterLabel.toLowerCase()}.`
            : 'Aucun exercice disponible.'

  const handleRelax = () => {
    if (!relaxSuggestion || relaxSuggestion.key === 'profile') return
    relaxFilter(relaxSuggestion.key)
  }

  const relaxButtonLabel =
    relaxSuggestion && relaxSuggestion.key !== 'profile'
      ? `Retirer « ${relaxSuggestion.label} » (${relaxSuggestion.resultCount} exercices)`
      : null

  const showAllExercisesAction =
    relaxSuggestion?.key === 'profile' && relaxSuggestion.resultCount > 0

  return (
    <div className="exercise-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink">Exercices</h1>
          {filterLabel && (
            <p className="text-ink/50 text-sm mt-1">Filtres actifs · {filterLabel}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <ExerciseFilterSheet controller={filterController} />
          <div className="relative w-full sm:w-64 shrink-0">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              aria-hidden
            />
            <Input
              type="search"
              value={browse.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un exercice…"
              className="h-10 pl-9"
              aria-label="Rechercher un exercice"
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(240px,280px)_1fr] gap-6">
        <ExerciseFilterSidebar controller={filterController} />

        <div className="min-w-0">
          <ExerciseLibraryTabs
            activeTab={activeTab}
            counts={tabCounts}
            onTabChange={setActiveTab}
          />

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
                <p className="text-sm text-ink/50 max-w-sm">{emptyMessage}</p>
                {activeTab === 'profile' && !profileAnswers && (
                  <Link
                    to="/account"
                    className="text-sm font-medium text-mint hover:underline"
                  >
                    Configurer mon profil sportif
                  </Link>
                )}
                {relaxButtonLabel && (
                  <Button type="button" variant="outline" size="sm" onClick={handleRelax}>
                    {relaxButtonLabel}
                  </Button>
                )}
                {showAllExercisesAction && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('all')}
                  >
                    Voir tous les exercices ({relaxSuggestion!.resultCount})
                  </Button>
                )}
                {relaxSuggestion?.key === 'profile' && !showAllExercisesAction && (
                  <Link
                    to="/account"
                    className="text-sm font-medium text-mint hover:underline"
                  >
                    Ajuster matériel ou niveau dans Mon compte
                  </Link>
                )}
                {(browse.muscleGroup || browse.objectif || browse.sport) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-ink/50"
                    onClick={resetBrowseFilters}
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </motion.div>
            ) : (
              <motion.div layout className="exercise-grid exercise-grid-with-sidebar">
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
      </div>
    </div>
  )
}
