import { useState } from 'react'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { useFreeExercises } from '@/hooks/useFreeExercises'
import ConnectGoogle from '@/components/ConnectGoogle'

export default function SettingsPage() {
  const { isConnected, disconnect } = useGoogleAuth()
  const { getMorning, getEvening, add, remove } = useFreeExercises()
  const [newMorning, setNewMorning] = useState('')
  const [newEvening, setNewEvening] = useState('')

  function handleAddMorning() {
    const name = newMorning.trim()
    if (!name) return
    add(name, 'morning')
    setNewMorning('')
  }

  function handleAddEvening() {
    const name = newEvening.trim()
    if (!name) return
    add(name, 'evening')
    setNewEvening('')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      <section className="settings-section">
        <h2 className="settings-section-title">Google Account</h2>
        {isConnected ? (
          <div className="google-connected">
            <span className="connected-badge">Connected</span>
            <button className="disconnect-btn" onClick={disconnect}>
              Disconnect
            </button>
          </div>
        ) : (
          <ConnectGoogle />
        )}
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Morning Free Exercises</h2>
        <ul className="free-exercise-list">
          {getMorning().map((ex) => (
            <li key={ex.id} className="free-exercise-item">
              <span>{ex.name}</span>
              <button className="remove-exercise-btn" onClick={() => remove(ex.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
        <div className="add-exercise-row">
          <input
            className="add-exercise-input"
            type="text"
            placeholder="Exercise name"
            value={newMorning}
            onChange={(e) => setNewMorning(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMorning()}
          />
          <button className="add-exercise-btn" onClick={handleAddMorning} disabled={!newMorning.trim()}>
            Add
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Evening Free Exercises</h2>
        <ul className="free-exercise-list">
          {getEvening().map((ex) => (
            <li key={ex.id} className="free-exercise-item">
              <span>{ex.name}</span>
              <button className="remove-exercise-btn" onClick={() => remove(ex.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
        <div className="add-exercise-row">
          <input
            className="add-exercise-input"
            type="text"
            placeholder="Exercise name"
            value={newEvening}
            onChange={(e) => setNewEvening(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddEvening()}
          />
          <button className="add-exercise-btn" onClick={handleAddEvening} disabled={!newEvening.trim()}>
            Add
          </button>
        </div>
      </section>
    </div>
  )
}
