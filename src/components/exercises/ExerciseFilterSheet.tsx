import { SlidersHorizontal } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ExerciseFiltersController } from '@/hooks/useExerciseFilters'
import ExerciseFilterPanel from './ExerciseFilterPanel'

type ExerciseFilterSheetProps = {
  controller: ExerciseFiltersController
}

export default function ExerciseFilterSheet({ controller }: ExerciseFilterSheetProps) {
  const {
    mobileDraftOpen,
    mobileFilters,
    profileConstraints,
    activeAxesCount,
    openMobileDraft,
    applyMobileDraft,
    cancelMobileDraft,
    resetMobileDraft,
    updateMobileDraft,
    hasProfile,
    applyProfileToDraft,
  } = controller

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="lg:hidden gap-2"
        onClick={openMobileDraft}
        aria-label="Ouvrir les filtres"
      >
        <SlidersHorizontal size={16} />
        Filtres
        {activeAxesCount > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-mint px-1.5 text-xs font-semibold text-white">
            {activeAxesCount}
          </span>
        )}
      </Button>

      <Dialog open={mobileDraftOpen} onOpenChange={(open) => !open && cancelMobileDraft()}>
        <DialogContent
          className={cn(
            'fixed left-0 right-0 top-auto bottom-0 z-50 flex max-h-[85vh] w-full max-w-none',
            'translate-x-0 translate-y-0 flex-col gap-0 rounded-t-2xl rounded-b-none p-0',
            'data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
          )}
        >
          <DialogHeader className="border-b border-border px-5 py-4 text-left">
            <DialogTitle className="font-display text-xl">Filtres</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <ExerciseFilterPanel
              filters={mobileFilters}
              profileConstraints={profileConstraints}
              onChange={updateMobileDraft}
              hasProfile={hasProfile}
              onApplyProfile={applyProfileToDraft}
              onReset={resetMobileDraft}
              compact
            />
          </div>

          <DialogFooter className="sticky bottom-0 border-t border-border bg-background px-5 py-4 flex-row gap-2 sm:justify-between">
            <Button type="button" variant="ghost" onClick={cancelMobileDraft}>
              Annuler
            </Button>
            <Button type="button" onClick={applyMobileDraft}>
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
