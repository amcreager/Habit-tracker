import type { Zone2Workout } from '@/types'

const ACTIVITY_TYPES: Record<number, string> = {
  1: 'Biking',
  7: 'Walking',
  8: 'Running',
  56: 'Light workout',
  93: 'Indoor cycling',
}

const TARGET_ACTIVITY_TYPES = new Set(Object.keys(ACTIVITY_TYPES).map(Number))

interface FitBucket {
  startTimeMillis: string
  endTimeMillis: string
  dataset: FitDataset[]
}

interface FitDataset {
  dataSourceId: string
  point: FitPoint[]
}

interface FitPoint {
  value: FitValue[]
  startTimeNanos?: string
  endTimeNanos?: string
}

interface FitValue {
  intVal?: number
  fpVal?: number
}

export async function fetchZone2Workouts(accessToken: string): Promise<Zone2Workout[]> {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const now = Date.now()

  const body = {
    startTimeMillis: thirtyDaysAgo,
    endTimeMillis: now,
    bucketBySession: {},
    aggregateBy: [
      { dataTypeName: 'com.google.activity.segment' },
      { dataTypeName: 'com.google.heart_rate.bpm' },
      { dataTypeName: 'com.google.calories.expended' },
    ],
  }

  const response = await fetch(
    'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )

  if (!response.ok) {
    throw new Error(`Google Fit API error: ${response.status}`)
  }

  const data = (await response.json()) as { bucket: FitBucket[] }
  const workouts: Zone2Workout[] = []

  for (const bucket of data.bucket ?? []) {
    let activityType: string | undefined
    let avgHeartRate = 0
    let calories = 0

    for (const dataset of bucket.dataset) {
      if (dataset.dataSourceId.includes('activity.segment')) {
        const typeId = dataset.point[0]?.value[0]?.intVal
        if (typeId !== undefined && TARGET_ACTIVITY_TYPES.has(typeId)) {
          activityType = ACTIVITY_TYPES[typeId]
        }
      }

      if (dataset.dataSourceId.includes('heart_rate.bpm')) {
        const hrValues = dataset.point.flatMap((p) => p.value.map((v) => v.fpVal ?? 0))
        if (hrValues.length > 0) {
          avgHeartRate = Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length)
        }
      }

      if (dataset.dataSourceId.includes('calories.expended')) {
        calories = Math.round(
          dataset.point.reduce((sum, p) => sum + (p.value[0]?.fpVal ?? 0), 0),
        )
      }
    }

    if (!activityType) continue

    const startMs = parseInt(bucket.startTimeMillis)
    const endMs = parseInt(bucket.endTimeMillis)
    const durationMinutes = Math.round((endMs - startMs) / 60000)

    if (durationMinutes < 5) continue

    workouts.push({
      date: new Date(startMs).toISOString().slice(0, 10),
      durationMinutes,
      avgHeartRate,
      calories,
      activityType,
    })
  }

  return workouts.sort((a, b) => b.date.localeCompare(a.date))
}
