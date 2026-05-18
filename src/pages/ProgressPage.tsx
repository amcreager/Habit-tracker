import WeeklySummary from '@/components/WeeklySummary'
import BodyweightChart from '@/components/BodyweightChart'
import ExerciseChart from '@/components/ExerciseChart'

export default function ProgressPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Progress</h1>
      </div>

      <WeeklySummary />
      <BodyweightChart />
      <ExerciseChart />
    </div>
  )
}
