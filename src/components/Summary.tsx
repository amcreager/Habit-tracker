import type { Habit } from '../types';
import { today, calcCurrentStreak } from '../utils/dates';
import { completedDays } from '../utils/habit';

interface Props {
  habits: Habit[];
}

export function Summary({ habits }: Props) {
  if (habits.length === 0) return null;
  const t = today();
  const doneCount = habits.filter(h => completedDays(h).includes(t)).length;
  const total = habits.length;
  const pct = Math.round((doneCount / total) * 100);
  const longestStreak = Math.max(
    0,
    ...habits.map(h => calcCurrentStreak(completedDays(h), h.frequency))
  );

  return (
    <div className="summary">
      <div className="summary-card">
        <span className="summary-value">
          {doneCount}/{total}
        </span>
        <span className="summary-label">Done today</span>
      </div>
      <div className="summary-card">
        <span className="summary-value">{pct}%</span>
        <span className="summary-label">Completion</span>
      </div>
      <div className="summary-card">
        <span className="summary-value">🔥 {longestStreak}</span>
        <span className="summary-label">Top streak</span>
      </div>
    </div>
  );
}
