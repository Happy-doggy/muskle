import type {
  MultiWithNone,
  OnboardingAnswers,
  OnboardingRythme,
  OnboardingSeanceCandidate,
  OnboardingStep,
} from '../types/onboarding'
import { ONBOARDING_SEANCE_POOL } from '../data/onboarding'

export function colorMix(color: string, pct: number): string {
  return `color-mix(in srgb, ${color} ${pct}%, white)`
}

export function toggleInArray<T>(arr: T[] | undefined, value: T): T[] {
  const a = Array.isArray(arr) ? arr.filter((x) => x !== ('__none' as unknown as T)) : []
  return a.includes(value) ? a.filter((x) => x !== value) : [...a, value]
}

export function emptyContraintes(): MultiWithNone<never> {
  const arr = [] as MultiWithNone<never>
  arr.__none = true
  return arr
}

export function hasOnboardingAnswers(answers: OnboardingAnswers): boolean {
  return Boolean(
    answers.objectif ||
      answers.disciplines.length > 0 ||
      answers.sport.length > 0 ||
      answers.niveau ||
      answers.zones.length > 0 ||
      answers.materiel.length > 0 ||
      answers.rythme?.frequence ||
      answers.rythme?.duree ||
      (answers.contraintes.length > 0 && !answers.contraintes.__none),
  )
}

export function isStepValid(step: OnboardingStep, value: unknown): boolean {
  if (step.optional) return true
  if (step.kind === 'rythme') {
    const v = value as OnboardingRythme | undefined
    return Boolean(v?.frequence && v?.duree)
  }
  if (step.kind === 'multi') {
    const arr = value as unknown[] | undefined
    return Boolean(arr && arr.length > 0)
  }
  return value != null
}

export function stepHasSelection(step: OnboardingStep, value: unknown): boolean {
  if (step.kind === 'rythme') {
    const v = value as OnboardingRythme | undefined
    return Boolean(v?.frequence || v?.duree)
  }
  if (step.kind === 'multi') {
    const arr = value as MultiWithNone<string> | undefined
    return Boolean(arr && (arr.length > 0 || arr.__none))
  }
  return value != null
}

export function footerHint(step: OnboardingStep): string {
  if (step.kind === 'multi' && !step.optional) return 'Choisis au moins une option'
  if (step.optional) return 'Optionnel'
  return ''
}

export function footerCtaLabel(
  step: OnboardingStep,
  stepIndex: number,
  totalSteps: number,
  hasSelection: boolean,
): string {
  if (step.optional && !hasSelection) return 'Passer'
  if (stepIndex === totalSteps - 1) return 'Voir mon plan'
  return 'Continuer'
}

export function labelsForStep(step: OnboardingStep, value: unknown): string[] {
  if (value === undefined || value === null) return []
  if (step.kind === 'rythme') {
    const v = value as OnboardingRythme
    const out: string[] = []
    if (v.frequence) out.push(`${v.frequence}${v.frequence === 5 ? '+' : ''} / sem.`)
    if (v.duree) out.push(`${v.duree} min`)
    return out
  }
  if (step.kind === 'multi' || step.kind === 'single') {
    const find = (v: string) => step.options.find((o) => o.value === v)?.label ?? v
    if (step.kind === 'multi') {
      const arr = value as MultiWithNone<string>
      if (step.hasNone && arr?.__none) return ['Aucune']
      return (arr ?? []).filter((x) => x !== '__none').map(find)
    }
    return [find(value as string)]
  }
  return []
}

export function pickSeances(answers: OnboardingAnswers): OnboardingSeanceCandidate[] {
  const { objectif: obj, disciplines: disc = [], sport = [], zones = [], niveau: lvl } = answers
  const scored = ONBOARDING_SEANCE_POOL.map((s) => {
    let sc = 0
    const su = s.suits
    if (su.obj && obj && su.obj.includes(obj)) sc += 3
    if (su.disc && su.disc.some((d) => disc.includes(d))) sc += 3
    if (su.sport && su.sport.some((d) => sport.includes(d))) sc += 5
    if (su.zones && su.zones.some((d) => zones.includes(d))) sc += 1
    if (su.lvl && lvl && su.lvl.includes(lvl)) sc += 1
    return { s, sc }
  }).sort((a, b) => b.sc - a.sc)
  return scored.slice(0, 3).map((x) => x.s)
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return n <= 1 ? `${n} ${singular}` : `${n} ${plural ?? `${singular}s`}`
}
