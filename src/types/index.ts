export type JointFlag = 'wrist' | 'knee' | 'hip' | 'plantar-fasciitis'

export interface SetLog {
  setNumber: number
  reps: number
  weight: number
}

export interface ExerciseLog {
  exerciseId: string
  exerciseName: string
  sets: SetLog[]
}

export type SessionType = 'planned' | 'morning-free' | 'evening-free'
export type SessionSlot = 'primary' | 'secondary'
export type DayName =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'

export interface WorkoutSession {
  id: string
  date: string
  sessionType: SessionType
  dayName: DayName
  sessionSlot: SessionSlot
  exercises: ExerciseLog[]
  synced: boolean
  syncedAt?: string
}

export interface BodyweightEntry {
  date: string
  weight: number
}

export interface FreeExercise {
  id: string
  name: string
  category: 'morning' | 'evening'
  order: number
}

export interface GoogleTokens {
  access_token: string
  refresh_token: string
  expires_at: number
}

export interface PlannedExercise {
  id: string
  name: string
  sets: number
  reps: string
  jointFlags: JointFlag[]
}

export type SessionTemplateType = 'strength' | 'zone2' | 'rest'

export interface SessionTemplate {
  label: string
  type: SessionTemplateType
  exercises: PlannedExercise[]
}

export interface DaySchedule {
  dayName: DayName
  isRestDay: boolean
  primarySession: SessionTemplate
  secondarySession?: SessionTemplate
}

export interface ExerciseInstructions {
  setup: string
  execution: string
  breathing: string
  keyCues: string[]
  commonMistakes: string[]
  adamsNotes?: string
}

export interface Zone2Workout {
  date: string
  durationMinutes: number
  avgHeartRate: number
  calories: number
  activityType: string
}
