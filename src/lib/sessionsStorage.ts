import { sessionsDB, type Session } from '../data/sessions'

const STORAGE_KEY = 'muskle_sessions'

function read(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session[]) : []
  } catch {
    return []
  }
}

function write(sessions: Session[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function loadSessions(): Session[] {
  const stored = read()
  if (stored.length === 0) {
    write(sessionsDB)
    return [...sessionsDB]
  }
  return stored
}

export function saveSessions(sessions: Session[]): void {
  write(sessions)
}

export function upsertSession(session: Session): void {
  const list = loadSessions()
  const idx = list.findIndex((s) => s.id === session.id)
  if (idx === -1) {
    saveSessions([...list, session])
  } else {
    const next = [...list]
    next[idx] = session
    saveSessions(next)
  }
}

export function deleteSessionById(id: string): void {
  saveSessions(loadSessions().filter((s) => s.id !== id))
}
