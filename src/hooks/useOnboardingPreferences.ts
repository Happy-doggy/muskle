import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import {
  getOnboardingPreferences,
  saveOnboardingPreferences,
} from '@/lib/onboardingProfile'
import type { OnboardingAnswers, OnboardingPreferencesDoc } from '@/types/onboarding'

export function useOnboardingPreferences() {
  const { user } = useAuth()
  const [prefs, setPrefs] = useState<OnboardingPreferencesDoc | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(async () => {
    if (!user) {
      setPrefs(null)
      return
    }
    setLoading(true)
    try {
      const data = await getOnboardingPreferences(user.uid)
      setPrefs(data)
    } catch (err) {
      console.error('[useOnboardingPreferences] Failed to load', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void reload()
  }, [reload])

  const saveAnswers = useCallback(
    async (answers: OnboardingAnswers) => {
      if (!user) return
      setSaving(true)
      try {
        await saveOnboardingPreferences(user.uid, {
          answers,
          onboardingCompleted: true,
          onboardingSkipped: false,
        })
        const updated = await getOnboardingPreferences(user.uid)
        setPrefs(updated)
      } catch (err) {
        throw err
      } finally {
        setSaving(false)
      }
    },
    [user],
  )

  return {
    prefs,
    answers: prefs?.answers ?? null,
    loading,
    saving,
    reload,
    saveAnswers,
    isCompleted: prefs?.onboardingCompleted ?? false,
    isSkipped: prefs?.onboardingSkipped ?? false,
  }
}
