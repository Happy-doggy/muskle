import type { Exercise, MuscleGroup } from '@/data/exercices'
import type {
  OnboardingAnswers,
  OnboardingMateriel,
  OnboardingNiveau,
  OnboardingObjectif,
  OnboardingSport,
} from '@/types/onboarding'
import {
  NIVEAU_LABELS,
  OBJECTIF_LABELS,
  SPORT_LABELS,
} from '@/lib/exerciseFilterOptions'
import { getMaterielLabel, resolveExerciseTags } from '@/lib/exerciseTags'
import { mapOnboardingZonesToMuscleGroups } from '@/lib/exerciseTags'

/** Onglet principal de la bibliothèque. */
export type ExerciseLibraryTab = 'profile' | 'favorites' | 'all'

export const EXERCISE_LIBRARY_TAB_META: Record<
  ExerciseLibraryTab,
  { label: string; description: string }
> = {
  profile: {
    label: 'Pour moi',
    description: 'Exercices qui correspondent à votre profil.',
  },
  favorites: {
    label: 'Mes favoris',
    description: 'Exercices que vous avez mis en favori.',
  },
  all: {
    label: 'Tous',
    description: 'Tous les exercices.',
  },
}

/** Filtres de navigation — ce que l'utilisateur change en parcourant la bibliothèque. */
export type ExerciseBrowseFilters = {
  muscleGroup: MuscleGroup | null
  objectif: OnboardingObjectif | null
  sport: OnboardingSport | null
  searchQuery: string
  profileApplied: boolean
}

/** Contraintes issues du profil sportif — appliquées automatiquement, modifiables depuis Mon compte. */
export type ExerciseProfileConstraints = {
  materiel: OnboardingMateriel[]
  niveau: OnboardingNiveau | null
}

export type ExerciseFilterContext = {
  browse: ExerciseBrowseFilters
  profile: ExerciseProfileConstraints | null
}

export const EMPTY_BROWSE_FILTERS: ExerciseBrowseFilters = {
  muscleGroup: null,
  objectif: null,
  sport: null,
  searchQuery: '',
  profileApplied: false,
}

/** @deprecated alias for migration within the codebase */
export type ExerciseFilterState = ExerciseBrowseFilters

export const EMPTY_EXERCISE_FILTERS = EMPTY_BROWSE_FILTERS

export function getProfileConstraints(
  answers: OnboardingAnswers | null | undefined,
): ExerciseProfileConstraints | null {
  if (!answers) return null
  const hasMateriel = answers.materiel.length > 0
  const hasNiveau = Boolean(answers.niveau)
  if (!hasMateriel && !hasNiveau) return null
  return {
    materiel: [...answers.materiel],
    niveau: answers.niveau ?? null,
  }
}

function matchesSingle<T>(selected: T | null, values: T[]): boolean {
  if (!selected) return true
  if (values.length === 0) return false
  return values.includes(selected)
}

function matchesMaterielConstraint(
  available: OnboardingMateriel[],
  exerciseMateriel: OnboardingMateriel[],
): boolean {
  if (available.length === 0) return true
  if (exerciseMateriel.length === 0) return false
  return available.some((m) => exerciseMateriel.includes(m))
}

function matchesNiveauConstraint(
  niveau: OnboardingNiveau | null,
  exerciseNiveaux: OnboardingNiveau[],
): boolean {
  if (!niveau) return true
  if (exerciseNiveaux.length === 0) return false
  return exerciseNiveaux.includes(niveau)
}

function matchesBrowseTags(
  exercise: Exercise,
  browse: ExerciseBrowseFilters,
): boolean {
  const tags = resolveExerciseTags(exercise)
  return (
    matchesSingle(browse.muscleGroup, tags.muscleGroups) &&
    matchesSingle(browse.objectif, tags.objectifs) &&
    matchesSingle(browse.sport, tags.sports)
  )
}

function matchesProfileTags(
  exercise: Exercise,
  profile: ExerciseProfileConstraints | null,
): boolean {
  if (!profile) return true
  const tags = resolveExerciseTags(exercise)
  return (
    matchesMaterielConstraint(profile.materiel, tags.materiel) &&
    matchesNiveauConstraint(profile.niveau, tags.niveau)
  )
}

export function matchesUserProfile(
  exercise: Exercise,
  answers: OnboardingAnswers,
): boolean {
  const tags = resolveExerciseTags(exercise)
  const constraints = getProfileConstraints(answers)

  if (constraints && !matchesProfileTags(exercise, constraints)) return false

  if (answers.objectif) {
    if (tags.objectifs.length === 0 || !tags.objectifs.includes(answers.objectif)) {
      return false
    }
  }

  if (answers.sport.length > 0) {
    if (tags.sports.length === 0 || !answers.sport.some((s) => tags.sports.includes(s))) {
      return false
    }
  }

  if (answers.zones.length > 0) {
    const groups = mapOnboardingZonesToMuscleGroups(answers.zones)
    if (!groups.some((g) => tags.muscleGroups.includes(g))) return false
  }

  return true
}

export type FilterExercisesOptions = {
  tab: ExerciseLibraryTab
  favoriteIds?: Set<string>
  profileAnswers?: OnboardingAnswers | null
}

export function filterExercises(
  exercises: Exercise[],
  browse: ExerciseBrowseFilters,
  options: FilterExercisesOptions,
): Exercise[] {
  let result = exercises

  if (options.tab === 'favorites' && options.favoriteIds) {
    result = result.filter((e) => options.favoriteIds!.has(e.id))
  }

  if (options.tab === 'profile') {
    if (options.profileAnswers) {
      result = result.filter((e) => matchesUserProfile(e, options.profileAnswers!))
    } else {
      result = []
    }
  }

  if (browse.searchQuery.trim()) {
    const q = browse.searchQuery.trim().toLowerCase()
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q),
    )
  }

  const hasBrowseTags =
    browse.muscleGroup !== null || browse.objectif !== null || browse.sport !== null

  if (hasBrowseTags) {
    result = result.filter((e) => matchesBrowseTags(e, browse))
  }

  return result
}

export function countExercisesForTab(
  exercises: Exercise[],
  browse: ExerciseBrowseFilters,
  tab: ExerciseLibraryTab,
  favoriteIds?: Set<string>,
  profileAnswers?: OnboardingAnswers | null,
): number {
  return filterExercises(exercises, browse, { tab, favoriteIds, profileAnswers }).length
}

export type FilterRelaxSuggestion = {
  key: 'muscleGroup' | 'objectif' | 'sport' | 'profile'
  label: string
  resultCount: number
}

export function suggestFilterRelaxation(
  exercises: Exercise[],
  browse: ExerciseBrowseFilters,
  options: FilterExercisesOptions,
): FilterRelaxSuggestion | null {
  const current = filterExercises(exercises, browse, options)
  if (current.length > 0) return null

  const candidates: FilterRelaxSuggestion[] = []

  if (browse.sport) {
    const count = filterExercises(
      exercises,
      { ...browse, sport: null },
      options,
    ).length
    if (count > 0) {
      candidates.push({
        key: 'sport',
        label: SPORT_LABELS[browse.sport],
        resultCount: count,
      })
    }
  }

  if (browse.objectif) {
    const count = filterExercises(
      exercises,
      { ...browse, objectif: null },
      options,
    ).length
    if (count > 0) {
      candidates.push({
        key: 'objectif',
        label: OBJECTIF_LABELS[browse.objectif],
        resultCount: count,
      })
    }
  }

  if (browse.muscleGroup) {
    const count = filterExercises(
      exercises,
      { ...browse, muscleGroup: null },
      options,
    ).length
    if (count > 0) {
      candidates.push({
        key: 'muscleGroup',
        label: browse.muscleGroup,
        resultCount: count,
      })
    }
  }

  if (options.tab === 'profile' && options.profileAnswers) {
    const count = filterExercises(exercises, browse, {
      ...options,
      tab: 'all',
    }).length
    if (count > 0) {
      candidates.push({
        key: 'profile',
        label: 'contraintes du profil',
        resultCount: count,
      })
    }
  }

  if (candidates.length === 0) return null
  return candidates.sort((a, b) => b.resultCount - a.resultCount)[0]
}

export function countActiveBrowseFilters(browse: ExerciseBrowseFilters): number {
  let count = 0
  if (browse.muscleGroup) count += 1
  if (browse.objectif) count += 1
  if (browse.sport) count += 1
  return count
}

/** @deprecated */
export function countActiveFilterAxes(browse: ExerciseBrowseFilters): number {
  return countActiveBrowseFilters(browse)
}

export function buildFilterSummary(browse: ExerciseBrowseFilters): string {
  const parts: string[] = []
  if (browse.muscleGroup) parts.push(browse.muscleGroup)
  if (browse.objectif) parts.push(OBJECTIF_LABELS[browse.objectif])
  if (browse.sport) parts.push(SPORT_LABELS[browse.sport])
  return parts.join(' · ')
}

export function buildProfileConstraintsSummary(
  profile: ExerciseProfileConstraints,
): string {
  const parts: string[] = []
  if (profile.materiel.length > 0) {
    parts.push(profile.materiel.map(getMaterielLabel).join(', '))
  }
  if (profile.niveau) {
    parts.push(NIVEAU_LABELS[profile.niveau])
  }
  return parts.join(' · ')
}

export function browseFiltersFromProfile(
  answers: OnboardingAnswers,
): Partial<ExerciseBrowseFilters> {
  const groups = mapOnboardingZonesToMuscleGroups(answers.zones)
  return {
    objectif: answers.objectif ?? null,
    sport: answers.sport.length === 1 ? answers.sport[0] : null,
    muscleGroup: groups.length === 1 ? groups[0] : null,
    profileApplied: true,
  }
}

export function toggleSingleFilter<T>(current: T | null, value: T): T | null {
  return current === value ? null : value
}
