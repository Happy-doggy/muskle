import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ONBOARDING_STEPS, DEFAULT_ONBOARDING_ANSWERS, ONBOARDING_STORAGE_KEY } from '../data/onboarding'
import type { OnboardingAnswers, OnboardingPhase, OnboardingStep } from '../types/onboarding'
import {
  footerCtaLabel,
  footerHint,
  isStepValid,
  stepHasSelection,
} from '../lib/onboardingUtils'


interface OnboardingStore {
  phase: OnboardingPhase
  answers: OnboardingAnswers

  setPhase: (phase: OnboardingPhase) => void
  setAnswer: <K extends keyof OnboardingAnswers>(
    key: K,
    value: OnboardingAnswers[K] | ((prev: OnboardingAnswers[K]) => OnboardingAnswers[K]),
  ) => void
  next: () => void
  back: () => void
  goTo: (stepIndex: number) => void
  reset: () => void
  hydrateFromProfile: (answers: OnboardingAnswers) => void

  getCurrentStep: () => OnboardingStep | null
  getStepIndex: () => number | null
  isCurrentStepValid: () => boolean
  currentHasSelection: () => boolean
  getFooterHint: () => string
  getFooterCtaLabel: () => string
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      phase: 'welcome',
      answers: { ...DEFAULT_ONBOARDING_ANSWERS },

      setPhase: (phase) => set({ phase }),

      setAnswer: (key, value) =>
        set((s) => ({
          answers: {
            ...s.answers,
            [key]:
              typeof value === 'function'
                ? (value as (prev: unknown) => unknown)(s.answers[key])
                : value,
          },
        })),

      next: () => {
        const { phase } = get()
        if (typeof phase === 'number') {
          if (phase < ONBOARDING_STEPS.length - 1) set({ phase: phase + 1 })
          else set({ phase: 'recap' })
        }
      },

      back: () => {
        const { phase } = get()
        if (phase === 'recap') set({ phase: ONBOARDING_STEPS.length - 1 })
        else if (typeof phase === 'number') {
          set({ phase: phase === 0 ? 'welcome' : phase - 1 })
        }
      },

      goTo: (stepIndex) => set({ phase: stepIndex }),

      reset: () =>
        set({
          phase: 'welcome',
          answers: { ...DEFAULT_ONBOARDING_ANSWERS },
        }),

      hydrateFromProfile: (answers) => set({ answers }),

      getCurrentStep: () => {
        const idx = get().getStepIndex()
        return idx != null ? ONBOARDING_STEPS[idx] : null
      },

      getStepIndex: () => {
        const { phase } = get()
        return typeof phase === 'number' ? phase : null
      },

      isCurrentStepValid: () => {
        const step = get().getCurrentStep()
        const idx = get().getStepIndex()
        if (!step || idx == null) return true
        const value = get().answers[step.id as keyof OnboardingAnswers]
        return isStepValid(step, value)
      },

      currentHasSelection: () => {
        const step = get().getCurrentStep()
        if (!step) return false
        const value = get().answers[step.id as keyof OnboardingAnswers]
        return stepHasSelection(step, value)
      },

      getFooterHint: () => {
        const step = get().getCurrentStep()
        return step ? footerHint(step) : ''
      },

      getFooterCtaLabel: () => {
        const step = get().getCurrentStep()
        const idx = get().getStepIndex()
        if (!step || idx == null) return 'Continuer'
        return footerCtaLabel(step, idx, ONBOARDING_STEPS.length, get().currentHasSelection())
      },
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      partialize: (s) => ({ phase: s.phase, answers: s.answers }),
    },
  ),
)
