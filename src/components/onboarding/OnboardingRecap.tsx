import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Play, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import OnboardingSummaryRows from '@/components/onboarding/OnboardingSummaryRows'
import { CATEGORY_CSS_VAR, CATEGORY_LABEL, ONBOARDING_ACCENT } from '@/data/onboarding'
import { colorMix, pickSeances } from '@/lib/onboardingUtils'
import type { OnboardingAnswers } from '@/types/onboarding'

type OnboardingRecapProps = {
  answers: OnboardingAnswers
  onEdit: (stepIndex: number) => void
  onFinish: () => void
}

export default function OnboardingRecap({ answers, onEdit, onFinish }: OnboardingRecapProps) {
  const reduceMotion = useReducedMotion()
  const accent = ONBOARDING_ACCENT
  const seances = pickSeances(answers)
  const duree = answers.rythme?.duree ?? 30
  const freq = answers.rythme?.frequence ?? 3

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="pb-2"
    >
      <header className="mb-[26px] text-center">
        <span
          className="mb-3.5 inline-flex size-[54px] items-center justify-center rounded-2xl"
          style={{ background: colorMix(accent, 14), color: accent }}
        >
          <Rocket size={26} strokeWidth={2} aria-hidden />
        </span>
        <h1 className="font-display text-[30px] leading-[1.12] text-ink">Ton plan est prêt.</h1>
        <p className="mx-auto mt-2 max-w-[420px] text-base leading-normal text-ink/58">
          {freq} séance{freq > 1 ? 's' : ''} par semaine, {duree} min chacune. Voilà par où
          commencer.
        </p>
      </header>

      <section className="mb-[26px]">
        <h2 className="mb-3 font-display text-xl text-ink">Ce qu&apos;on a retenu</h2>
        <OnboardingSummaryRows answers={answers} onEditStep={onEdit} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-ink">On commence par</h2>
        <div className="grid gap-3">
          {seances.map((s) => {
            const catColor = CATEGORY_CSS_VAR[s.cat] ?? accent
            return (
              <div
                key={s.name}
                className="flex items-center gap-3.5 rounded-[var(--radius)] border border-border bg-card px-4 py-3.5"
                style={{ borderLeft: `4px solid ${catColor}` }}
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <span className="text-base font-semibold text-ink">{s.name}</span>
                    <span
                      className="rounded-full px-2 py-px text-[11px] font-semibold"
                      style={{ color: catColor, background: colorMix(catColor, 12) }}
                    >
                      {CATEGORY_LABEL[s.cat]}
                    </span>
                  </div>
                  <span className="text-sm text-ink/52">
                    {s.blocks} bloc{s.blocks > 1 ? 's' : ''} · {duree} min environ
                  </span>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-mint">
                  <Play size={14} aria-hidden />
                  Lancer
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <Button type="button" onClick={onFinish} className="mt-[26px] h-[50px] w-full text-base font-semibold">
        Lancer ma première séance
        <ArrowRight size={18} />
      </Button>
      <p className="mt-3 text-center text-xs text-ink/42">
        Tu pourras tout modifier depuis ton profil.
      </p>
    </motion.div>
  )
}
