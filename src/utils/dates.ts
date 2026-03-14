import type { Frequency } from '../types';

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d + n).toISOString().slice(0, 10);
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(today(), i - 6));
}

/** 0=Mon … 6=Sun */
export function getDow(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  const js = new Date(y, m - 1, d).getDay();
  return js === 0 ? 6 : js - 1;
}

export function getWeekStart(date: string): string {
  return addDays(date, -getDow(date));
}

export function isWeekday(date: string): boolean {
  return getDow(date) < 5;
}

export function isWeekend(date: string): boolean {
  return getDow(date) >= 5;
}

export function isExpectedDay(date: string, freq: Frequency): boolean {
  if (typeof freq === 'object') return true;
  if (freq === 'daily') return true;
  if (freq === 'weekdays') return isWeekday(date);
  if (freq === 'weekends') return isWeekend(date);
  return true;
}

export function calcCurrentStreak(completions: string[], frequency: Frequency): number {
  if (typeof frequency === 'object') {
    return calcTimesPerWeekStreak(completions, frequency.times);
  }
  const set = new Set(completions);
  let cursor = today();
  let back = 0;
  while (!isExpectedDay(cursor, frequency) && back < 7) {
    cursor = addDays(cursor, -1);
    back++;
  }
  if (!set.has(cursor)) {
    cursor = addDays(cursor, -1);
    back = 0;
    while (!isExpectedDay(cursor, frequency) && back < 7) {
      cursor = addDays(cursor, -1);
      back++;
    }
  }
  let streak = 0;
  for (let i = 0; i < 366; i++) {
    if (isExpectedDay(cursor, frequency)) {
      if (set.has(cursor)) streak++;
      else break;
    }
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function calcTimesPerWeekStreak(completions: string[], times: number): number {
  const set = new Set(completions);
  let streak = 0;
  let weekStart = getWeekStart(today());
  let firstWeek = true;
  for (let w = 0; w < 52; w++) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const done = days.filter(d => set.has(d)).length;
    if (done >= times) {
      streak++;
    } else if (firstWeek) {
      weekStart = addDays(weekStart, -7);
      firstWeek = false;
      continue;
    } else {
      break;
    }
    firstWeek = false;
    weekStart = addDays(weekStart, -7);
  }
  return streak;
}

export function calcBestStreak(completions: string[], frequency: Frequency): number {
  if (completions.length === 0) return 0;
  if (typeof frequency === 'object') {
    const set = new Set(completions);
    const sorted = [...completions].sort();
    if (!sorted.length) return 0;
    let best = 0, current = 0;
    let weekStart = getWeekStart(sorted[0]);
    const lastWeek = getWeekStart(today());
    while (weekStart <= lastWeek) {
      const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
      const done = days.filter(d => set.has(d)).length;
      if (done >= frequency.times) { current++; best = Math.max(best, current); }
      else current = 0;
      weekStart = addDays(weekStart, 7);
    }
    return best;
  }
  const set = new Set(completions);
  const sorted = [...completions].filter(d => isExpectedDay(d, frequency)).sort();
  if (!sorted.length) return 0;
  let best = 0, current = 0;
  let cursor = sorted[0];
  const t = today();
  while (cursor <= t) {
    if (isExpectedDay(cursor, frequency)) {
      if (set.has(cursor)) { current++; best = Math.max(best, current); }
      else current = 0;
    }
    cursor = addDays(cursor, 1);
  }
  return best;
}

export function formatFrequency(freq: Frequency): string {
  if (freq === 'daily') return 'Daily';
  if (freq === 'weekdays') return 'Weekdays';
  if (freq === 'weekends') return 'Weekends';
  return `${(freq as { times: number }).times}× /wk`;
}

export function streakLabel(freq: Frequency): string {
  return typeof freq === 'object' ? 'wk' : 'd';
}
