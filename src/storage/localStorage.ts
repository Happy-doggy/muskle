/**
 * storage/localStorage.ts
 *
 * Couche d'abstraction pour localStorage.
 * Pour migrer vers Supabase/Firebase plus tard :
 *   1. Créer src/storage/supabase.ts qui implémente StorageAdapter
 *   2. Changer l'import dans src/storage/index.ts
 *   Rien d'autre à toucher dans l'app.
 */

import type { StorageAdapter, Exercise, Block, Session } from '../types'

const KEYS = {
  exercises: 'muskle:exercises',
  blocks: 'muskle:blocks',
  sessions: 'muskle:sessions',
} as const

// ── helpers ──────────────────────────────────

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    console.error(`[storage] Failed to read key "${key}"`)
    return []
  }
}

function write<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    console.error(`[storage] Failed to write key "${key}"`)
  }
}

function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id)
  if (idx === -1) return [...list, item]
  const next = [...list]
  next[idx] = item
  return next
}

// ── adapter ──────────────────────────────────

export const localStorageAdapter: StorageAdapter = {
  // EXERCISES
  async getExercises() {
    return read<Exercise>(KEYS.exercises)
  },
  async saveExercise(exercise) {
    const list = read<Exercise>(KEYS.exercises)
    write(KEYS.exercises, upsert(list, exercise))
  },
  async deleteExercise(id) {
    const list = read<Exercise>(KEYS.exercises).filter((x) => x.id !== id)
    write(KEYS.exercises, list)
  },

  // BLOCKS
  async getBlocks() {
    return read<Block>(KEYS.blocks)
  },
  async saveBlock(block) {
    const list = read<Block>(KEYS.blocks)
    write(KEYS.blocks, upsert(list, block))
  },
  async deleteBlock(id) {
    const list = read<Block>(KEYS.blocks).filter((x) => x.id !== id)
    write(KEYS.blocks, list)
  },

  // SESSIONS
  async getSessions() {
    return read<Session>(KEYS.sessions)
  },
  async saveSession(session) {
    const list = read<Session>(KEYS.sessions)
    write(KEYS.sessions, upsert(list, session))
  },
  async deleteSession(id) {
    const list = read<Session>(KEYS.sessions).filter((x) => x.id !== id)
    write(KEYS.sessions, list)
  },
}

// ── export/import JSON (backup) ───────────────

export function exportData(): string {
  return JSON.stringify(
    {
      exercises: read(KEYS.exercises),
      blocks: read(KEYS.blocks),
      sessions: read(KEYS.sessions),
      exportedAt: new Date().toISOString(),
    },
    null,
    2,
  )
}

export function importData(json: string): void {
  const data = JSON.parse(json)
  if (data.exercises) write(KEYS.exercises, data.exercises)
  if (data.blocks) write(KEYS.blocks, data.blocks)
  if (data.sessions) write(KEYS.sessions, data.sessions)
}
