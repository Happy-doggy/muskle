/**
 * store/index.ts
 *
 * State global avec Zustand.
 * blocks et sessions : persistance localStorage (muskle_blocks / muskle_sessions).
 */

import { create } from 'zustand'
import type { Block } from '../data/blocks'
import type { Session } from '../data/sessions'
import {
  loadBlocks,
  upsertBlock,
  deleteBlockById,
} from '../lib/blocksStorage'
import {
  loadSessions,
  upsertSession,
  deleteSessionById,
} from '../lib/sessionsStorage'

interface AppStore {
  blocks: Block[]
  sessions: Session[]

  loadAll: () => void

  addBlock: (block: Block) => void
  updateBlock: (block: Block) => void
  deleteBlock: (id: string) => void

  addSession: (session: Session) => void
  updateSession: (session: Session) => void
  deleteSession: (id: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  blocks: [],
  sessions: [],

  loadAll: () => {
    set({
      blocks: loadBlocks(),
      sessions: loadSessions(),
    })
  },

  addBlock: (block) => {
    upsertBlock(block)
    set((s) => ({ blocks: [...s.blocks, block] }))
  },

  updateBlock: (block) => {
    upsertBlock(block)
    set((s) => ({
      blocks: s.blocks.map((b) => (b.id === block.id ? block : b)),
    }))
  },

  deleteBlock: (id) => {
    deleteBlockById(id)
    set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) }))
  },

  addSession: (session) => {
    upsertSession(session)
    set((s) => ({ sessions: [...s.sessions, session] }))
  },

  updateSession: (session) => {
    upsertSession(session)
    set((s) => ({
      sessions: s.sessions.map((x) => (x.id === session.id ? session : x)),
    }))
  },

  deleteSession: (id) => {
    deleteSessionById(id)
    set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) }))
  },
}))

export const selectBlockById = (id: string) => (s: AppStore) =>
  s.blocks.find((b) => b.id === id)

export const selectSessionById = (id: string) => (s: AppStore) =>
  s.sessions.find((x) => x.id === id)
