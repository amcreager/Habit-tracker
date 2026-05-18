import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { GoogleTokens } from '@/types'
import { getGoogleTokens, saveGoogleTokens, clearGoogleTokens } from '@/lib/storage'

interface GoogleAuthContextValue {
  tokens: GoogleTokens | null
  isConnected: boolean
  needsReconnect: boolean
  setTokens: (tokens: GoogleTokens) => void
  disconnect: () => void
  refreshTokens: () => Promise<string | null>
}

const GoogleAuthContext = createContext<GoogleAuthContextValue | null>(null)

export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokensState] = useState<GoogleTokens | null>(() => getGoogleTokens())
  const [needsReconnect, setNeedsReconnect] = useState(false)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function setTokens(t: GoogleTokens) {
    saveGoogleTokens(t)
    setTokensState(t)
    setNeedsReconnect(false)
    scheduleRefresh(t)
  }

  function disconnect() {
    clearGoogleTokens()
    setTokensState(null)
    setNeedsReconnect(false)
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
  }

  async function refreshTokens(): Promise<string | null> {
    const current = getGoogleTokens()
    if (!current?.refresh_token) {
      setNeedsReconnect(true)
      return null
    }

    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: current.refresh_token }),
      })

      if (res.status === 401) {
        setNeedsReconnect(true)
        clearGoogleTokens()
        setTokensState(null)
        return null
      }

      const data = (await res.json()) as {
        access_token: string
        expires_at: number
      }
      const updated: GoogleTokens = {
        ...current,
        access_token: data.access_token,
        expires_at: data.expires_at,
      }
      setTokens(updated)
      return updated.access_token
    } catch {
      return null
    }
  }

  function scheduleRefresh(t: GoogleTokens) {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    const msUntilRefresh = t.expires_at - Date.now() - 5 * 60 * 1000
    if (msUntilRefresh > 0) {
      refreshTimerRef.current = setTimeout(() => {
        void refreshTokens()
      }, msUntilRefresh)
    } else {
      void refreshTokens()
    }
  }

  useEffect(() => {
    if (tokens) scheduleRefresh(tokens)

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<GoogleTokens>).detail
      setTokens(detail)
    }
    window.addEventListener('google-tokens-received', handler)
    return () => {
      window.removeEventListener('google-tokens-received', handler)
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GoogleAuthContext.Provider
      value={{
        tokens,
        isConnected: !!tokens,
        needsReconnect,
        setTokens,
        disconnect,
        refreshTokens,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  )
}

export function useGoogleAuth(): GoogleAuthContextValue {
  const ctx = useContext(GoogleAuthContext)
  if (!ctx) throw new Error('useGoogleAuth must be used within GoogleAuthProvider')
  return ctx
}
