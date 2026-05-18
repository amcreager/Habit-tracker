import { useState } from 'react'
import type { PlannedExercise, SetLog, ExerciseLog } from '@/types'
import { getLastSessionForExercise } from '@/lib/storage'
import SetLogger from '@/components/SetLogger'
import InstructionSheet from '@/components/InstructionSheet'
import JointFlag from '@/components/JointFlag'

interface Props {
  exercise: PlannedExercise
  onLogged: (log: ExerciseLog) => void
  existingLog?: ExerciseLog
}

export default function ExerciseCard({ exercise, onLogged, existingLog }: Props) {
  const [sets, setSets] = useState<SetLog[]>(existingLog?.sets ?? [])
  const [showInstructions, setShowInstructions] = useState(false)

  const lastSession = getLastSessionForExercise(exercise.id)
  const lastExLog = lastSession?.exercises.find((e) => e.exerciseId === exercise.id)

  function handleSetSave(set: SetLog) {
    const updated = [...sets.filter((s) => s.setNumber !== set.setNumber), set].sort(
      (a, b) => a.setNumber - b.setNumber,
    )
    setSets(updated)
    if (updated.length >= exercise.sets) {
      onLogged({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: updated,
      })
    }
  }

  const completed = sets.length >= exercise.sets

  return (
    <>
      <div className={`exercise-card${completed ? ' exercise-card--done' : ''}`}>
        <div className="exercise-card-header">
          <div className="exercise-card-title-row">
            <h3 className="exercise-name">{exercise.name}</h3>
            <button
              className="info-btn"
              onClick={() => setShowInstructions(true)}
              aria-label="View instructions"
            >
              ⓘ
            </button>
          </div>

          <div className="exercise-meta">
            <span className="exercise-sets-reps">
              {exercise.sets} × {exercise.reps}
            </span>
            {exercise.jointFlags.map((f) => (
              <JointFlag key={f} flag={f} />
            ))}
          </div>

          {lastExLog && (
            <div className="last-session-summary">
              Last: {lastExLog.sets.map((s) => `${s.reps}r@${s.weight}lb`).join(' · ')}
            </div>
          )}
        </div>

        <div className="exercise-sets">
          {Array.from({ length: exercise.sets }, (_, i) => i + 1).map((n) => (
            <SetLogger
              key={n}
              setNumber={n}
              existing={sets.find((s) => s.setNumber === n)}
              lastSet={lastExLog?.sets.find((s) => s.setNumber === n)}
              onSave={handleSetSave}
            />
          ))}
        </div>
      </div>

      {showInstructions && (
        <InstructionSheet exercise={exercise} onClose={() => setShowInstructions(false)} />
      )}
    </>
  )
}
