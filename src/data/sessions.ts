export type Session = {
    id: string
    name: string
    description?: string
    // ordre des blocs dans la séance
    blockIds: string[]
  }
  
  export const sessionsDB: Session[] = [
    {
      id: 'full-body-1',
      name: 'Full body — débutant',
      description: 'Gainage + cuisses, 45 min environ',
      blockIds: ['gainage-base', 'cuisses-force'],
    },
  ]