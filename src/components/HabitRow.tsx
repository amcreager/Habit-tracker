import type { Habit } from '../types';
import { today, formatDate, calcCurrentStreak, calcBestStreak } from '../utils/dates';

interface Props {
  habit: Habit;
  days: string[];
  onToggle: (id: string, date: string) => void;
  onRemove: (id: string) => void;
}

export function HabitRow({ habit, days, onToggle, onRemove }: Props) {
  const currentStreak = calcCurrentStreak(habit.completions);
  const bestStreak = calcBestStreak(habit.completions);
  const t = today();
  const doneToday = habit.completions.includes(t);

  return (
    <div className={`habit-row ${doneToday ? 'done-today' : ''}`}>
      <div className="habit-info">
        <span className="habit-dot" style={{ background: habit.color }} />
        <span className="habit-name">{habit.name}</span>
        <button
          className="remove-btn"
          onClick={() => onRemove(habit.id)}
          title="Delete habit"
          aria-label="Delete habit"
        >
          ×
        </button>
      </div>

      <div className="habit-days">
        {days.map((day) => {
          const done = habit.completions.includes(day);
          const isToday = day === t;
          return (
            <button
              key={day}
              className={`day-cell ${done ? 'day-done' : ''} ${isToday ? 'day-today' : ''}`}
              style={done ? { background: habit.color, borderColor: habit.color } : undefined}
              onClick={() => onToggle(habit.id, day)}
              title={formatDate(day)}
              aria-label={`${done ? 'Uncheck' : 'Check'} ${habit.name} for ${formatDate(day)}`}
            >
              {done && <span className="check">✓</span>}
            </button>
          );
        })}
      </div>

      <div className="habit-streaks">
        <span className="streak" title="Current streak">
          🔥 {currentStreak}
        </span>
        <span className="streak best" title="Best streak">
          ⭐ {bestStreak}
        </span>
      </div>
    </div>
  );
}
