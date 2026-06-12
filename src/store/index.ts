/**
 * store/index.ts
 *
 * State global avec Zustand.
 * blocks et sessions : persistance Firestore via firestoreAdapter.
 */

import { create } from 'zustand'
import type { Block } from '../data/blocks'
import type { Session } from '../data/sessions'
import { loadCustomExercises } from '../lib/customExercises'
import { auth } from '../lib/firebase'
import { storage } from '../storage'
import type { Block as FirestoreBlock, Session as FirestoreSession } from '../types'

function toFirestoreBlock(block: Block): FirestoreBlock {
  return block as unknown as FirestoreBlock
}

function fromFirestoreBlock(block: FirestoreBlock): Block {
  return block as unknown as Block
}

function toFirestoreSession(session: Session): FirestoreSession {
  return session as unknown as FirestoreSession
}

function fromFirestoreSession(session: FirestoreSession): Session {
  return session as unknown as Session
}

interface AppStore {
  blocks: Block[]
  sessions: Session[]

  loadAll: () => Promise<void>

  addBlock: (block: Block) => Promise<void>
  updateBlock: (block: Block) => Promise<void>
  deleteBlock: (id: string) => Promise<void>

  addSession: (session: Session) => Promise<void>
  updateSession: (session: Session) => Promise<void>
  deleteSession: (id: string) => Promise<void>
}

export const useAppStore = create<AppStore>((set) => ({
  blocks: [],
  sessions: [],

  loadAll: async () => {
    if (!auth.currentUser) return

    await loadCustomExercises()

    const blocks = (await storage.getBlocks()).map(fromFirestoreBlock)
    const sessions = (await storage.getSessions()).map(fromFirestoreSession)

    set({ blocks, sessions })
  },

  addBlock: async (block) => {
    await storage.saveBlock(toFirestoreBlock(block))
    set((s) => ({ blocks: [...s.blocks, block] }))
  },

  updateBlock: async (block) => {
    await storage.saveBlock(toFirestoreBlock(block))
    set((s) => ({
      blocks: s.blocks.map((b) => (b.id === block.id ? block : b)),
    }))
  },

  deleteBlock: async (id) => {
    await storage.deleteBlock(id)
    set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) }))
  },

  addSession: async (session) => {
    await storage.saveSession(toFirestoreSession(session))
    set((s) => ({ sessions: [...s.sessions, session] }))
  },

  updateSession: async (session) => {
    await storage.saveSession(toFirestoreSession(session))
    set((s) => ({
      sessions: s.sessions.map((x) => (x.id === session.id ? session : x)),
    }))
  },

  deleteSession: async (id) => {
    await storage.deleteSession(id)
    set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) }))
  },
}))

export const selectBlockById = (id: string) => (s: AppStore) =>
  s.blocks.find((b) => b.id === id)

export const selectSessionById = (id: string) => (s: AppStore) =>
  s.sessions.find((x) => x.id === id)
