import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { useZone2 } from '@/hooks/useZone2'
import ConnectGoogle from '@/components/ConnectGoogle'

export default function Zone2Card() {
  const { isConnected } = useGoogleAuth()
  const { workouts, loading, error } = useZone2()

  if (!isConnected) {
    return (
      <div className="zone2-card">
        <h3 className="zone2-title">Zone 2 Cardio</h3>
        <ConnectGoogle compact />
      </div>
    )
  }

  const recent = workouts.slice(0, 3)

  return (
    <div className="zone2-card">
      <h3 className="zone2-title">Zone 2 Cardio</h3>

      {loading && <p className="text-secondary">Loading...</p>}
      {error && <p className="text-secondary">{error}</p>}

      {!loading && !error && recent.length === 0 && (
        <p className="text-secondary">No Zone 2 sessions in the last 30 days.</p>
      )}

      {recent.map((w, i) => (
        <div key={i} className="zone2-entry">
          <div className="zone2-entry-header">
            <span className="zone2-activity">{w.activityType}</span>
            <span className="zone2-date">{w.date}</span>
          </div>
          <div className="zone2-stats">
            <span>{w.durationMinutes} min</span>
            {w.avgHeartRate > 0 && <span>{w.avgHeartRate} bpm avg</span>}
            {w.calories > 0 && <span>{w.calories} cal</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
