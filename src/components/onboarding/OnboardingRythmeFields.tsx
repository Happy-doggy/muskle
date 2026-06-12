import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { colorMix } from '@/lib/onboardingUtils'
import { ONBOARDING_ACCENT } from '@/data/onboarding'
import type { OnboardingDuree, OnboardingFrequence, OnboardingRythme, OnboardingRythmeStep } from '@/types/onboarding'

type OnboardingRythmeFieldsProps = {
  step: OnboardingRythmeStep
  value: Partial<OnboardingRythme> | undefined
  accent?: string
  onChange: (updater: (prev: Partial<OnboardingRythme> | undefined) => Partial<OnboardingRythme>) => void
}

export default function OnboardingRythmeFields({
  step,
  value,
  accent = ONBOARDING_ACCENT,
  onChange,
}: OnboardingRythmeFieldsProps) {
  const reduceMotion = useReducedMotion()

  const set = (key: keyof OnboardingRythme, v: OnboardingFrequence | OnboardingDuree) => {
    onChange((prev) => ({ ...prev, [key]: v }))
  }

  const Group = ({
    cfg,
    fieldKey,
    big,
  }: {
    cfg: OnboardingRythmeStep['frequence'] | OnboardingRythmeStep['duree']
    fieldKey: keyof OnboardingRythme
    big?: boolean
  }) => (
    <div className="mb-6">
      <span className="mb-2.5 block text-sm font-semibold text-ink">{cfg.label}</span>
      <div className="grid grid-cols-4 gap-2.5">
        {cfg.options.map((o) => {
          const sel = value?.[fieldKey] === o.value
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => set(fieldKey, o.value as OnboardingFrequence & OnboardingDuree)}
              className={cn(
                'flex cursor-pointer flex-col items-center gap-0.5 rounded-[var(--radius)] border-[1.5px] font-sans transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                big ? 'px-2 py-3.5' : 'px-2 py-4',
              )}
              style={{
                background: sel ? colorMix(accent, 12) : 'var(--card)',
                borderColor: sel ? accent : 'var(--border)',
              }}
            >
              <span
                className="font-display text-2xl font-semibold"
                style={{ color: sel ? accent : 'var(--ink)' }}
              >
                {o.label}
              </span>
              {'desc' in o && o.desc && (
                <span className="text-xs text-ink/50">{o.desc}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <Group cfg={step.frequence} fieldKey="frequence" big />
      <Group cfg={step.duree} fieldKey="duree" />
    </motion.div>
  )
}
