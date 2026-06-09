import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import {
  getUserProfile,
  resolveDisplayProfile,
  updateMagicLinkFirstName,
  type UserProfile,
} from '../lib/userProfile'

export function useUserProfile() {
  const { user } = useAuth()
  const [stored, setStored] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setStored(null)
      return
    }
    let cancelled = false
    setLoading(true)
    void getUserProfile(user.uid)
      .then((profile) => {
        if (!cancelled) setStored(profile)
      })
      .catch((err) => {
        console.error('[useUserProfile] Failed to load profile', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const display = user ? resolveDisplayProfile(user, stored) : null

  const saveFirstName = useCallback(
    async (firstName: string) => {
      if (!user || !display?.canEditName) return
      await updateMagicLinkFirstName(firstName)
      const profile = await getUserProfile(user.uid)
      setStored(profile)
    },
    [user, display?.canEditName],
  )

  return { user, display, stored, loading, saveFirstName }
}
