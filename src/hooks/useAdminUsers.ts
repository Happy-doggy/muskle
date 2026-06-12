import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import type { Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface AdminUser {
  id: string
  email: string
  displayName: string
  createdAt: Timestamp
  lastLoginAt: Timestamp
  sessionCount: number
  completedWorkouts: number
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchUsers() {
      setLoading(true)
      setError(null)
      try {
        const snap = await getDocs(collection(db, 'users'))
        if (cancelled) return
        const list = snap.docs
          .filter((d) => {
            const data = d.data()
            return typeof data.email === 'string' || typeof data.sessionCount === 'number'
          })
          .map((d) => {
            const data = d.data()
            return {
              id: d.id,
              email: (data.email as string) ?? '',
              displayName: (data.displayName as string) ?? '',
              createdAt: data.createdAt as Timestamp,
              lastLoginAt: data.lastLoginAt as Timestamp,
              sessionCount: (data.sessionCount as number) ?? 0,
              completedWorkouts: (data.completedWorkouts as number) ?? 0,
            }
          })
        setUsers(list)
      } catch (err) {
        if (!cancelled) {
          console.error('[useAdminUsers] Failed to fetch users', err)
          setError('Impossible de charger les utilisateurs.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchUsers()
    return () => {
      cancelled = true
    }
  }, [])

  return { users, loading, error }
}
