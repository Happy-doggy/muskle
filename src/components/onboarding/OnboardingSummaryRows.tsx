import { Pencil } from 'lucide-react'
import { ONBOARDING_STEPS } from '@/data/onboarding'
import { labelsForStep } from '@/lib/onboardingUtils'
import type { OnboardingAnswers } from '@/types/onboarding'

type OnboardingSummaryRowsProps = {
  answers: OnboardingAnswers
  onEditStep?: (stepIndex: number) => void
}

export default function OnboardingSummaryRows({ answers, onEditStep }: OnboardingSummaryRowsProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card">
      {ONBOARDING_STEPS.map((s, i) => {
        const labels = labelsForStep(s, answers[s.id as keyof OnboardingAnswers])
        return (
          <div
            key={s.id}
            className="flex items-start gap-3 px-4 py-[13px]"
            style={{ borderTop: i === 0 ? undefined : '1px solid var(--border)' }}
          >
            <span className="w-[104px] shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-ink/42">
              {s.eyebrow}
            </span>
            <span className="flex flex-1 flex-wrap gap-1.5">
              {labels.length ? (
                labels.map((l) => (
                  <span
                    key={l}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium text-ink"
                  >
                    {l}
                  </span>
                ))
              ) : (
                <span className="pt-0.5 text-sm text-ink/40">—</span>
              )}
            </span>
            {onEditStep && (
              <button
                type="button"
                onClick={() => onEditStep(i)}
                aria-label={`Modifier ${s.eyebrow}`}
                className="inline-flex shrink-0 items-center gap-1 p-0.5 text-sm font-semibold text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Pencil size={14} aria-hidden />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
