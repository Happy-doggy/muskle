import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getOnboardingPreferences, needsOnboarding } from '@/lib/onboardingProfile'

/** Redirige vers l'app si l'onboarding est déjà terminé ou passé. */
export default function OnboardingRedirectIfDone() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    let cancelled = false
    void getOnboardingPreferences(user.uid)
      .then((prefs) => {
        if (!cancelled) setDone(!needsOnboarding(prefs))
      })
      .catch(() => {
        if (!cancelled) setDone(false)
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

  if (done) {
    return <Navigate to="/sessions" replace />
  }

  return null
}
