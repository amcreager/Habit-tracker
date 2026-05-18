import { useMemo } from 'react'
import { getSessions } from '@/lib/storage'

export default function WeeklySummary() {
  const summary = useMemo(() => {
    const sessions = getSessions()
    const now = new Date()
    const monday = new Date(now)
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
    monday.setHours(0, 0, 0, 0)

    const weekStr = monday.toISOString().slice(0, 10)
    const thisWeek = sessions.filter((s) => s.date >= weekStr)

    const strengthCount = thisWeek.filter((s) => s.sessionType === 'planned').length
    const freeCount = thisWeek.filter(
      (s) => s.sessionType === 'morning-free' || s.sessionType === 'evening-free',
    ).length
    const totalSets = thisWeek.reduce(
      (sum, s) => sum + s.exercises.reduce((ex, e) => ex + e.sets.length, 0),
      0,
    )

    return { strengthCount, freeCount, totalSets, total: thisWeek.length }
  }, [])

  return (
    <div className="weekly-summary">
      <h2 className="section-title">This Week</h2>
      <div className="summary-grid">
        <div className="summary-stat">
          <span className="summary-number">{summary.strengthCount}</span>
          <span className="summary-label">Strength</span>
        </div>
        <div className="summary-stat">
          <span className="summary-number">{summary.freeCount}</span>
          <span className="summary-label">Free</span>
        </div>
        <div className="summary-stat">
          <span className="summary-number">{summary.totalSets}</span>
          <span className="summary-label">Sets</span>
        </div>
        <div className="summary-stat">
          <span className="summary-number">{summary.total}</span>
          <span className="summary-label">Total</span>
        </div>
      </div>
    </div>
  )
}
