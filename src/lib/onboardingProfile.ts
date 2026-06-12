import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import type { OnboardingAnswers, OnboardingPreferencesDoc } from '../types/onboarding'
import { DEFAULT_ONBOARDING_ANSWERS } from '../data/onboarding'

export function onboardingDocRef(uid: string) {
  return doc(db, 'users', uid, 'preferences', 'onboarding')
}

export async function getOnboardingPreferences(
  uid: string,
): Promise<OnboardingPreferencesDoc | null> {
  const snap = await getDoc(onboardingDocRef(uid))
  if (!snap.exists()) return null
  return snap.data() as OnboardingPreferencesDoc
}

export function needsOnboarding(prefs: OnboardingPreferencesDoc | null): boolean {
  if (!prefs) return true
  return !prefs.onboardingCompleted && !prefs.onboardingSkipped
}

export async function saveOnboardingPreferences(
  uid: string,
  data: Pick<OnboardingPreferencesDoc, 'answers' | 'onboardingCompleted' | 'onboardingSkipped'>,
): Promise<void> {
  await setDoc(
    onboardingDocRef(uid),
    {
      ...data,
      updatedAt: new Date().toISOString(),
    } satisfies OnboardingPreferencesDoc,
    { merge: true },
  )
}

export async function completeOnboarding(
  uid: string,
  answers: OnboardingAnswers,
  outcome: 'done' | 'skipped',
): Promise<void> {
  await saveOnboardingPreferences(uid, {
    answers: outcome === 'skipped' ? DEFAULT_ONBOARDING_ANSWERS : answers,
    onboardingCompleted: outcome === 'done',
    onboardingSkipped: outcome === 'skipped',
  })
}
