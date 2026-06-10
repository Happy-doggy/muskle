import crunchImage from '../assets/exercises/crunch.png'
import crunchVideo from '../assets/exercises/crunch.mp4'
import forwardLungeImage from '../assets/exercises/forward-lunge.png'
import gluteBridgeImage from '../assets/exercises/glute-bridge.png'
import plankImage from '../assets/exercises/plank.png'
import pushUpImage from '../assets/exercises/push-up.png'
import pushUpVideo from '../assets/exercises/push-up.mp4'
import squatImage from '../assets/exercises/squat.png'
import supermanImage from '../assets/exercises/superman.png'

export type MuscleGroup =
  | 'Gainage'
  | 'Cuisses & Fessiers'
  | 'Ischio-jambiers'
  | 'Pectoraux'
  | 'Épaules'
  | 'Dos'
  | 'Biceps'
  | 'Triceps'
  | 'Mollets'
  | 'Cardio / Full Body'

export type Exercise = {
  id: string
  name: string
  category: MuscleGroup
  description: string
  type: 'reps' | 'duration'
  // si type === 'reps'
  defaultReps?: number
  defaultSets?: number
  // si type === 'duration'
  defaultDuration?: number   // en secondes
  // médias (optionnels — chemins relatifs ou URLs)
  image?: string
  video?: string
}

export const exercisesDB: Exercise[] = [

  // ── Gainage ──────────────────────────────────────────
  {
    id: 'plank',
    name: 'Planche',
    category: 'Gainage',
    description: 'Position de gainage sur les avant-bras, corps aligné de la tête aux talons.',
    type: 'duration',
    defaultDuration: 30,
    defaultSets: 3,
    image: plankImage,
  },
  {
    id: 'side-plank',
    name: 'Planche latérale',
    category: 'Gainage',
    description: 'Gainage sur un avant-bras, corps de côté, hanches décollées.',
    type: 'duration',
    defaultDuration: 20,
    defaultSets: 3,
  },
  {
    id: 'dead-bug',
    name: 'Dead bug',
    category: 'Gainage',
    description: 'Allongé sur le dos, bras tendus vers le plafond. Abaisser alternativement bras et jambe opposée.',
    type: 'reps',
    defaultReps: 10,
    defaultSets: 3,
  },
  {
    id: 'bird-dog',
    name: 'Bird dog',
    category: 'Gainage',
    description: 'À quatre pattes, tendre le bras droit et la jambe gauche simultanément, dos plat.',
    type: 'reps',
    defaultReps: 10,
    defaultSets: 3,
  },
  {
    id: 'crunch',
    name: 'Crunch',
    category: 'Gainage',
    description: 'Allongé sur le dos, genoux fléchis. Décoller les épaules du sol en contractant les abdominaux.',
    type: 'reps',
    defaultReps: 15,
    defaultSets: 3,
    image: crunchImage,
    video: crunchVideo,
  },

  // ── Cuisses & Fessiers ────────────────────────────────
  {
    id: 'squat',
    name: 'Squat',
    category: 'Cuisses & Fessiers',
    description: "Pieds à largeur d'épaules, descendre jusqu'à ce que les cuisses soient parallèles au sol. Dos droit.",
    type: 'reps',
    defaultReps: 12,
    defaultSets: 4,
    image: squatImage,
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Squat bulgare',
    category: 'Cuisses & Fessiers',
    description: "Pied arrière posé sur un banc, descendre la hanche avant jusqu'au sol. Alternatif.",
    type: 'reps',
    defaultReps: 10,
    defaultSets: 3,
  },
  {
    id: 'lunge',
    name: 'Fente avant',
    category: 'Cuisses & Fessiers',
    description: 'Faire un grand pas en avant, descendre le genou arrière vers le sol. Alternatif.',
    type: 'reps',
    defaultReps: 12,
    defaultSets: 3,
    image: forwardLungeImage,
  },
  {
    id: 'wall-sit',
    name: 'Wall sit',
    category: 'Cuisses & Fessiers',
    description: 'Dos contre un mur, cuisses parallèles au sol, tenir la position.',
    type: 'duration',
    defaultDuration: 40,
    defaultSets: 3,
  },

  // ── Ischio-jambiers ───────────────────────────────────
  {
    id: 'glute-bridge',
    name: 'Pont fessier',
    category: 'Ischio-jambiers',
    description: 'Allongé sur le dos, pieds à plat. Pousser les hanches vers le haut en contractant les fessiers.',
    type: 'reps',
    defaultReps: 15,
    defaultSets: 3,
    image: gluteBridgeImage,
  },
  {
    id: 'hip-thrust',
    name: 'Hip thrust',
    category: 'Ischio-jambiers',
    description: 'Épaules sur un banc, pieds à plat. Pousser les hanches vers le haut avec charge ou au poids du corps.',
    type: 'reps',
    defaultReps: 12,
    defaultSets: 4,
  },
  {
    id: 'rdl',
    name: 'Romanian deadlift',
    category: 'Ischio-jambiers',
    description: "Haltères devant les cuisses, descendre en gardant le dos droit jusqu'à sentir l'étirement des ischio.",
    type: 'reps',
    defaultReps: 10,
    defaultSets: 3,
  },

  // ── Pectoraux ─────────────────────────────────────────
  {
    id: 'push-up',
    name: 'Pompes',
    category: 'Pectoraux',
    description: "Mains à largeur d'épaules, corps gainé. Descendre la poitrine vers le sol puis repousser.",
    type: 'reps',
    defaultReps: 12,
    defaultSets: 4,
    image: pushUpImage,
    video: pushUpVideo,
  },
  {
    id: 'wide-push-up',
    name: 'Pompes larges',
    category: 'Pectoraux',
    description: 'Mains plus écartées que les épaules pour cibler les pectoraux externes.',
    type: 'reps',
    defaultReps: 12,
    defaultSets: 3,
  },
  {
    id: 'diamond-push-up',
    name: 'Pompes diamant',
    category: 'Triceps',
    description: 'Mains rapprochées en forme de losange, ciblant les triceps et les pectoraux internes.',
    type: 'reps',
    defaultReps: 10,
    defaultSets: 3,
  },
  {
    id: 'dips',
    name: 'Dips sur chaise',
    category: 'Pectoraux',
    description: "Mains sur le bord d'une chaise derrière soi, fléchir les coudes et remonter.",
    type: 'reps',
    defaultReps: 12,
    defaultSets: 3,
  },

  // ── Épaules ───────────────────────────────────────────
  {
    id: 'pike-push-up',
    name: 'Pike push-up',
    category: 'Épaules',
    description: 'Hanches hautes en V renversé, fléchir les coudes pour amener la tête vers le sol.',
    type: 'reps',
    defaultReps: 10,
    defaultSets: 3,
  },
  {
    id: 'lateral-raise',
    name: 'Élévations latérales',
    category: 'Épaules',
    description: "Haltères en main, lever les bras sur les côtés jusqu'à hauteur des épaules.",
    type: 'reps',
    defaultReps: 12,
    defaultSets: 3,
  },

  // ── Dos ───────────────────────────────────────────────
  {
    id: 'pull-up',
    name: 'Traction',
    category: 'Dos',
    description: "Barre en pronation, tirer le corps vers le haut jusqu'au menton au-dessus de la barre.",
    type: 'reps',
    defaultReps: 8,
    defaultSets: 4,
  },
  {
    id: 'row-dumbbell',
    name: 'Rowing haltère',
    category: 'Dos',
    description: "Un genou sur un banc, tirer l'haltère vers la hanche. Alternatif.",
    type: 'reps',
    defaultReps: 10,
    defaultSets: 3,
  },
  {
    id: 'superman',
    name: 'Superman',
    category: 'Dos',
    description: 'Allongé face au sol, lever simultanément les bras et les jambes en contractant le bas du dos.',
    type: 'reps',
    defaultReps: 12,
    defaultSets: 3,
    image: supermanImage,
  },

  // ── Biceps ────────────────────────────────────────────
  {
    id: 'bicep-curl',
    name: 'Curl biceps',
    category: 'Biceps',
    description: 'Haltères en supination, fléchir les coudes pour remonter les charges. Coudes fixes.',
    type: 'reps',
    defaultReps: 12,
    defaultSets: 3,
  },
  {
    id: 'hammer-curl',
    name: 'Curl marteau',
    category: 'Biceps',
    description: 'Haltères en prise neutre (pouce vers le haut). Fléchir les coudes.',
    type: 'reps',
    defaultReps: 12,
    defaultSets: 3,
  },

  // ── Triceps ───────────────────────────────────────────
  {
    id: 'tricep-extension',
    name: 'Extension triceps',
    category: 'Triceps',
    description: 'Haltère tenu à deux mains derrière la tête, étendre les bras vers le haut.',
    type: 'reps',
    defaultReps: 12,
    defaultSets: 3,
  },

  // ── Mollets ───────────────────────────────────────────
  {
    id: 'calf-raise',
    name: 'Élévation mollets',
    category: 'Mollets',
    description: "Debout, monter sur la pointe des pieds lentement, descendre. Bord d'une marche pour plus d'amplitude.",
    type: 'reps',
    defaultReps: 20,
    defaultSets: 3,
  },

  // ── Cardio / Full Body ────────────────────────────────
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'Cardio / Full Body',
    description: 'Pompe au sol, remonter en saut avec les mains au-dessus de la tête. Enchaîner sans pause.',
    type: 'reps',
    defaultReps: 10,
    defaultSets: 3,
  },
  {
    id: 'mountain-climber',
    name: 'Mountain climber',
    category: 'Cardio / Full Body',
    description: 'En position de pompe, ramener les genoux vers la poitrine alternativement à rythme rapide.',
    type: 'duration',
    defaultDuration: 30,
    defaultSets: 3,
  },
  {
    id: 'jump-squat',
    name: 'Jump squat',
    category: 'Cardio / Full Body',
    description: "Squat suivi d'un saut explosif. Atterrir doucement en fléchissant les genoux.",
    type: 'reps',
    defaultReps: 12,
    defaultSets: 3,
  },
]

export const muscleGroups: MuscleGroup[] = [
  'Gainage',
  'Cuisses & Fessiers',
  'Ischio-jambiers',
  'Pectoraux',
  'Épaules',
  'Dos',
  'Biceps',
  'Triceps',
  'Mollets',
  'Cardio / Full Body',
]

export function filterExercisesByCategory(
  exercises: Exercise[],
  category: MuscleGroup,
): Exercise[] {
  return exercises.filter((e) => e.category === category)
}

export function findExerciseById(
  exercises: Exercise[],
  id: string,
): Exercise | undefined {
  return exercises.find((e) => e.id === id)
}