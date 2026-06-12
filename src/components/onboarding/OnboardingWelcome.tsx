import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Dumbbell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { colorMix } from '@/lib/onboardingUtils'
import { ONBOARDING_ACCENT } from '@/data/onboarding'

type OnboardingWelcomeProps = {
  onStart: () => void
  onSkip: () => void
}

export default function OnboardingWelcome({ onStart, onSkip }: OnboardingWelcomeProps) {
  const reduceMotion = useReducedMotion()
  const accent = ONBOARDING_ACCENT

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-[460px] pt-2 text-center"
    >
      <span
        className="mb-[22px] inline-flex size-16 items-center justify-center rounded-[18px]"
        style={{ background: colorMix(accent, 12), color: accent }}
      >
        <Dumbbell size={30} strokeWidth={2} aria-hidden />
      </span>
      <h1 className="font-display text-[30px] leading-[1.12] text-ink">On construit ton plan ?</h1>
      <p className="mx-auto mb-7 mt-3 max-w-[460px] text-lg leading-normal text-ink/60">
        Quelques questions rapides et on te propose des séances taillées pour toi. Deux minutes, pas
        plus.
      </p>
      <Button
        type="button"
        onClick={onStart}
        className="h-[52px] w-full max-w-sm text-base font-semibold"
      >
        C&apos;est parti
        <ArrowRight size={18} />
      </Button>
      <div className="mt-4">
        <Button
          type="button"
          variant="link"
          onClick={onSkip}
          className="text-sm font-medium text-ink/50 underline underline-offset-[3px]"
        >
          Passer pour l&apos;instant
        </Button>
      </div>
    </motion.div>
  )
}
