import { useCallback, useEffect, useState } from 'react'
import type { Zone2Workout } from '@/types'
import { getZone2Cache, saveZone2Cache } from '@/lib/storage'
import { fetchZone2Workouts } from '@/lib/googleFit'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'

export function useZone2() {
  const [workouts, setWorkouts] = useState<Zone2Workout[]>(() => getZone2Cache() ?? [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { tokens, refreshTokens } = useGoogleAuth()

  const fetch = useCallback(async () => {
    if (!tokens?.access_token) return

    const cached = getZone2Cache()
    if (cached) {
      setWorkouts(cached)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let data = await fetchZone2Workouts(tokens.access_token)
      saveZone2Cache(data)
      setWorkouts(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('401')) {
        const newToken = await refreshTokens()
        if (newToken) {
          try {
            const data = await fetchZone2Workouts(newToken)
            saveZone2Cache(data)
            setWorkouts(data)
          } catch {
            setError('Failed to load Zone 2 data')
          }
        }
      } else {
        setError('Failed to load Zone 2 data')
      }
    } finally {
      setLoading(false)
    }
  }, [tokens, refreshTokens])

  useEffect(() => {
    void fetch()
  }, [fetch])

  return { workouts, loading, error, refetch: fetch }
}
