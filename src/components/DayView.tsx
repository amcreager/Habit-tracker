import { useState } from 'react'
import type { DaySchedule, WorkoutSession } from '@/types'
import { getSessionsForDate } from '@/lib/storage'
import BodyweightWidget from '@/components/BodyweightWidget'
import PlannedSession from '@/components/PlannedSession'
import FreeSession from '@/components/FreeSession'
import Zone2Card from '@/components/Zone2Card'
import { useFreeExercises } from '@/hooks/useFreeExercises'

interface Props {
  schedule: DaySchedule
  date: string
}

type SecondaryView = 'zone2' | 'morning' | 'evening'

function resolveExistingView(s: WorkoutSession): SecondaryView {
  if (s.sessionType === 'morning-free') return 'morning'
  if (s.sessionType === 'evening-free') return 'evening'
  return 'zone2'
}

export default function DayView({ schedule, date }: Props) {
  const sessions = getSessionsForDate(date)
  const primarySession = sessions.find((s) => s.sessionSlot === 'primary')
  const secondarySession = sessions.find((s) => s.sessionSlot === 'secondary')

  const hasZone2 = schedule.secondarySession?.type === 'zone2'

  const [secondaryView, setSecondaryView] = useState<SecondaryView>(() => {
    if (secondarySession) return resolveExistingView(secondarySession)
    return hasZone2 ? 'zone2' : 'morning'
  })

  const { getMorning, getEvening } = useFreeExercises()

  if (schedule.isRestDay) {
    return (
      <div className="day-view">
        <BodyweightWidget />
        <div className="rest-day-card">
          <p className="rest-day-title">Rest Day</p>
          <p className="text-secondary">Recovery is part of the program.</p>
        </div>
        <SecondarySection
          view={secondaryView}
          setView={setSecondaryView}
          hasZone2={false}
          date={date}
          dayName={schedule.dayName}
          secondarySession={secondarySession}
          getMorning={getMorning}
          getEvening={getEvening}
        />
      </div>
    )
  }

  return (
    <div className="day-view">
      <BodyweightWidget />

      <PlannedSession
        template={schedule.primarySession}
        date={date}
        dayName={schedule.dayName}
        slot="primary"
        existingSession={primarySession}
      />

      <div className="secondary-session-section">
        <SecondarySection
          view={secondaryView}
          setView={setSecondaryView}
          hasZone2={hasZone2}
          date={date}
          dayName={schedule.dayName}
          secondarySession={secondarySession}
          getMorning={getMorning}
          getEvening={getEvening}
        />
      </div>
    </div>
  )
}

interface SecondarySectionProps {
  view: SecondaryView
  setView: (v: SecondaryView) => void
  hasZone2: boolean
  date: string
  dayName: DaySchedule['dayName']
  secondarySession: WorkoutSession | undefined
  getMorning: () => import('@/types').FreeExercise[]
  getEvening: () => import('@/types').FreeExercise[]
}

function SecondarySection({
  view, setView, hasZone2, date, dayName, secondarySession, getMorning, getEvening,
}: SecondarySectionProps) {
  return (
    <>
      <div className="secondary-tabs">
        {hasZone2 && (
          <button
            className={`secondary-tab${view === 'zone2' ? ' active' : ''}`}
            onClick={() => setView('zone2')}
          >
            Zone 2
          </button>
        )}
        <button
          className={`secondary-tab${view === 'morning' ? ' active' : ''}`}
          onClick={() => setView('morning')}
        >
          Morning
        </button>
        <button
          className={`secondary-tab${view === 'evening' ? ' active' : ''}`}
          onClick={() => setView('evening')}
        >
          Evening
        </button>
      </div>

      {view === 'zone2' && hasZone2 && <Zone2Card />}
      {view === 'morning' && (
        <FreeSession
          exercises={getMorning()}
          category="morning"
          date={date}
          dayName={dayName}
          existingSession={secondarySession?.sessionType === 'morning-free' ? secondarySession : undefined}
        />
      )}
      {view === 'evening' && (
        <FreeSession
          exercises={getEvening()}
          category="evening"
          date={date}
          dayName={dayName}
          existingSession={secondarySession?.sessionType === 'evening-free' ? secondarySession : undefined}
        />
      )}
    </>
  )
}
