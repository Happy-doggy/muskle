import { useNavigate } from 'react-router-dom'
import { Target } from 'lucide-react'
import OnboardingSummaryRows from './onboarding/OnboardingSummaryRows'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { DEFAULT_ONBOARDING_ANSWERS, ONBOARDING_STEPS } from '@/data/onboarding'
import { useOnboardingPreferences } from '@/hooks/useOnboardingPreferences'
import { hasOnboardingAnswers } from '@/lib/onboardingUtils'

export default function UserOnboardingPreferencesSection() {
  const navigate = useNavigate()
  const { answers, loading, isSkipped } = useOnboardingPreferences()

  const resolvedAnswers = answers ?? DEFAULT_ONBOARDING_ANSWERS
  const hasData = answers != null && hasOnboardingAnswers(resolvedAnswers)

  const goToStepEdit = (stepIndex: number) => {
    const step = ONBOARDING_STEPS[stepIndex]
    if (step) navigate(`/account/sport-profile/${step.id}`)
  }

  const freq = resolvedAnswers.rythme?.frequence
  const duree = resolvedAnswers.rythme?.duree

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-xl flex items-center gap-2">
          <Target size={20} className="text-mint" />
          Mon profil sportif
        </CardTitle>
        <CardDescription>
          {hasData && freq && duree
            ? `${freq} séance${freq > 1 ? 's' : ''} par semaine · ${duree} min par séance`
            : 'Objectifs, disciplines, rythme et contraintes pour personnaliser tes séances.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : hasData ? (
          <OnboardingSummaryRows answers={resolvedAnswers} onEditStep={goToStepEdit} />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {isSkipped
                ? 'Tu as passé la personnalisation. Tu peux la compléter quand tu veux pour des séances mieux adaptées.'
                : 'Tu n’as pas encore renseigné tes préférences d’entraînement.'}
            </p>
            <Button type="button" className="w-full" onClick={() => navigate('/onboarding')}>
              Personnaliser mon profil
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
