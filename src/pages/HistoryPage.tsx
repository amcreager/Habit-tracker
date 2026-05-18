import { useWorkoutSessions } from '@/hooks/useWorkoutSessions'
import ExerciseHistory from '@/components/ExerciseHistory'

export default function HistoryPage() {
  const { sessions } = useWorkoutSessions()

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">History</h1>
        <span className="page-subtitle">{sessions.length} sessions</span>
      </div>

      <ExerciseHistory sessions={sessions} />
    </div>
  )
}
