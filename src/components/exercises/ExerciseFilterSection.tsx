import OnboardingChip from '@/components/onboarding/OnboardingChip'
import { ONBOARDING_ACCENT } from '@/data/onboarding'

type ExerciseFilterSectionProps<T extends string> = {
  title: string
  options: { value: T; label: string }[]
  selected: T | null
  onToggle: (value: T) => void
}

export default function ExerciseFilterSection<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: ExerciseFilterSectionProps<T>) {
  return (
    <section className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/45">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <OnboardingChip
            key={option.value}
            label={option.label}
            selected={selected === option.value}
            accent={ONBOARDING_ACCENT}
            onClick={() => onToggle(option.value)}
          />
        ))}
      </div>
    </section>
  )
}
