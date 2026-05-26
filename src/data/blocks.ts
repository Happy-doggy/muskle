export type BlockMode = 'list' | 'circuit'

export type BlockExercise = {
  exerciseId: string      // référence à Exercise.id
  sets?: number           // ex: 3
  reps?: number           // si type === 'reps'
  duration?: number       // si type === 'duration', en secondes
  restSeconds?: number    // repos après cet exercice
}

export type Block = {
  id: string
  name: string
  mode: BlockMode
  // circuit uniquement : nombre de tours
  rounds?: number
  // repos entre les rounds (circuit)
  restBetweenRounds?: number
  exercises: BlockExercise[]
}

export const blocksDB: Block[] = [
  {
    id: 'gainage-base',
    name: 'Gainage de base',
    mode: 'circuit',
    rounds: 3,
    restBetweenRounds: 60,
    exercises: [
      { exerciseId: 'plank',     duration: 30, restSeconds: 15 },
      { exerciseId: 'side-plank', duration: 20, restSeconds: 15 },
      { exerciseId: 'dead-bug',  reps: 10,     restSeconds: 20 },
    ],
  },
  {
    id: 'cuisses-force',
    name: 'Cuisses — force',
    mode: 'list',
    exercises: [
      { exerciseId: 'squat',              sets: 4, reps: 12, restSeconds: 90 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 10, restSeconds: 90 },
      { exerciseId: 'wall-sit',           sets: 3, duration: 40, restSeconds: 60 },
    ],
  },
]