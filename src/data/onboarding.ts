import type {
  OnboardingAnswers,
  OnboardingSeanceCandidate,
  OnboardingStep,
} from '../types/onboarding'

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'objectif',
    kind: 'single',
    display: 'cards',
    eyebrow: 'Objectif',
    title: 'Ton objectif numéro 1 ?',
    help: 'Choisis ta priorité — on construit le plan autour.',
    options: [
      { value: 'force', label: 'Gagner en force', desc: 'Soulever plus lourd, progresser', icon: 'dumbbell' },
      { value: 'muscle', label: 'Prendre du muscle', desc: 'Volume et tonicité', icon: 'trending-up' },
      { value: 'cardio', label: 'Améliorer le cardio', desc: 'Souffle, endurance, cœur', icon: 'heart-pulse' },
      { value: 'mobilite', label: 'Gagner en mobilité', desc: 'Souplesse et amplitude', icon: 'move' },
      { value: 'gainage', label: 'Renforcer les abdos', desc: 'Gainage et sangle abdominale', icon: 'shield' },
      { value: 'forme', label: 'Me sentir en forme', desc: "De l'énergie au quotidien", icon: 'sparkles' },
    ],
  },
  {
    id: 'disciplines',
    kind: 'multi',
    display: 'cards',
    eyebrow: 'Disciplines',
    title: 'Tes disciplines de prédilection',
    help: 'Coche tout ce qui te parle — on mélangera pour toi.',
    options: [
      { value: 'musculation', label: 'Musculation', desc: 'Charges, séries, hypertrophie', icon: 'dumbbell', cat: 'musculation' },
      { value: 'renforcement', label: 'Renforcement', desc: 'Poids du corps, fonctionnel', icon: 'activity', cat: 'renforcement' },
      { value: 'cardio', label: 'Cardio', desc: 'HIIT, circuits, endurance', icon: 'heart-pulse', cat: 'cardio' },
      { value: 'mobilite', label: 'Mobilité', desc: 'Amplitude, étirements actifs', icon: 'move', cat: 'mobilite' },
      { value: 'yoga', label: 'Yoga', desc: 'Respiration, postures, flow', icon: 'leaf', cat: 'yoga' },
      { value: 'kine', label: 'Kiné / rééduc', desc: 'Réathlétisation, prévention', icon: 'stethoscope', cat: 'kine' },
    ],
  },
  {
    id: 'sport',
    kind: 'multi',
    display: 'cards',
    optional: true,
    eyebrow: 'Ton sport',
    title: 'Quel sport veux-tu booster ?',
    help: 'On préparera ton corps pour la discipline. Optionnel.',
    options: [
      { value: 'running', label: 'Running', desc: 'Foulée, explosivité, prévention', icon: 'footprints' },
      { value: 'velo', label: 'Vélo', desc: 'Cuisses, gainage, posture', icon: 'bike' },
      { value: 'natation', label: 'Natation', desc: 'Épaules, dos, souplesse', icon: 'waves' },
      { value: 'rando', label: 'Randonnée', desc: 'Endurance, chevilles, genoux', icon: 'mountain' },
      { value: 'raquettes', label: 'Tennis / padel', desc: 'Rotations, appuis, épaules', icon: 'circle-dot' },
      { value: 'collectif', label: 'Sport collectif', desc: 'Sprints, sauts, changements', icon: 'users' },
    ],
  },
  {
    id: 'niveau',
    kind: 'single',
    display: 'cards',
    eyebrow: 'Niveau',
    title: 'Ton niveau actuel',
    help: 'Sois honnête — on ajustera la difficulté pour toi.',
    options: [
      { value: 'debutant', label: 'Débutant', desc: 'Je démarre ou je reprends', icon: 'sprout' },
      { value: 'intermediaire', label: 'Intermédiaire', desc: "Je m'entraîne de temps en temps", icon: 'activity' },
      { value: 'confirme', label: 'Confirmé', desc: "Je m'entraîne régulièrement", icon: 'flame' },
      { value: 'expert', label: 'Expert', desc: "L'entraînement rythme ma vie", icon: 'award' },
    ],
  },
  {
    id: 'zones',
    kind: 'multi',
    display: 'chips',
    optional: true,
    eyebrow: 'Zones',
    title: 'On cible quoi en priorité ?',
    help: 'Sélectionne tes zones focus, ou rien pour du full-body.',
    options: [
      { value: 'jambes', label: 'Cuisses & fessiers' },
      { value: 'ischio', label: 'Ischio-jambiers' },
      { value: 'mollets', label: 'Mollets' },
      { value: 'abdos', label: 'Abdos & gainage' },
      { value: 'dos', label: 'Dos' },
      { value: 'pecs', label: 'Pectoraux' },
      { value: 'epaules', label: 'Épaules' },
      { value: 'bras', label: 'Bras' },
    ],
  },
  {
    id: 'materiel',
    kind: 'multi',
    display: 'cards',
    eyebrow: 'Matériel',
    title: 'Ton matériel sous la main',
    help: "Sélectionne ce que tu as — on s'adapte au reste.",
    options: [
      { value: 'poids-corps', label: 'Poids du corps', desc: 'Aucun matériel requis', icon: 'user' },
      { value: 'tapis', label: 'Tapis', desc: 'Sol, gainage, mobilité', icon: 'square' },
      { value: 'halteres', label: 'Haltères', desc: 'Charges libres', icon: 'dumbbell' },
      { value: 'elastiques', label: 'Élastiques', desc: 'Bandes de résistance', icon: 'cable' },
      { value: 'kettlebell', label: 'Kettlebell', desc: 'Swings, balistique', icon: 'bell' },
      { value: 'barre', label: 'Barre & poids', desc: 'Squat, soulevé, développé', icon: 'weight' },
      { value: 'banc', label: 'Banc', desc: 'Développé, step, dips', icon: 'rectangle-horizontal' },
      { value: 'trx', label: 'Sangles TRX', desc: 'Suspension, gainage', icon: 'link' },
    ],
  },
  {
    id: 'rythme',
    kind: 'rythme',
    eyebrow: 'Rythme',
    title: "À quelle fréquence on s'entraîne ?",
    help: 'On planifie un volume réaliste — tenable sur la durée.',
    frequence: {
      label: 'Séances par semaine',
      options: [
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5+' },
      ],
    },
    duree: {
      label: 'Durée par séance',
      options: [
        { value: 15, label: '15 min', desc: 'Express' },
        { value: 30, label: '30 min', desc: 'Efficace' },
        { value: 45, label: '45 min', desc: 'Complet' },
        { value: 60, label: '60 min', desc: 'Costaud' },
      ],
    },
  },
  {
    id: 'contraintes',
    kind: 'multi',
    display: 'chips',
    optional: true,
    hasNone: true,
    eyebrow: 'Contraintes',
    title: 'On ménage quelque chose ?',
    help: 'Dis-nous où tu es fragile — on adapte les mouvements. Optionnel.',
    options: [
      { value: 'genoux', label: 'Genoux' },
      { value: 'dos', label: 'Dos / lombaires' },
      { value: 'epaules', label: 'Épaules' },
      { value: 'poignets', label: 'Poignets' },
      { value: 'chevilles', label: 'Chevilles' },
      { value: 'nuque', label: 'Nuque' },
    ],
  },
]

export const ONBOARDING_SEANCE_POOL: OnboardingSeanceCandidate[] = [
  { name: 'Full body débutant', cat: 'renforcement', blocks: 3, suits: { obj: ['forme', 'muscle', 'force'], lvl: ['debutant', 'intermediaire'] } },
  { name: 'Force — bas du corps', cat: 'musculation', blocks: 4, suits: { obj: ['force', 'muscle'], zones: ['jambes', 'ischio', 'mollets'] } },
  { name: 'Haut du corps & gainage', cat: 'musculation', blocks: 4, suits: { obj: ['force', 'muscle'], zones: ['pecs', 'dos', 'epaules', 'bras'] } },
  { name: 'HIIT cardio express', cat: 'cardio', blocks: 3, suits: { obj: ['cardio', 'forme'], disc: ['cardio'] } },
  { name: 'Gainage & sangle abdo', cat: 'renforcement', blocks: 3, suits: { obj: ['gainage', 'forme'], zones: ['abdos'] } },
  { name: 'Mobilité matinale', cat: 'mobilite', blocks: 3, suits: { obj: ['mobilite', 'forme'], disc: ['mobilite'] } },
  { name: 'Flow yoga doux', cat: 'yoga', blocks: 4, suits: { obj: ['mobilite', 'forme'], disc: ['yoga'] } },
  { name: 'Prépa running', cat: 'renforcement', blocks: 4, suits: { sport: ['running'] } },
  { name: 'Renfort cycliste', cat: 'musculation', blocks: 3, suits: { sport: ['velo'] } },
  { name: 'Épaules & dos nageur', cat: 'kine', blocks: 3, suits: { sport: ['natation'] } },
  { name: 'Réveil articulaire kiné', cat: 'kine', blocks: 3, suits: { obj: ['mobilite'], disc: ['kine'] } },
  { name: 'Cardio doux & récup', cat: 'cardio', blocks: 3, suits: { lvl: ['debutant'], obj: ['forme'] } },
]

export const DEFAULT_ONBOARDING_ANSWERS: OnboardingAnswers = {
  disciplines: [],
  sport: [],
  zones: [],
  materiel: [],
  contraintes: [] as OnboardingAnswers['contraintes'],
}

export const ONBOARDING_STORAGE_KEY = 'muskle-ob-state-v1'

export const ONBOARDING_ACCENT = '#4BA278'

export const CATEGORY_CSS_VAR: Record<string, string> = {
  musculation: 'var(--cat-musculation)',
  renforcement: 'var(--cat-renforcement)',
  yoga: 'var(--cat-yoga)',
  kine: 'var(--cat-kine)',
  cardio: 'var(--cat-cardio)',
  mobilite: 'var(--cat-mobilite)',
  autre: 'var(--cat-autre)',
}

export const CATEGORY_LABEL: Record<string, string> = {
  musculation: 'Musculation',
  renforcement: 'Renforcement',
  yoga: 'Yoga',
  kine: 'Kiné',
  cardio: 'Cardio',
  mobilite: 'Mobilité',
  autre: 'Autre',
}

export type SportProfileStepId = (typeof ONBOARDING_STEPS)[number]['id']

export function getOnboardingStepById(id: string): OnboardingStep | undefined {
  return ONBOARDING_STEPS.find((s) => s.id === id)
}

export function isSportProfileStepId(id: string): id is SportProfileStepId {
  return ONBOARDING_STEPS.some((s) => s.id === id)
}
