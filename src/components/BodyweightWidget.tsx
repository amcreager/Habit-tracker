import { useState } from 'react'
import { useBodyweight } from '@/hooks/useBodyweight'

export default function BodyweightWidget() {
  const { todayEntry, logBodyweight } = useBodyweight()
  const [value, setValue] = useState(todayEntry ? String(todayEntry.weight) : '')
  const [saved, setSaved] = useState(!!todayEntry)

  async function handleSave() {
    const w = parseFloat(value)
    if (isNaN(w) || w <= 0) return
    await logBodyweight(w)
    setSaved(true)
  }

  return (
    <div className="bodyweight-widget">
      <span className="bodyweight-label">Bodyweight</span>

      {saved && todayEntry ? (
        <div className="bodyweight-saved">
          <span className="bodyweight-value">{todayEntry.weight} lbs</span>
          <button
            className="bodyweight-edit-btn"
            onClick={() => {
              setSaved(false)
              setValue(String(todayEntry.weight))
            }}
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="bodyweight-input-row">
          <input
            className="bodyweight-input"
            type="text"
            inputMode="decimal"
            placeholder="lbs"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            className="bodyweight-save-btn"
            onClick={() => void handleSave()}
            disabled={!value}
          >
            Log
          </button>
        </div>
      )}
    </div>
  )
}
