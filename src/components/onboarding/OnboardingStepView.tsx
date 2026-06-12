import { motion, useReducedMotion } from 'framer-motion'
import { CATEGORY_CSS_VAR, ONBOARDING_ACCENT } from '@/data/onboarding'
import { emptyContraintes, toggleInArray } from '@/lib/onboardingUtils'
import type {
  MultiWithNone,
  OnboardingAnswers,
  OnboardingRythme,
  OnboardingSelectionStep,
  OnboardingStep,
} from '@/types/onboarding'
import OnboardingChip from './OnboardingChip'
import OnboardingRythmeFields from './OnboardingRythmeFields'
import OnboardingSelectionCard from './OnboardingSelectionCard'

type OnboardingStepViewProps = {
  step: OnboardingStep
  value: unknown
  onChange: (updater: unknown) => void
}

export default function OnboardingStepView({ step, value, onChange }: OnboardingStepViewProps) {
  const reduceMotion = useReducedMotion()
  const accent = ONBOARDING_ACCENT

  let body: React.ReactNode

  if (step.kind === 'rythme') {
    body = (
      <OnboardingRythmeFields
        step={step}
        value={value as Partial<OnboardingRythme> | undefined}
        onChange={(updater) =>
          onChange((prev: Partial<OnboardingRythme> | undefined) => updater(prev))
        }
      />
    )
  } else if (step.display === 'chips') {
    const arr = (value as string[] | undefined) ?? []
    body = (
      <div className="flex flex-wrap gap-2.5">
        {step.options.map((o) => (
          <OnboardingChip
            key={o.value}
            label={o.label}
            selected={arr.includes(o.value)}
            onClick={() =>
              onChange((prev: string[] | undefined) => toggleInArray(prev, o.value))
            }
          />
        ))}
        {step.hasNone && (
          <OnboardingChip
            label="Aucune, je suis au top"
            selected={
              arr.length === 0 &&
              value !== undefined &&
              Boolean((value as MultiWithNone<string>).__none)
            }
            onClick={() => onChange(() => emptyContraintes())}
          />
        )}
      </div>
    )
  } else {
    const selectionStep = step as OnboardingSelectionStep
    const multi = selectionStep.kind === 'multi'
    const selectedValues = multi ? ((value as string[] | undefined) ?? []) : (value as string | undefined)

    body = (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {selectionStep.options.map((o) => {
          const sel = multi
            ? (selectedValues ?? []).includes(o.value)
            : selectedValues === o.value
          const cardAccent = o.cat ? CATEGORY_CSS_VAR[o.cat] ?? accent : accent
          return (
            <OnboardingSelectionCard
              key={o.value}
              option={o}
              selected={sel}
              accent={cardAccent}
              onClick={() =>
                onChange(
                  multi
                    ? (prev: string[] | undefined) => toggleInArray(prev, o.value)
                    : o.value,
                )
              }
            />
          )
        })}
      </div>
    )
  }

  return (
    <motion.div
      key={step.id}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="mb-[22px]">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-mint">
          {step.eyebrow}
        </span>
        <h1 className="font-display text-2xl leading-[1.15] text-ink">{step.title}</h1>
        <p className="mt-1.5 text-sm leading-normal text-ink/55">{step.help}</p>
      </header>
      {body}
    </motion.div>
  )
}

export type { OnboardingAnswers }