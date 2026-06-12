import { UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ExerciseBrowseFilters } from '@/lib/exerciseFilters'
import { toggleSingleFilter } from '@/lib/exerciseFilters'
import {
  EXERCISE_FILTER_MUSCLE_GROUPS,
  EXERCISE_FILTER_OBJECTIFS,
  EXERCISE_FILTER_SPORTS,
} from '@/lib/exerciseFilterOptions'
import type { ExerciseProfileConstraints } from '@/lib/exerciseFilters'
import ExerciseFilterSection from './ExerciseFilterSection'
import ExerciseProfileConstraintsHint from './ExerciseProfileConstraintsHint'

type ExerciseFilterPanelProps = {
  filters: ExerciseBrowseFilters
  profileConstraints: ExerciseProfileConstraints | null
  onChange: (next: ExerciseBrowseFilters) => void
  hasProfile: boolean
  onApplyProfile: () => void
  onReset: () => void
  compact?: boolean
}

function patchBrowse(
  filters: ExerciseBrowseFilters,
  patch: Partial<ExerciseBrowseFilters>,
): ExerciseBrowseFilters {
  return { ...filters, ...patch, profileApplied: false }
}

export default function ExerciseFilterPanel({
  filters,
  profileConstraints,
  onChange,
  hasProfile,
  onApplyProfile,
  onReset,
  compact = false,
}: ExerciseFilterPanelProps) {
  const muscleOptions = EXERCISE_FILTER_MUSCLE_GROUPS.map((group) => ({
    value: group,
    label: group,
  }))

  return (
    <div className={compact ? 'space-y-4' : 'space-y-5'}>
      {profileConstraints && (
        <ExerciseProfileConstraintsHint constraints={profileConstraints} />
      )}

      {hasProfile && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={onApplyProfile}
        >
          <UserRound size={16} />
          Selon mon profil
        </Button>
      )}

      {filters.profileApplied && (
        <p className="text-xs text-mint font-medium -mt-2">Profil appliqué</p>
      )}

      <ExerciseFilterSection
        title="Zone musculaire"
        options={muscleOptions}
        selected={filters.muscleGroup}
        onToggle={(value) =>
          onChange(patchBrowse(filters, {
            muscleGroup: toggleSingleFilter(filters.muscleGroup, value),
          }))
        }
      />

      <ExerciseFilterSection
        title="Objectif"
        options={EXERCISE_FILTER_OBJECTIFS}
        selected={filters.objectif}
        onToggle={(value) =>
          onChange(patchBrowse(filters, {
            objectif: toggleSingleFilter(filters.objectif, value),
          }))
        }
      />

      <ExerciseFilterSection
        title="Sport"
        options={EXERCISE_FILTER_SPORTS}
        selected={filters.sport}
        onToggle={(value) =>
          onChange(patchBrowse(filters, {
            sport: toggleSingleFilter(filters.sport, value),
          }))
        }
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full text-ink/50"
        onClick={onReset}
      >
        Tout effacer
      </Button>
    </div>
  )
}
