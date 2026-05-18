import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCodeVerifier, clearCodeVerifier } from '@/lib/auth'
import type { GoogleTokens } from '@/types'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const didRun = useRef(false)

  useEffect(() => {
    if (didRun.current) return
    didRun.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const verifier = getCodeVerifier()

    if (!code || !verifier) {
      setError('Missing auth code or verifier.')
      return
    }

    clearCodeVerifier()

    fetch('/api/auth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, code_verifier: verifier }),
    })
      .then((res) => {
        if (!res.ok) return Promise.reject(new Error(`Server error: ${res.status}`))
        return res.json() as Promise<GoogleTokens>
      })
      .then((tokens) => {
        window.dispatchEvent(new CustomEvent('google-tokens-received', { detail: tokens }))
        navigate('/', { replace: true })
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err)
        setError(`Authentication failed: ${msg}`)
      })
  }, [navigate])

  if (error) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p className="text-secondary">{error}</p>
          <button className="connect-google-btn" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p className="text-secondary">Connecting Google...</p>
    </div>
  )
}
