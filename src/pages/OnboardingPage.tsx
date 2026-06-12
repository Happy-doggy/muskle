import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MuskleLogo from '@/components/ui/MuskleLogo'
import OnboardingProgressDots from '@/components/onboarding/OnboardingProgressDots'
import OnboardingRecap from '@/components/onboarding/OnboardingRecap'
import OnboardingStepView from '@/components/onboarding/OnboardingStepView'
import OnboardingWelcome from '@/components/onboarding/OnboardingWelcome'
import { ONBOARDING_STEPS } from '@/data/onboarding'
import { useAuth } from '@/hooks/useAuth'
import { completeOnboarding } from '@/lib/onboardingProfile'
import { toast } from '@/lib/toast'
import { useOnboardingStore } from '@/store/onboarding'
import type { OnboardingAnswers } from '@/types/onboarding'

const STICKY_BAR =
  'sticky z-30 border-border bg-[color-mix(in_srgb,var(--background)_92%,transparent)] backdrop-blur-[8px]'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const scrollRef = useRef<HTMLElement>(null)
  const [finishing, setFinishing] = useState(false)

  const phase = useOnboardingStore((s) => s.phase)
  const answers = useOnboardingStore((s) => s.answers)
  const setPhase = useOnboardingStore((s) => s.setPhase)
  const setAnswer = useOnboardingStore((s) => s.setAnswer)
  const next = useOnboardingStore((s) => s.next)
  const back = useOnboardingStore((s) => s.back)
  const goTo = useOnboardingStore((s) => s.goTo)
  const getCurrentStep = useOnboardingStore((s) => s.getCurrentStep)
  const getStepIndex = useOnboardingStore((s) => s.getStepIndex)
  const isCurrentStepValid = useOnboardingStore((s) => s.isCurrentStepValid)
  const getFooterHint = useOnboardingStore((s) => s.getFooterHint)
  const getFooterCtaLabel = useOnboardingStore((s) => s.getFooterCtaLabel)

  const stepIndex = getStepIndex()
  const step = getCurrentStep()
  const isValid = isCurrentStepValid()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [phase])

  const finish = useCallback(
    async (outcome: 'done' | 'skipped') => {
      if (!user || finishing) return
      setFinishing(true)
      try {
        await completeOnboarding(user.uid, answers, outcome)
        useOnboardingStore.persist.clearStorage()
        useOnboardingStore.getState().reset()
        if (outcome === 'done') {
          toast.success('Ton plan est prêt !')
        }
        navigate('/sessions', { replace: true })
      } catch (err) {
        console.error('[OnboardingPage] Failed to save onboarding', err)
        toast.error('Impossible d’enregistrer. Réessaie.')
        setFinishing(false)
      }
    },
    [user, answers, navigate, finishing],
  )

  const handleSetValue = useCallback(
    (updater: unknown) => {
      if (!step) return
      if (step.kind === 'rythme') {
        setAnswer('rythme', (prev) => {
          const nextVal = (
            updater as (
              p: OnboardingAnswers['rythme'] | undefined,
            ) => Partial<NonNullable<OnboardingAnswers['rythme']>>
          )(prev)
          return { ...prev, ...nextVal } as OnboardingAnswers['rythme']
        })
        return
      }
      const key = step.id as keyof OnboardingAnswers
      if (typeof updater === 'function') {
        setAnswer(key, updater as (prev: OnboardingAnswers[typeof key]) => OnboardingAnswers[typeof key])
      } else {
        setAnswer(key, updater as OnboardingAnswers[typeof key])
      }
    },
    [step, setAnswer],
  )

  const showBar = typeof phase === 'number' || phase === 'recap'
  const showSkipLink = typeof phase === 'number' && step?.optional
  const stepValue = step ? answers[step.id as keyof OnboardingAnswers] : undefined

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {showBar && (
        <header
          className={`${STICKY_BAR} top-0 flex h-[60px] shrink-0 items-center gap-3.5 border-b px-4`}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={back}
            aria-label="Retour"
            className="size-10 shrink-0 rounded-full text-ink"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="mx-auto w-full max-w-[360px] flex-1">
            {typeof phase === 'number' && stepIndex != null ? (
              <OnboardingProgressDots current={stepIndex} total={ONBOARDING_STEPS.length} />
            ) : (
              <MuskleLogo className="mx-auto block h-[22px] w-auto text-ink" />
            )}
          </div>
          <div className="flex w-16 shrink-0 justify-end">
            {showSkipLink && (
              <Button
                type="button"
                variant="ghost"
                onClick={next}
                className="px-1.5 text-sm font-semibold text-ink/50 hover:text-ink/70"
              >
                Passer
              </Button>
            )}
          </div>
        </header>
      )}

      <main ref={scrollRef} className="flex flex-1 flex-col overflow-y-auto">
        <div
          className={`mx-auto flex w-full max-w-[600px] flex-1 flex-col px-5 pb-6 pt-8 ${
            phase === 'welcome' ? 'justify-center' : 'justify-start'
          }`}
        >
          {phase === 'welcome' && (
            <OnboardingWelcome onStart={() => setPhase(0)} onSkip={() => void finish('skipped')} />
          )}
          {typeof phase === 'number' && step && (
            <OnboardingStepView step={step} value={stepValue} onChange={handleSetValue} />
          )}
          {phase === 'recap' && (
            <OnboardingRecap
              answers={answers}
              onEdit={goTo}
              onFinish={() => void finish('done')}
            />
          )}
        </div>
      </main>

      {typeof phase === 'number' && (
        <footer className={`${STICKY_BAR} bottom-0 shrink-0 border-t px-5 py-3.5`}>
          <div className="mx-auto flex w-full max-w-[600px] items-center gap-3">
            <span className="flex-1 text-sm text-ink/42">{getFooterHint()}</span>
            <Button
              type="button"
              onClick={next}
              disabled={!isValid}
              className="h-12 shrink-0 px-6 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {getFooterCtaLabel()}
              <ArrowRight size={18} />
            </Button>
          </div>
        </footer>
      )}

      {finishing && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-background/60">
          <Loader2 className="size-8 animate-spin text-mint" />
        </div>
      )}
    </div>
  )
}
