import type { DaySchedule } from '@/types'

export const WORKOUT_PROGRAM: DaySchedule[] = [
  {
    dayName: 'Monday',
    isRestDay: false,
    primarySession: {
      label: 'Push — Chest / Shoulders / Triceps',
      type: 'strength',
      exercises: [
        {
          id: 'incline-db-press',
          name: 'Incline Dumbbell Press',
          sets: 4,
          reps: '8–12',
          jointFlags: ['wrist'],
        },
        {
          id: 'machine-shoulder-press',
          name: 'Machine Shoulder Press',
          sets: 3,
          reps: '10–12',
          jointFlags: [],
        },
        {
          id: 'pec-deck',
          name: 'Pec Deck',
          sets: 3,
          reps: '12–15',
          jointFlags: [],
        },
        {
          id: 'cable-lateral-raise',
          name: 'Cable Lateral Raise',
          sets: 3,
          reps: '15–20',
          jointFlags: [],
        },
        {
          id: 'tricep-pushdown',
          name: 'Tricep Rope Pushdown',
          sets: 3,
          reps: '12–15',
          jointFlags: ['wrist'],
        },
      ],
    },
  },
  {
    dayName: 'Tuesday',
    isRestDay: false,
    primarySession: {
      label: 'Pull — Back / Biceps',
      type: 'strength',
      exercises: [
        {
          id: 'lat-pulldown',
          name: 'Lat Pulldown',
          sets: 4,
          reps: '8–12',
          jointFlags: [],
        },
        {
          id: 'seated-cable-row',
          name: 'Seated Cable Row',
          sets: 3,
          reps: '10–12',
          jointFlags: [],
        },
        {
          id: 'face-pull',
          name: 'Face Pull',
          sets: 3,
          reps: '15–20',
          jointFlags: [],
        },
        {
          id: 'incline-db-curl',
          name: 'Incline Dumbbell Curl',
          sets: 3,
          reps: '10–12',
          jointFlags: ['wrist'],
        },
        {
          id: 'hammer-curl',
          name: 'Hammer Curl',
          sets: 2,
          reps: '12–15',
          jointFlags: ['wrist'],
        },
      ],
    },
    secondarySession: {
      label: 'Zone 2 Cardio',
      type: 'zone2',
      exercises: [],
    },
  },
  {
    dayName: 'Wednesday',
    isRestDay: false,
    primarySession: {
      label: 'Legs',
      type: 'strength',
      exercises: [
        {
          id: 'leg-press',
          name: 'Leg Press',
          sets: 4,
          reps: '10–15',
          jointFlags: ['knee'],
        },
        {
          id: 'romanian-deadlift',
          name: 'Romanian Deadlift',
          sets: 3,
          reps: '10–12',
          jointFlags: ['hip'],
        },
        {
          id: 'leg-curl',
          name: 'Leg Curl',
          sets: 3,
          reps: '10–12',
          jointFlags: ['knee'],
        },
        {
          id: 'leg-extension',
          name: 'Leg Extension',
          sets: 3,
          reps: '12–15',
          jointFlags: ['knee'],
        },
        {
          id: 'seated-calf-raise',
          name: 'Seated Calf Raise',
          sets: 3,
          reps: '15–20',
          jointFlags: ['plantar-fasciitis'],
        },
      ],
    },
    secondarySession: {
      label: 'Zone 2 Cardio',
      type: 'zone2',
      exercises: [],
    },
  },
  {
    dayName: 'Thursday',
    isRestDay: false,
    primarySession: {
      label: 'Upper Hypertrophy',
      type: 'strength',
      exercises: [
        {
          id: 'cable-chest-fly',
          name: 'Cable Chest Fly',
          sets: 3,
          reps: '12–15',
          jointFlags: [],
        },
        {
          id: 'machine-row',
          name: 'Machine Row',
          sets: 4,
          reps: '10–12',
          jointFlags: [],
        },
        {
          id: 'arnold-press',
          name: 'Arnold Press',
          sets: 3,
          reps: '10–12',
          jointFlags: ['wrist'],
        },
        {
          id: 'overhead-tricep-ext',
          name: 'Overhead Tricep Extension',
          sets: 3,
          reps: '12–15',
          jointFlags: ['wrist'],
        },
        {
          id: 'cable-curl',
          name: 'Cable Curl',
          sets: 3,
          reps: '12–15',
          jointFlags: ['wrist'],
        },
      ],
    },
    secondarySession: {
      label: 'Zone 2 Cardio',
      type: 'zone2',
      exercises: [],
    },
  },
  {
    dayName: 'Friday',
    isRestDay: false,
    primarySession: {
      label: 'Lower / Core',
      type: 'strength',
      exercises: [
        {
          id: 'hip-thrust',
          name: 'Hip Thrust',
          sets: 4,
          reps: '10–12',
          jointFlags: ['hip'],
        },
        {
          id: 'goblet-squat',
          name: 'Goblet Squat',
          sets: 3,
          reps: '10–15',
          jointFlags: ['knee', 'hip'],
        },
        {
          id: 'nordic-curl',
          name: 'Nordic Curl',
          sets: 3,
          reps: '6–10',
          jointFlags: ['knee'],
        },
        {
          id: 'hip-abduction',
          name: 'Hip Abduction Machine',
          sets: 3,
          reps: '15–20',
          jointFlags: ['hip'],
        },
        {
          id: 'cable-crunch',
          name: 'Cable Crunch',
          sets: 3,
          reps: '12–15',
          jointFlags: [],
        },
      ],
    },
    secondarySession: {
      label: 'Zone 2 Cardio',
      type: 'zone2',
      exercises: [],
    },
  },
  {
    dayName: 'Saturday',
    isRestDay: true,
    primarySession: {
      label: 'Rest',
      type: 'rest',
      exercises: [],
    },
  },
  {
    dayName: 'Sunday',
    isRestDay: true,
    primarySession: {
      label: 'Rest',
      type: 'rest',
      exercises: [],
    },
  },
]

export function getTodaySchedule(): DaySchedule {
  const dayIndex = new Date().getDay()
  // Sunday=0 → index 6, Monday=1 → index 0, etc.
  const programIndex = dayIndex === 0 ? 6 : dayIndex - 1
  return WORKOUT_PROGRAM[programIndex]
}

export function getScheduleForDay(dayName: string): DaySchedule | undefined {
  return WORKOUT_PROGRAM.find((d) => d.dayName === dayName)
}
