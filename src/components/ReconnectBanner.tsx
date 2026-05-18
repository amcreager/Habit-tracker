import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { buildAuthUrl } from '@/lib/auth'

export default function ReconnectBanner() {
  const { needsReconnect } = useGoogleAuth()

  if (!needsReconnect) return null

  async function handleReconnect() {
    const url = await buildAuthUrl()
    window.location.href = url
  }

  return (
    <div className="reconnect-banner">
      <span>Google session expired.</span>
      <button onClick={() => void handleReconnect()} className="reconnect-btn">
        Reconnect
      </button>
    </div>
  )
}
