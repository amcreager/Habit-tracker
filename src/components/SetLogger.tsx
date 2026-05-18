import { useState } from 'react'
import type { SetLog } from '@/types'

interface Props {
  setNumber: number
  existing?: SetLog
  lastSet?: SetLog
  onSave: (set: SetLog) => void
}

export default function SetLogger({ setNumber, existing, lastSet, onSave }: Props) {
  const [reps, setReps] = useState(existing ? String(existing.reps) : '')
  const [weight, setWeight] = useState(existing ? String(existing.weight) : '')
  const [saved, setSaved] = useState(!!existing)

  function handleSave() {
    const r = parseInt(reps)
    const w = parseFloat(weight)
    if (isNaN(r) || isNaN(w)) return
    onSave({ setNumber, reps: r, weight: w })
    setSaved(true)
  }

  function handleEdit() {
    setSaved(false)
  }

  return (
    <div className={`set-row${saved ? ' set-row--saved' : ''}`}>
      <span className="set-number">Set {setNumber}</span>

      {lastSet && !saved && (
        <span className="set-last-hint">
          {lastSet.reps}r @ {lastSet.weight}lb
        </span>
      )}

      <input
        className="set-input"
        type="text"
        inputMode="numeric"
        placeholder="Reps"
        value={reps}
        onChange={(e) => {
          setReps(e.target.value)
          setSaved(false)
        }}
        disabled={saved}
        aria-label={`Set ${setNumber} reps`}
      />

      <input
        className="set-input"
        type="text"
        inputMode="decimal"
        placeholder="lbs"
        value={weight}
        onChange={(e) => {
          setWeight(e.target.value)
          setSaved(false)
        }}
        disabled={saved}
        aria-label={`Set ${setNumber} weight`}
      />

      {saved ? (
        <button className="set-btn set-btn--edit" onClick={handleEdit}>
          Edit
        </button>
      ) : (
        <button
          className="set-btn set-btn--save"
          onClick={handleSave}
          disabled={!reps || !weight}
        >
          ✓
        </button>
      )}
    </div>
  )
}
