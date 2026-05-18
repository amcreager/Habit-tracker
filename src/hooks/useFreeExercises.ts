import { useCallback, useState } from 'react'
import type { FreeExercise } from '@/types'
import {
  getFreeExercises,
  saveFreeExercises,
  addFreeExercise,
  deleteFreeExercise,
} from '@/lib/storage'

export function useFreeExercises() {
  const [exercises, setExercises] = useState<FreeExercise[]>(() => getFreeExercises())

  const reload = useCallback(() => {
    setExercises(getFreeExercises())
  }, [])

  const add = useCallback(
    (name: string, category: 'morning' | 'evening') => {
      addFreeExercise(name, category)
      reload()
    },
    [reload],
  )

  const remove = useCallback(
    (id: string) => {
      deleteFreeExercise(id)
      reload()
    },
    [reload],
  )

  const reorder = useCallback(
    (reordered: FreeExercise[]) => {
      saveFreeExercises(reordered)
      reload()
    },
    [reload],
  )

  const getMorning = useCallback(
    () => exercises.filter((e) => e.category === 'morning').sort((a, b) => a.order - b.order),
    [exercises],
  )

  const getEvening = useCallback(
    () => exercises.filter((e) => e.category === 'evening').sort((a, b) => a.order - b.order),
    [exercises],
  )

  return { exercises, add, remove, reorder, getMorning, getEvening, reload }
}
