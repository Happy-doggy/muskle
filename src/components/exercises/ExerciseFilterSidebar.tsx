import ExerciseFilterPanel from './ExerciseFilterPanel'
import type { ExerciseFiltersController } from '@/hooks/useExerciseFilters'

type ExerciseFilterSidebarProps = {
  controller: ExerciseFiltersController
}

export default function ExerciseFilterSidebar({ controller }: ExerciseFilterSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-4 rounded-xl border border-border bg-white p-4">
        <h2 className="font-display text-lg text-ink mb-4">Filtres</h2>
        <ExerciseFilterPanel
          filters={controller.browse}
          profileConstraints={controller.profileConstraints}
          onChange={controller.replaceBrowseFilters}
          hasProfile={controller.hasProfile}
          onApplyProfile={controller.applyProfile}
          onReset={controller.resetBrowseFilters}
        />
      </div>
    </aside>
  )
}
