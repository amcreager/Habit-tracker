import { useEffect } from 'react'
import type { PlannedExercise } from '@/types'
import { EXERCISE_INSTRUCTIONS } from '@/data/exerciseInstructions'
import JointFlag from '@/components/JointFlag'

interface Props {
  exercise: PlannedExercise
  onClose: () => void
}

export default function InstructionSheet({ exercise, onClose }: Props) {
  const instructions = EXERCISE_INSTRUCTIONS[exercise.id]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="instruction-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div className="sheet-header">
          <h2 className="sheet-title">{exercise.name}</h2>
          <button className="sheet-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {exercise.jointFlags.length > 0 && (
          <div className="sheet-flags">
            {exercise.jointFlags.map((f) => (
              <JointFlag key={f} flag={f} />
            ))}
          </div>
        )}

        {!instructions ? (
          <p className="text-secondary" style={{ padding: '1rem 0' }}>
            No instructions available for this exercise.
          </p>
        ) : (
          <div className="sheet-body">
            <section className="instruction-section">
              <h3>Setup</h3>
              <p>{instructions.setup}</p>
            </section>

            <section className="instruction-section">
              <h3>Execution</h3>
              <p>{instructions.execution}</p>
            </section>

            <section className="instruction-section">
              <h3>Breathing</h3>
              <p>{instructions.breathing}</p>
            </section>

            <section className="instruction-section">
              <h3>Key Cues</h3>
              <ul className="cue-list">
                {instructions.keyCues.map((cue, i) => (
                  <li key={i}>{cue}</li>
                ))}
              </ul>
            </section>

            <section className="instruction-section">
              <h3>Common Mistakes</h3>
              <ul className="mistakes-list">
                {instructions.commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </section>

            {instructions.adamsNotes && (
              <div className="adams-notes">
                <div className="adams-notes-label">Adam's Notes</div>
                <p>{instructions.adamsNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
