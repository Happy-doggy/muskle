// ─────────────────────────────────────────────
//  ENUMS
// ─────────────────────────────────────────────

export type ExerciseCategory =
  | 'musculation'
  | 'renforcement'
  | 'yoga'
  | 'kine'
  | 'cardio'
  | 'mobilite'
  | 'autre'

export type BlockType =
  | 'serie'       // séries classiques avec repos
  | 'circuit'     // enchaînement sans repos entre exercices
  | 'amrap'       // as many rounds as possible (time-based)
  | 'emom'        // every minute on the minute
  | 'tabata'      // 20s effort / 10s repos

export type TimerPhase = 'prepare' | 'work' | 'rest' | 'done'

// ─────────────────────────────────────────────
//  EXERCISE
// ─────────────────────────────────────────────

export interface Exercise {
  id: string
  title: string
  description: string
  category: ExerciseCategory
  imageUrl?: string   // chemin local ou URL
  videoUrl?: string   // chemin local ou URL
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────
//  BLOCK
// ─────────────────────────────────────────────

export interface BlockExercise {
  id: string           // id unique dans le bloc
  exerciseId: string   // référence à Exercise.id
  sets: number
  reps?: number        // reps OU duration, pas les deux
  duration?: number    // en secondes
  restBetweenSets: number   // repos entre séries (secondes)
  restAfterExercise: number // repos après l'exercice (secondes)
  notes?: string
}

export interface Block {
  id: string
  title: string
  description?: string
  category: ExerciseCategory
  type: BlockType
  exercises: BlockExercise[]
  prepareTime: number  // temps de préparation avant chaque exercice (secondes)
  globalRestTime?: number  // pour circuit/tabata : repos entre rounds
  rounds?: number          // pour circuit/amrap/emom
  totalDuration?: number   // calculé ou manuel pour amrap
  createdAt: string
  updatedAt: string
}

// ─────────────────────────────────────────────
//  SESSION
// ─────────────────────────────────────────────

export interface SessionBlock {
  id: string       // id unique dans la séance
  blockId: string  // référence à Block.id
  order: number
  notes?: string
}

export interface Session {
  id: string
  title: string
  description?: string
  blocks: SessionBlock[]
  estimatedDuration?: number  // en minutes, calculé
  tags?: string[]
  createdAt: string
  updatedAt: string
  lastPlayedAt?: string
}

// ─────────────────────────────────────────────
//  PLAYER
// ─────────────────────────────────────────────

export interface PlayerStep {
  blockTitle: string
  blockIndex: number
  exerciseTitle: string
  exerciseDescription: string
  exerciseImageUrl?: string
  exerciseVideoUrl?: string
  set: number
  totalSets: number
  exerciseIndexInBlock: number
  totalExercisesInBlock: number
  phase: TimerPhase
  duration: number       // durée de cette phase en secondes
  reps?: number          // affiché si pas de duration
  notes?: string
}

export interface PlayerState {
  sessionId: string
  steps: PlayerStep[]
  currentStepIndex: number
  isPlaying: boolean
  isFinished: boolean
}

// ─────────────────────────────────────────────
//  STORAGE (abstraction)
// ─────────────────────────────────────────────

export interface StorageAdapter {
  getExercises(): Promise<Exercise[]>
  saveExercise(exercise: Exercise): Promise<void>
  deleteExercise(id: string): Promise<void>

  getBlocks(): Promise<Block[]>
  saveBlock(block: Block): Promise<void>
  deleteBlock(id: string): Promise<void>

  getSessions(): Promise<Session[]>
  saveSession(session: Session): Promise<void>
  deleteSession(id: string): Promise<void>
}
