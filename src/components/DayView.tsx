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

export default function DayView({ schedule, date }: Props) {
  const sessions = getSessionsForDate(date)
  const primarySession = sessions.find((s) => s.sessionSlot === 'primary')
  const secondarySession = sessions.find((s) => s.sessionSlot === 'secondary')

  const { getMorning, getEvening } = useFreeExercises()
  const [secondaryView, setSecondaryView] = useState<SecondaryView>(
    schedule.secondarySession?.type === 'zone2' ? 'zone2' : 'morning',
  )

  const hasSecondarySlot = !!schedule.secondarySession
  const secondaryViewForSession = (s: WorkoutSession): SecondaryView => {
    if (s.sessionType === 'morning-free') return 'morning'
    if (s.sessionType === 'evening-free') return 'evening'
    return 'zone2'
  }

  const resolvedSecondaryView = secondarySession
    ? secondaryViewForSession(secondarySession)
    : secondaryView

  if (schedule.isRestDay) {
    return (
      <div className="day-view">
        <BodyweightWidget />
        <div className="rest-day-card">
          <p className="rest-day-title">Rest Day</p>
          <p className="text-secondary">Recovery is part of the program.</p>
        </div>
        <div className="free-session-section">
          <div className="secondary-tabs">
            <button
              className={`secondary-tab${secondaryView === 'morning' ? ' active' : ''}`}
              onClick={() => setSecondaryView('morning')}
            >
              Morning
            </button>
            <button
              className={`secondary-tab${secondaryView === 'evening' ? ' active' : ''}`}
              onClick={() => setSecondaryView('evening')}
            >
              Evening
            </button>
          </div>
          {secondaryView === 'morning' && (
            <FreeSession
              exercises={getMorning()}
              category="morning"
              date={date}
              dayName={schedule.dayName}
              existingSession={secondarySession?.sessionType === 'morning-free' ? secondarySession : undefined}
            />
          )}
          {secondaryView === 'evening' && (
            <FreeSession
              exercises={getEvening()}
              category="evening"
              date={date}
              dayName={schedule.dayName}
              existingSession={secondarySession?.sessionType === 'evening-free' ? secondarySession : undefined}
            />
          )}
        </div>
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

      {hasSecondarySlot && (
        <div className="secondary-session-section">
          <div className="secondary-tabs">
            <button
              className={`secondary-tab${resolvedSecondaryView === 'zone2' ? ' active' : ''}`}
              onClick={() => setSecondaryView('zone2')}
            >
              Zone 2
            </button>
            <button
              className={`secondary-tab${resolvedSecondaryView === 'morning' ? ' active' : ''}`}
              onClick={() => setSecondaryView('morning')}
            >
              Morning
            </button>
            <button
              className={`secondary-tab${resolvedSecondaryView === 'evening' ? ' active' : ''}`}
              onClick={() => setSecondaryView('evening')}
            >
              Evening
            </button>
          </div>

          {resolvedSecondaryView === 'zone2' && <Zone2Card />}
          {resolvedSecondaryView === 'morning' && (
            <FreeSession
              exercises={getMorning()}
              category="morning"
              date={date}
              dayName={schedule.dayName}
              existingSession={secondarySession?.sessionType === 'morning-free' ? secondarySession : undefined}
            />
          )}
          {resolvedSecondaryView === 'evening' && (
            <FreeSession
              exercises={getEvening()}
              category="evening"
              date={date}
              dayName={schedule.dayName}
              existingSession={secondarySession?.sessionType === 'evening-free' ? secondarySession : undefined}
            />
          )}
        </div>
      )}
    </div>
  )
}
