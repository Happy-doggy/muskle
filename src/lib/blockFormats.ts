import type { BlockMode } from '../data/blocks'

export type BlockFormatOption = {
  mode: BlockMode
  label: string
  title: string
  description: string
  color: string
  bg: string
}

export const BLOCK_FORMAT_OPTIONS: BlockFormatOption[] = [
  {
    mode: 'list',
    label: 'Série',
    title: 'Séries classiques',
    description: 'Répétitions et repos entre chaque série.',
    color: 'var(--cat-renforcement)',
    bg: 'color-mix(in srgb, var(--cat-renforcement) 14%, white)',
  },
  {
    mode: 'circuit',
    label: 'Circuit',
    title: 'Enchaînement en rounds',
    description: 'Peu de repos entre les exercices.',
    color: 'var(--mint-strong)',
    bg: 'color-mix(in srgb, var(--mint) 14%, white)',
  },
  {
    mode: 'tabata',
    label: 'Tabata',
    title: "20s d'effort / 10s de repos",
    description: 'Le HIIT minuté à la seconde.',
    color: 'var(--cat-musculation)',
    bg: 'color-mix(in srgb, var(--cat-musculation) 12%, white)',
  },
  {
    mode: 'amrap',
    label: 'AMRAP',
    title: 'As many rounds as possible',
    description: 'Un maximum de tours sur un temps donné.',
    color: 'var(--cat-kine)',
    bg: 'color-mix(in srgb, var(--cat-kine) 12%, white)',
  },
  {
    mode: 'emom',
    label: 'EMOM',
    title: 'Every minute on the minute',
    description: 'Un effort à lancer chaque minute.',
    color: 'var(--cat-mobilite)',
    bg: 'color-mix(in srgb, var(--cat-mobilite) 14%, white)',
  },
]

export function getBlockModeLabel(mode: BlockMode): string {
  return BLOCK_FORMAT_OPTIONS.find((f) => f.mode === mode)?.label ?? mode
}

export function blockModeUsesSets(mode: BlockMode): boolean {
  return mode === 'list'
}

export function blockModeUsesRounds(mode: BlockMode): boolean {
  return mode === 'circuit' || mode === 'tabata' || mode === 'emom'
}

export function blockModeUsesTotalDuration(mode: BlockMode): boolean {
  return mode === 'amrap'
}
