export type Session = {
    id: string
    name: string
    description?: string
    // ordre des blocs dans la séance
    blockIds: string[]
  }