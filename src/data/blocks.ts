export type BlockMode = 'list' | 'circuit' | 'tabata' | 'amrap' | 'emom'

export type BlockExercise = {
  exerciseId: string      // référence à Exercise.id
  sets?: number           // ex: 3
  reps?: number           // répétitions (exclusif avec duration)
  duration?: number       // durée en secondes (exclusif avec reps)
  restSeconds?: number    // repos après cet exercice
}

export type Block = {
  id: string
  name: string
  mode: BlockMode
  // circuit / tabata / emom : nombre de tours ou minutes
  rounds?: number
  // repos entre les rounds (circuit)
  restBetweenRounds?: number
  // amrap : durée totale en secondes
  totalDuration?: number
  exercises: BlockExercise[]
}
