import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { UserEquipmentItem } from './equipment'

export interface UserEquipmentDoc {
  items: UserEquipmentItem[]
  updatedAt: string
}

export function equipmentDocRef(uid: string) {
  return doc(db, 'users', uid, 'preferences', 'equipment')
}

export async function getUserEquipment(uid: string): Promise<UserEquipmentItem[]> {
  const snap = await getDoc(equipmentDocRef(uid))
  if (!snap.exists()) return []
  const data = snap.data() as UserEquipmentDoc
  return Array.isArray(data.items) ? data.items : []
}

export async function saveUserEquipment(
  uid: string,
  items: UserEquipmentItem[],
): Promise<void> {
  await setDoc(
    equipmentDocRef(uid),
    { items, updatedAt: new Date().toISOString() } satisfies UserEquipmentDoc,
    { merge: true },
  )
}
