import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Loader2 } from 'lucide-react'
import OnboardingStepView from '@/components/onboarding/OnboardingStepView'
import { Button } from '@/components/ui/button'
import {
  DEFAULT_ONBOARDING_ANSWERS,
  getOnboardingStepById,
  isSportProfileStepId,
} from '@/data/onboarding'
import { useOnboardingPreferences } from '@/hooks/useOnboardingPreferences'
import { footerHint, isStepValid } from '@/lib/onboardingUtils'
import { toast } from '@/lib/toast'
import type { OnboardingAnswers } from '@/types/onboarding'

export default function SportProfileStepEditPage() {
  const { stepId = '' } = useParams()
  const navigate = useNavigate()
  const step = getOnboardingStepById(stepId)
  const { answers, loading, saving, saveAnswers } = useOnboardingPreferences()
  const [draftValue, setDraftValue] = useState<unknown>(undefined)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (loading || !step) return
    const base = answers ?? DEFAULT_ONBOARDING_ANSWERS
    setDraftValue(base[step.id as keyof OnboardingAnswers])
    setInitialized(true)
  }, [loading, answers, step])

  const handleSetValue = useCallback(
    (updater: unknown) => {
      if (!step) return
      if (step.kind === 'rythme') {
        setDraftValue((prev: unknown) => {
          const nextVal = (
            updater as (
              p: OnboardingAnswers['rythme'] | undefined,
            ) => Partial<NonNullable<OnboardingAnswers['rythme']>>
          )(prev as OnboardingAnswers['rythme'] | undefined)
          return { ...(prev as object), ...nextVal }
        })
        return
      }
      if (typeof updater === 'function') {
        setDraftValue((prev: unknown) => (updater as (p: unknown) => unknown)(prev))
      } else {
        setDraftValue(updater)
      }
    },
    [step],
  )

  const handleSave = async () => {
    if (!step || !isStepValid(step, draftValue)) return
    const base = answers ?? DEFAULT_ONBOARDING_ANSWERS
    const updated: OnboardingAnswers = {
      ...base,
      [step.id]: draftValue as OnboardingAnswers[keyof OnboardingAnswers],
    }
    try {
      await saveAnswers(updated)
      toast.success('Profil sportif mis à jour')
      navigate('/account')
    } catch (err) {
      console.error('[SportProfileStepEditPage] Failed to save', err)
      toast.error('Impossible d’enregistrer. Réessaie.')
    }
  }

  if (!isSportProfileStepId(stepId) || !step) {
    return <Navigate to="/account" replace />
  }

  if (loading || !initialized) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-8 animate-spin text-mint" />
      </div>
    )
  }

  const valid = isStepValid(step, draftValue)
  const hint = footerHint(step)

  return (
    <div className="mx-auto max-w-[600px] space-y-6 pb-8">
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate('/account')}
        className="-ml-2 text-ink/70 hover:text-ink"
      >
        <ChevronLeft size={18} />
        Mon compte
      </Button>

      <OnboardingStepView step={step} value={draftValue} onChange={handleSetValue} />

      <div className="flex items-center gap-3 border-t border-border pt-5">
        {hint ? <span className="flex-1 text-sm text-ink/42">{hint}</span> : <span className="flex-1" />}
        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={!valid || saving}
          className="h-12 shrink-0 px-6 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </div>
  )
}
