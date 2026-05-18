import { useState } from 'react'
import type { FreeExercise, ExerciseLog, SetLog, WorkoutSession } from '@/types'
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions'
import SetLogger from '@/components/SetLogger'

interface FreeExerciseCardProps {
  exercise: FreeExercise
  onLogged: (log: ExerciseLog) => void
  existingLog?: ExerciseLog
}

function FreeExerciseCard({ exercise, onLogged, existingLog }: FreeExerciseCardProps) {
  const [sets, setSets] = useState<SetLog[]>(existingLog?.sets ?? [])

  function handleSetSave(set: SetLog) {
    const updated = [...sets.filter((s) => s.setNumber !== set.setNumber), set].sort(
      (a, b) => a.setNumber - b.setNumber,
    )
    setSets(updated)
    onLogged({ exerciseId: exercise.id, exerciseName: exercise.name, sets: updated })
  }

  return (
    <div className="exercise-card">
      <div className="exercise-card-header">
        <h3 className="exercise-name">{exercise.name}</h3>
      </div>
      <div className="exercise-sets">
        {[1, 2, 3, 4].map((n) => (
          <SetLogger
            key={n}
            setNumber={n}
            existing={sets.find((s) => s.setNumber === n)}
            onSave={handleSetSave}
          />
        ))}
      </div>
    </div>
  )
}

interface Props {
  exercises: FreeExercise[]
  category: 'morning' | 'evening'
  date: string
  dayName: WorkoutSession['dayName']
  existingSession?: WorkoutSession
}

export default function FreeSession({ exercises, category, date, dayName, existingSession }: Props) {
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
      const sessionType = category === 'morning' ? 'morning-free' : 'evening-free'
      if (existingSession) {
        editSession({ ...existingSession, exercises: logs })
      } else {
        await addSession({
          date,
          dayName,
          sessionType,
          sessionSlot: 'secondary',
          exercises: logs,
          synced: false,
        })
      }
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  if (exercises.length === 0) {
    return (
      <div className="free-session-empty">
        <p className="text-secondary">No {category} exercises configured.</p>
        <p className="text-secondary">Add some in Settings → Free Exercises.</p>
      </div>
    )
  }

  return (
    <div className="planned-session">
      <div className="session-header">
        <h2 className="session-label">
          {category === 'morning' ? 'Morning' : 'Evening'} Session
        </h2>
        {saved && <span className="session-synced-badge">Saved</span>}
      </div>

      <div className="exercise-list">
        {exercises.map((ex) => (
          <FreeExerciseCard
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
