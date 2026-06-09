import { sessionsDB, type Session } from '../data/sessions'
import { storage } from '../storage'
import type { Session as FirestoreSession } from '../types'

function toFirestore(session: Session): FirestoreSession {
  return session as unknown as FirestoreSession
}

function fromFirestore(session: FirestoreSession): Session {
  return session as unknown as Session
}

export async function loadSessions(): Promise<Session[]> {
  const stored = (await storage.getSessions()).map(fromFirestore)
  if (stored.length === 0) {
    await Promise.all(sessionsDB.map((session) => storage.saveSession(toFirestore(session))))
    return [...sessionsDB]
  }
  return stored
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  await Promise.all(sessions.map((session) => storage.saveSession(toFirestore(session))))
}

export async function upsertSession(session: Session): Promise<void> {
  await storage.saveSession(toFirestore(session))
}

export async function deleteSessionById(id: string): Promise<void> {
  await storage.deleteSession(id)
}
