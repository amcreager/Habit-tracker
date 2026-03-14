import type { Habit } from '../types';

/** Returns the set of days considered "completed" for streak/summary purposes */
export function completedDays(habit: Habit): string[] {
  if (habit.target.type === 'check') return habit.completions;
  const target = habit.target.value ?? 1;
  return habit.logs.filter(l => l.value >= target).map(l => l.date);
}

/** Returns the logged value for a specific day (0 if none) */
export function dayLogValue(habit: Habit, date: string): number {
  return habit.logs.find(l => l.date === date)?.value ?? 0;
}

/** 0–1 progress toward the daily target */
export function dayProgress(habit: Habit, date: string): number {
  if (habit.target.type === 'check') return 0;
  const target = habit.target.value ?? 1;
  return Math.min(1, dayLogValue(habit, date) / target);
}

export function formatTarget(habit: Habit): string {
  if (habit.target.type === 'check') return '';
  const v = habit.target.value ?? 1;
  return habit.target.type === 'mins' ? `${v} min/day` : `${v}/day`;
}
