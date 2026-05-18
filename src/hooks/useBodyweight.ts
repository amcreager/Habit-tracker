import { useCallback, useState } from 'react'
import type { BodyweightEntry } from '@/types'
import {
  getBodyweightEntries,
  saveBodyweightEntry,
  getTodayBodyweight,
} from '@/lib/storage'
import { syncBodyweight } from '@/lib/sheetsSync'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'

export function useBodyweight() {
  const [entries, setEntries] = useState<BodyweightEntry[]>(() => getBodyweightEntries())
  const [todayEntry, setTodayEntry] = useState<BodyweightEntry | undefined>(
    () => getTodayBodyweight(),
  )
  const { tokens, refreshTokens } = useGoogleAuth()

  const reload = useCallback(() => {
    setEntries(getBodyweightEntries())
    setTodayEntry(getTodayBodyweight())
  }, [])

  const logBodyweight = useCallback(
    async (weight: number) => {
      const today = new Date().toISOString().slice(0, 10)
      const entry: BodyweightEntry = { date: today, weight }
      saveBodyweightEntry(entry)
      reload()

      if (tokens?.access_token) {
        await syncBodyweight(entry, tokens.access_token, refreshTokens)
      }
    },
    [tokens, refreshTokens, reload],
  )

  return { entries, todayEntry, logBodyweight, reload }
}
