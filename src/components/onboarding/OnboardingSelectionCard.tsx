import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { colorMix } from '@/lib/onboardingUtils'
import { OnboardingIcon } from './OnboardingIcon'
import type { OnboardingCardOption } from '@/types/onboarding'

type OnboardingSelectionCardProps = {
  option: OnboardingCardOption
  selected: boolean
  accent?: string
  onClick: () => void
}

export default function OnboardingSelectionCard({
  option,
  selected,
  accent = 'var(--mint)',
  onClick,
}: OnboardingSelectionCardProps) {
  const [hover, setHover] = useState(false)

  const borderColor = selected ? accent : hover ? colorMix(accent, 55) : 'var(--border)'
  const bgColor = selected ? colorMix(accent, 7) : 'var(--card)'
  const tileBg = selected ? accent : colorMix(accent, 9)
  const tileFg = selected ? '#fff' : accent

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        'flex w-full items-center gap-3.5 rounded-[var(--radius)] border-[1.5px] p-3.5 text-left',
        'font-sans transition-[border-color,background,box-shadow] duration-[180ms] ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
      style={{
        background: bgColor,
        borderColor,
        boxShadow: selected ? `0 1px 0 ${colorMix(accent, 40)}` : undefined,
      }}
    >
      <span
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-[background,color] duration-[180ms]"
        style={{ background: tileBg, color: tileFg }}
      >
        {option.icon && <OnboardingIcon name={option.icon} size={22} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold leading-tight text-ink">{option.label}</span>
        {option.desc && (
          <span className="mt-0.5 block text-sm text-ink/52">{option.desc}</span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          'inline-flex size-[22px] shrink-0 items-center justify-center rounded-full transition-colors duration-[180ms]',
          !selected && 'border-[1.5px] border-border',
        )}
        style={selected ? { background: accent, color: '#fff' } : undefined}
      >
        {selected && <Check size={14} strokeWidth={3} />}
      </span>
    </button>
  )
}
