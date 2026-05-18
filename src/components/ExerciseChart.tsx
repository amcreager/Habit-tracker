import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { getSessions } from '@/lib/storage'
import { WORKOUT_PROGRAM } from '@/data/workoutProgram'

const ALL_EXERCISES = WORKOUT_PROGRAM.flatMap((d) => d.primarySession.exercises).filter(
  (ex, idx, arr) => arr.findIndex((e) => e.id === ex.id) === idx,
)

export default function ExerciseChart() {
  const [selectedId, setSelectedId] = useState(ALL_EXERCISES[0]?.id ?? '')

  const data = useMemo(() => {
    const sessions = getSessions()
    const points: { date: string; maxWeight: number }[] = []

    for (const session of sessions) {
      const exLog = session.exercises.find((e) => e.exerciseId === selectedId)
      if (!exLog) continue
      const maxWeight = Math.max(...exLog.sets.map((s) => s.weight))
      points.push({ date: session.date.slice(5), maxWeight })
    }

    return points.sort((a, b) => a.date.localeCompare(b.date)).slice(-20)
  }, [selectedId])

  return (
    <div className="chart-card">
      <h2 className="section-title">Exercise Progress</h2>

      <select
        className="exercise-select"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {ALL_EXERCISES.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>

      {data.length < 2 ? (
        <p className="text-secondary" style={{ marginTop: '1rem' }}>
          Log at least 2 sessions to see progress.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                background: '#1c1c1c',
                border: '1px solid #2a2a2a',
                color: '#f5f5f5',
              }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value: number) => [`${value} lbs`, 'Max Weight']}
            />
            <Line
              type="monotone"
              dataKey="maxWeight"
              stroke="#4ade80"
              strokeWidth={2}
              dot={{ r: 3, fill: '#4ade80' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
