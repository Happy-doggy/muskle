import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { colorMix } from '@/lib/onboardingUtils'
import { ONBOARDING_ACCENT } from '@/data/onboarding'

type OnboardingChipProps = {
  label: string
  selected: boolean
  accent?: string
  onClick: () => void
}

export default function OnboardingChip({
  label,
  selected,
  accent = ONBOARDING_ACCENT,
  onClick,
}: OnboardingChipProps) {
  const [hover, setHover] = useState(false)

  const borderColor = selected ? accent : hover ? colorMix(accent, 50) : 'var(--border)'

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-4 py-2',
        'text-sm font-semibold font-sans transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        selected ? 'text-[var(--chip-accent)]' : 'bg-card text-ink/72',
      )}
      style={{
        ['--chip-accent' as string]: accent,
        background: selected ? colorMix(accent, 13) : undefined,
        borderColor,
        color: selected ? accent : undefined,
      }}
    >
      {selected && <Check size={13} strokeWidth={3} />}
      {label}
    </button>
  )
}
