import { buildAuthUrl } from '@/lib/auth'

interface Props {
  compact?: boolean
}

export default function ConnectGoogle({ compact = false }: Props) {
  async function handleConnect() {
    const url = await buildAuthUrl()
    window.location.href = url
  }

  if (compact) {
    return (
      <button className="connect-google-btn connect-google-btn--compact" onClick={() => void handleConnect()}>
        Connect Google to see Fit data
      </button>
    )
  }

  return (
    <div className="connect-google">
      <p className="connect-google-desc">
        Connect Google to enable Zone 2 data from Google Fit and auto-sync workouts to Google
        Sheets.
      </p>
      <button className="connect-google-btn" onClick={() => void handleConnect()}>
        Connect Google Account
      </button>
    </div>
  )
}
