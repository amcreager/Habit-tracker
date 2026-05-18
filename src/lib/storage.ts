import type {
  WorkoutSession,
  BodyweightEntry,
  FreeExercise,
  GoogleTokens,
  Zone2Workout,
} from '@/types'
import { v4 as uuidv4 } from 'uuid'

const KEYS = {
  sessions: 'wt_sessions',
  bodyweight: 'wt_bodyweight',
  freeExercises: 'wt_free_exercises',
  googleTokens: 'wt_google_tokens',
  zone2Cache: 'wt_zone2_cache',
} as const

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// Sessions

export function getSessions(): WorkoutSession[] {
  return readJSON<WorkoutSession[]>(KEYS.sessions, [])
}

export function saveSession(session: Omit<WorkoutSession, 'id'>): WorkoutSession {
  const sessions = getSessions()
  const newSession: WorkoutSession = { ...session, id: uuidv4() }
  writeJSON(KEYS.sessions, [...sessions, newSession])
  return newSession
}

export function updateSession(updated: WorkoutSession): void {
  const sessions = getSessions()
  writeJSON(
    KEYS.sessions,
    sessions.map((s) => (s.id === updated.id ? updated : s)),
  )
}

export function markSessionSynced(id: string, syncedAt: string): void {
  const sessions = getSessions()
  writeJSON(
    KEYS.sessions,
    sessions.map((s) => (s.id === id ? { ...s, synced: true, syncedAt } : s)),
  )
}

export function getSessionsForDate(date: string): WorkoutSession[] {
  return getSessions().filter((s) => s.date === date)
}

export function getLastSessionForExercise(exerciseId: string): WorkoutSession | undefined {
  const sessions = getSessions()
  for (let i = sessions.length - 1; i >= 0; i--) {
    const s = sessions[i]
    if (s.exercises.some((e) => e.exerciseId === exerciseId)) {
      return s
    }
  }
  return undefined
}

// Bodyweight

export function getBodyweightEntries(): BodyweightEntry[] {
  return readJSON<BodyweightEntry[]>(KEYS.bodyweight, [])
}

export function saveBodyweightEntry(entry: BodyweightEntry): void {
  const entries = getBodyweightEntries()
  const existing = entries.findIndex((e) => e.date === entry.date)
  if (existing >= 0) {
    entries[existing] = entry
    writeJSON(KEYS.bodyweight, entries)
  } else {
    writeJSON(KEYS.bodyweight, [...entries, entry])
  }
}

export function getTodayBodyweight(): BodyweightEntry | undefined {
  const today = new Date().toISOString().slice(0, 10)
  return getBodyweightEntries().find((e) => e.date === today)
}

// Free exercises

export function getFreeExercises(): FreeExercise[] {
  return readJSON<FreeExercise[]>(KEYS.freeExercises, [])
}

export function saveFreeExercises(exercises: FreeExercise[]): void {
  writeJSON(KEYS.freeExercises, exercises)
}

export function addFreeExercise(
  name: string,
  category: 'morning' | 'evening',
): FreeExercise {
  const exercises = getFreeExercises()
  const sameCat = exercises.filter((e) => e.category === category)
  const newEx: FreeExercise = {
    id: uuidv4(),
    name,
    category,
    order: sameCat.length,
  }
  writeJSON(KEYS.freeExercises, [...exercises, newEx])
  return newEx
}

export function deleteFreeExercise(id: string): void {
  writeJSON(
    KEYS.freeExercises,
    getFreeExercises().filter((e) => e.id !== id),
  )
}

// Google tokens

export function getGoogleTokens(): GoogleTokens | null {
  return readJSON<GoogleTokens | null>(KEYS.googleTokens, null)
}

export function saveGoogleTokens(tokens: GoogleTokens): void {
  writeJSON(KEYS.googleTokens, tokens)
}

export function clearGoogleTokens(): void {
  localStorage.removeItem(KEYS.googleTokens)
}

// Zone 2 cache

interface Zone2Cache {
  data: Zone2Workout[]
  fetchedAt: number
}

const ZONE2_CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export function getZone2Cache(): Zone2Workout[] | null {
  const cache = readJSON<Zone2Cache | null>(KEYS.zone2Cache, null)
  if (!cache) return null
  if (Date.now() - cache.fetchedAt > ZONE2_CACHE_TTL_MS) return null
  return cache.data
}

export function saveZone2Cache(data: Zone2Workout[]): void {
  const cache: Zone2Cache = { data, fetchedAt: Date.now() }
  writeJSON(KEYS.zone2Cache, cache)
}

export function clearZone2Cache(): void {
  localStorage.removeItem(KEYS.zone2Cache)
}
