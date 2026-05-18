import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useBodyweight } from '@/hooks/useBodyweight'

export default function BodyweightChart() {
  const { entries } = useBodyweight()

  const data = useMemo(
    () =>
      [...entries]
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30)
        .map((e) => ({ date: e.date.slice(5), weight: e.weight })),
    [entries],
  )

  if (data.length < 2) {
    return (
      <div className="chart-card">
        <h2 className="section-title">Bodyweight</h2>
        <p className="text-secondary">Log at least 2 entries to see your chart.</p>
      </div>
    )
  }

  return (
    <div className="chart-card">
      <h2 className="section-title">Bodyweight (lbs)</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ background: '#1c1c1c', border: '1px solid #2a2a2a', color: '#f5f5f5' }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#4ade80' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
