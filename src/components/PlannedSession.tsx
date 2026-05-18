import { useState } from 'react'
import type { SessionTemplate, ExerciseLog, WorkoutSession } from '@/types'
import type { SessionSlot } from '@/types'
import ExerciseCard from '@/components/ExerciseCard'
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions'

interface Props {
  template: SessionTemplate
  date: string
  dayName: WorkoutSession['dayName']
  slot: SessionSlot
  existingSession?: WorkoutSession
}

export default function PlannedSession({ template, date, dayName, slot, existingSession }: Props) {
  const { addSession, editSession } = useWorkoutSessions()
  const [logs, setLogs] = useState<ExerciseLog[]>(existingSession?.exercises ?? [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(!!existingSession?.exercises.length)

  function handleExerciseLogged(log: ExerciseLog) {
    setLogs((prev) => {
      const without = prev.filter((l) => l.exerciseId !== log.exerciseId)
      return [...without, log]
    })
    setSaved(false)
  }

  async function handleFinish() {
    if (logs.length === 0) return
    setSaving(true)
    try {
      if (existingSession) {
        editSession({ ...existingSession, exercises: logs })
      } else {
        await addSession({
          date,
          dayName,
          sessionType: 'planned',
          sessionSlot: slot,
          exercises: logs,
          synced: false,
        })
      }
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="planned-session">
      <div className="session-header">
        <h2 className="session-label">{template.label}</h2>
        {saved && <span className="session-synced-badge">Saved</span>}
      </div>

      <div className="exercise-list">
        {template.exercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            existingLog={logs.find((l) => l.exerciseId === ex.id)}
            onLogged={handleExerciseLogged}
          />
        ))}
      </div>

      <button
        className="finish-session-btn"
        onClick={() => void handleFinish()}
        disabled={logs.length === 0 || saving}
      >
        {saving ? 'Saving...' : saved ? 'Update Session' : 'Finish Session'}
      </button>
    </div>
  )
}
