export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function addDays(date: string, n: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const d = new Date(year, month - 1, day + n);
  return d.toISOString().slice(0, 10);
}

export function getLast7Days(): string[] {
  const result: string[] = [];
  for (let i = 6; i >= 0; i--) {
    result.push(addDays(today(), -i));
  }
  return result;
}

export function calcCurrentStreak(completions: string[]): number {
  const set = new Set(completions);
  const t = today();
  let streak = 0;
  let cursor = t;
  // If today not done, start checking from yesterday
  if (!set.has(cursor)) {
    cursor = addDays(cursor, -1);
  }
  while (set.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function calcBestStreak(completions: string[]): number {
  if (completions.length === 0) return 0;
  const sorted = [...completions].sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (addDays(sorted[i - 1], 1) === sorted[i]) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
}
