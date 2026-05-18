import { useState } from 'react'
import { getTodaySchedule, WORKOUT_PROGRAM } from '@/data/workoutProgram'
import type { DayName } from '@/types'
import DayView from '@/components/DayView'

const DAY_NAMES: DayName[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
]

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function TodayPage() {
  const defaultSchedule = getTodaySchedule()
  const [selectedDay, setSelectedDay] = useState(defaultSchedule.dayName)

  const schedule = WORKOUT_PROGRAM.find((d) => d.dayName === selectedDay) ?? defaultSchedule
  const date = todayDateString()

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Today</h1>
        <select
          className="day-select"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value as DayName)}
        >
          {DAY_NAMES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <DayView schedule={schedule} date={date} />
    </div>
  )
}
