import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import type { UserEquipmentItem } from '../lib/equipment'
import { getUserEquipment, saveUserEquipment } from '../lib/userEquipment'

export function useUserEquipment() {
  const { user } = useAuth()
  const [items, setItems] = useState<UserEquipmentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }
    let cancelled = false
    setLoading(true)
    void getUserEquipment(user.uid)
      .then((data) => {
        if (!cancelled) setItems(data)
      })
      .catch((err) => {
        console.error('[useUserEquipment] Failed to load equipment', err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const persist = useCallback(
    async (next: UserEquipmentItem[]) => {
      if (!user) return
      setSaving(true)
      try {
        await saveUserEquipment(user.uid, next)
        setItems(next)
      } finally {
        setSaving(false)
      }
    },
    [user],
  )

  const addItem = useCallback(
    async (item: UserEquipmentItem) => {
      await persist([...items, item])
    },
    [items, persist],
  )

  const removeItem = useCallback(
    async (id: string) => {
      await persist(items.filter((item) => item.id !== id))
    },
    [items, persist],
  )

  return { items, loading, saving, addItem, removeItem }
}
