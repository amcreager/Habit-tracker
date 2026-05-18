import { useCallback, useEffect, useState } from 'react'
import type { WorkoutSession } from '@/types'
import {
  getSessions,
  saveSession,
  updateSession,
  getSessionsForDate,
} from '@/lib/storage'
import { syncSession } from '@/lib/sheetsSync'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'

export function useWorkoutSessions() {
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => getSessions())
  const { tokens, refreshTokens } = useGoogleAuth()

  const reload = useCallback(() => {
    setSessions(getSessions())
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const addSession = useCallback(
    async (session: Omit<WorkoutSession, 'id'>) => {
      const saved = saveSession(session)
      setSessions(getSessions())

      if (tokens?.access_token) {
        await syncSession(saved, tokens.access_token, refreshTokens)
        setSessions(getSessions())
      }

      return saved
    },
    [tokens, refreshTokens],
  )

  const editSession = useCallback((updated: WorkoutSession) => {
    updateSession(updated)
    setSessions(getSessions())
  }, [])

  const getForDate = useCallback((date: string) => {
    return getSessionsForDate(date)
  }, [])

  return { sessions, addSession, editSession, getForDate, reload }
}
