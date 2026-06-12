import { cn } from '@/lib/utils'
import {
  EXERCISE_LIBRARY_TAB_META,
  type ExerciseLibraryTab,
} from '@/lib/exerciseFilters'

type ExerciseLibraryTabsProps = {
  activeTab: ExerciseLibraryTab
  counts: Record<ExerciseLibraryTab, number>
  onTabChange: (tab: ExerciseLibraryTab) => void
}

const TAB_ORDER: ExerciseLibraryTab[] = ['profile', 'favorites', 'all']

export default function ExerciseLibraryTabs({
  activeTab,
  counts,
  onTabChange,
}: ExerciseLibraryTabsProps) {
  const activeMeta = EXERCISE_LIBRARY_TAB_META[activeTab]
  const activeCount = counts[activeTab]

  return (
    <div className="space-y-3 mb-5">
      <div className="tabs tabs-static w-full sm:w-fit overflow-x-auto scrollbar-hide">
        {TAB_ORDER.map((tab) => {
          const meta = EXERCISE_LIBRARY_TAB_META[tab]
          const count = counts[tab]
          const isActive = activeTab === tab

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={cn('tab whitespace-nowrap', isActive && 'tab-active')}
              aria-pressed={isActive}
            >
              {meta.label}
              <span
                className={cn(
                  'ml-1.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-secondary text-ink/50',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3 flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/70">{activeMeta.description}</p>
        <p className="text-sm font-medium text-ink shrink-0">
          {activeCount} exercice{activeCount !== 1 ? 's' : ''} affiché{activeCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
