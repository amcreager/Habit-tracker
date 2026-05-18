import type { WorkoutSession, BodyweightEntry } from '@/types'
import { markSessionSynced } from '@/lib/storage'

const SHEETS_ID = '1bUgXSK90-finscbw5VaL7uORaNzCna0pwLlXxVqgPoY'

async function appendRows(
  accessToken: string,
  sheetTab: string,
  rows: (string | number)[][],
): Promise<Response> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encodeURIComponent(sheetTab)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`
  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: rows }),
  })
}

export async function syncSession(
  session: WorkoutSession,
  accessToken: string,
  refreshAndRetry: () => Promise<string | null>,
): Promise<void> {
  if (session.synced) return

  const rows: (string | number)[][] = []
  for (const exercise of session.exercises) {
    for (const set of exercise.sets) {
      rows.push([
        session.date,
        session.dayName,
        session.sessionType,
        exercise.exerciseName,
        set.setNumber,
        set.reps,
        set.weight,
        session.id,
      ])
    }
  }

  if (rows.length === 0) {
    markSessionSynced(session.id, new Date().toISOString())
    return
  }

  let res = await appendRows(accessToken, 'Sessions', rows)

  if (res.status === 401) {
    const newToken = await refreshAndRetry()
    if (!newToken) return
    res = await appendRows(newToken, 'Sessions', rows)
  }

  if (res.ok) {
    markSessionSynced(session.id, new Date().toISOString())
  }
}

export async function syncBodyweight(
  entry: BodyweightEntry,
  accessToken: string,
  refreshAndRetry: () => Promise<string | null>,
): Promise<void> {
  const rows: (string | number)[][] = [[entry.date, entry.weight]]
  let res = await appendRows(accessToken, 'Bodyweight', rows)

  if (res.status === 401) {
    const newToken = await refreshAndRetry()
    if (!newToken) return
    res = await appendRows(newToken, 'Bodyweight', rows)
  }
}
