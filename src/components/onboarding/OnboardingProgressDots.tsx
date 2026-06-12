import { motion } from 'framer-motion'
import { ONBOARDING_ACCENT } from '@/data/onboarding'

type OnboardingProgressDotsProps = {
  current: number
  total: number
  accent?: string
}

export default function OnboardingProgressDots({
  current,
  total,
  accent = ONBOARDING_ACCENT,
}: OnboardingProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          className="h-[7px] rounded-full"
          animate={{
            width: i === current ? 22 : 7,
            backgroundColor: i <= current ? accent : 'var(--paper-warm)',
          }}
          transition={{
            width: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
            backgroundColor: { duration: 0.3, ease: 'easeOut' },
          }}
        />
      ))}
    </div>
  )
}
