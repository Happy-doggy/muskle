import { doc, getDoc, setDoc } from 'firebase/firestore'
import { updateProfile, type User } from 'firebase/auth'
import { auth, db } from './firebase'

export const MAGIC_LINK_PLACEHOLDER_FIRST_NAME = 'Sportif'

export interface UserProfile {
  firstName?: string
  updatedAt: string
}

export function isGoogleUser(user: User): boolean {
  return user.providerData.some((p) => p.providerId === 'google.com')
}

export function firstNameFromDisplayName(displayName: string | null | undefined): string {
  if (!displayName?.trim()) return ''
  return displayName.trim().split(/\s+/)[0] ?? ''
}

export function profileDocRef(uid: string) {
  return doc(db, 'users', uid, 'meta', 'profile')
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(profileDocRef(uid))
  if (!snap.exists()) return null
  return snap.data() as UserProfile
}

export async function saveUserProfile(uid: string, data: Pick<UserProfile, 'firstName'>): Promise<void> {
  await setDoc(
    profileDocRef(uid),
    { ...data, updatedAt: new Date().toISOString() },
    { merge: true },
  )
}

export async function updateMagicLinkFirstName(firstName: string): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error('[profile] User not authenticated')
  const trimmed = firstName.trim()
  if (!trimmed) throw new Error('[profile] First name is required')
  await saveUserProfile(user.uid, { firstName: trimmed })
  await updateProfile(user, { displayName: trimmed })
}

export function resolveDisplayProfile(
  user: User,
  stored: UserProfile | null,
): { firstName: string; photoUrl: string | null; isGoogle: boolean; canEditName: boolean } {
  const google = isGoogleUser(user)

  if (google) {
    return {
      firstName: firstNameFromDisplayName(user.displayName) || 'Utilisateur',
      photoUrl: user.photoURL,
      isGoogle: true,
      canEditName: false,
    }
  }

  const firstName =
    stored?.firstName?.trim() ||
    firstNameFromDisplayName(user.displayName) ||
    MAGIC_LINK_PLACEHOLDER_FIRST_NAME

  return {
    firstName,
    photoUrl: null,
    isGoogle: false,
    canEditName: true,
  }
}
