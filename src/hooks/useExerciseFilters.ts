import { useCallback, useMemo, useState } from 'react'
import type { MuscleGroup } from '@/data/exercices'
import type { OnboardingObjectif, OnboardingSport } from '@/types/onboarding'
import {
  EMPTY_BROWSE_FILTERS,
  browseFiltersFromProfile,
  countActiveBrowseFilters,
  getProfileConstraints,
  type ExerciseBrowseFilters,
  type ExerciseLibraryTab,
  toggleSingleFilter,
} from '@/lib/exerciseFilters'
import { useOnboardingPreferences } from './useOnboardingPreferences'

export function useExerciseFilters() {
  const { answers } = useOnboardingPreferences()
  const [browse, setBrowse] = useState<ExerciseBrowseFilters>(EMPTY_BROWSE_FILTERS)
  const [mobileDraft, setMobileDraft] = useState<ExerciseBrowseFilters | null>(null)
  const [activeTab, setActiveTab] = useState<ExerciseLibraryTab>('profile')

  const profileConstraints = useMemo(
    () => getProfileConstraints(answers),
    [answers],
  )

  const hasProfile = Boolean(
    answers &&
      (answers.objectif ||
        answers.sport.length > 0 ||
        answers.zones.length > 0 ||
        answers.materiel.length > 0 ||
        answers.niveau),
  )

  const applyProfile = useCallback(() => {
    if (!answers) return
    setBrowse((prev) => ({
      ...prev,
      ...browseFiltersFromProfile(answers),
    }))
    setMobileDraft(null)
  }, [answers])

  const applyProfileToDraft = useCallback(() => {
    if (!answers) return
    const base = mobileDraft ?? browse
    setMobileDraft({
      ...base,
      ...browseFiltersFromProfile(answers),
    })
  }, [answers, browse, mobileDraft])

  const resetBrowseFilters = useCallback(() => {
    setBrowse(EMPTY_BROWSE_FILTERS)
    setMobileDraft(null)
  }, [])

  const relaxFilter = useCallback((key: 'muscleGroup' | 'objectif' | 'sport') => {
    setBrowse((prev) => ({ ...prev, [key]: null, profileApplied: false }))
  }, [])

  const setSearchQuery = useCallback((searchQuery: string) => {
    setBrowse((prev) => ({ ...prev, searchQuery }))
  }, [])

  const toggleMuscleGroup = useCallback((value: MuscleGroup) => {
    setBrowse((prev) => ({
      ...prev,
      muscleGroup: toggleSingleFilter(prev.muscleGroup, value),
      profileApplied: false,
    }))
  }, [])

  const toggleObjectif = useCallback((value: OnboardingObjectif) => {
    setBrowse((prev) => ({
      ...prev,
      objectif: toggleSingleFilter(prev.objectif, value),
      profileApplied: false,
    }))
  }, [])

  const toggleSport = useCallback((value: OnboardingSport) => {
    setBrowse((prev) => ({
      ...prev,
      sport: toggleSingleFilter(prev.sport, value),
      profileApplied: false,
    }))
  }, [])

  const replaceBrowseFilters = useCallback((next: ExerciseBrowseFilters) => {
    setBrowse(next)
  }, [])

  const openMobileDraft = useCallback(() => {
    setMobileDraft({ ...browse })
  }, [browse])

  const applyMobileDraft = useCallback(() => {
    if (mobileDraft) setBrowse(mobileDraft)
    setMobileDraft(null)
  }, [mobileDraft])

  const resetMobileDraft = useCallback(() => {
    setMobileDraft(EMPTY_BROWSE_FILTERS)
  }, [])

  const cancelMobileDraft = useCallback(() => {
    setMobileDraft(null)
  }, [])

  const updateMobileDraft = useCallback((next: ExerciseBrowseFilters) => {
    setMobileDraft(next)
  }, [])

  const mobileFilters = mobileDraft ?? browse

  const activeAxesCount = useMemo(() => countActiveBrowseFilters(browse), [browse])

  return {
    /** @deprecated use browse */
    filters: browse,
    browse,
    activeTab,
    setActiveTab,
    profileConstraints,
    profileAnswers: answers,
    mobileFilters,
    mobileDraftOpen: mobileDraft !== null,
    activeAxesCount,
    hasProfile,
    applyProfile,
    applyProfileToDraft,
    resetBrowseFilters,
    /** @deprecated */
    resetFilters: resetBrowseFilters,
    relaxFilter,
    setSearchQuery,
    toggleMuscleGroup,
    toggleObjectif,
    toggleSport,
    openMobileDraft,
    applyMobileDraft,
    cancelMobileDraft,
    resetMobileDraft,
    updateMobileDraft,
    /** @deprecated */
    replaceFilters: replaceBrowseFilters,
    replaceBrowseFilters,
  }
}

export type ExerciseFiltersController = ReturnType<typeof useExerciseFilters>
