import { useEffect, useState, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getOnboardingPreferences, needsOnboarding } from '@/lib/onboardingProfile'

type OnboardingGateProps = {
  children: ReactNode
}

/** Redirige les nouveaux utilisateurs vers le parcours d'onboarding. */
export default function OnboardingGate({ children }: OnboardingGateProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [requiresOnboarding, setRequiresOnboarding] = useState(false)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    void getOnboardingPreferences(user.uid)
      .then((prefs) => {
        if (!cancelled) setRequiresOnboarding(needsOnboarding(prefs))
      })
      .catch((err) => {
        console.error('[OnboardingGate] Failed to load onboarding status', err)
        if (!cancelled) setRequiresOnboarding(false)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-mint" />
      </div>
    )
  }

  if (requiresOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}
