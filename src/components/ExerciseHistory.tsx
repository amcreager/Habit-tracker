import { useMemo } from 'react'
import type { WorkoutSession } from '@/types'

interface Props {
  sessions: WorkoutSession[]
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function ExerciseHistory({ sessions }: Props) {
  const sorted = useMemo(
    () => [...sessions].sort((a, b) => b.date.localeCompare(a.date)),
    [sessions],
  )

  if (sorted.length === 0) {
    return <p className="text-secondary">No sessions logged yet.</p>
  }

  return (
    <div className="history-list">
      {sorted.map((session) => (
        <div key={session.id} className="history-card">
          <div className="history-card-header">
            <span className="history-date">{formatDate(session.date)}</span>
            <span className="history-day">{session.dayName}</span>
            {session.synced && <span className="history-synced">✓ Synced</span>}
          </div>

          <div className="history-exercises">
            {session.exercises.map((exLog) => (
              <div key={exLog.exerciseId} className="history-exercise">
                <span className="history-exercise-name">{exLog.exerciseName}</span>
                <span className="history-sets-summary">
                  {exLog.sets.map((s) => `${s.reps}×${s.weight}lb`).join(' · ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
