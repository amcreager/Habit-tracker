import type { Habit } from '../types';
import { today, addDays, getWeekStart, formatDate } from '../utils/dates';
import { completedDays } from '../utils/habit';

const WEEKS = 16;
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface Props {
  habit: Habit;
}

export function HeatmapView({ habit }: Props) {
  const set = new Set(completedDays(habit));
  const t = today();
  const startMonday = getWeekStart(addDays(t, -(WEEKS - 1) * 7));

  const weeks: string[][] = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(startMonday, w * 7 + d))
  );

  const totalDone = completedDays(habit).length;
  const last30 = Array.from({ length: 30 }, (_, i) =>
    addDays(t, i - 29)
  ).filter(d => set.has(d)).length;

  return (
    <div className="heatmap-section">
      <div className="heatmap-stats-row">
        <div className="heatmap-stat">
          <span className="heatmap-stat-value">{totalDone}</span>
          <span className="heatmap-stat-label">total</span>
        </div>
        <div className="heatmap-stat">
          <span className="heatmap-stat-value">{last30}</span>
          <span className="heatmap-stat-label">last 30d</span>
        </div>
        <div className="heatmap-stat">
          <span className="heatmap-stat-value">
            {totalDone > 0
              ? Math.round(
                  (totalDone /
                    Math.max(
                      1,
                      Math.ceil(
                        (new Date(t).getTime() -
                          new Date(habit.createdAt).getTime()) /
                          86_400_000
                      )
                    )) *
                    100
                )
              : 0}
            %
          </span>
          <span className="heatmap-stat-label">completion</span>
        </div>
      </div>

      <div className="heatmap-wrap">
        <div className="heatmap-days-col">
          {DAY_LABELS.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
        <div className="heatmap-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="heatmap-col">
              {week.map(day => {
                const done = set.has(day);
                const future = day > t;
                return (
                  <div
                    key={day}
                    className={`heatmap-cell ${done ? 'done' : ''} ${future ? 'future' : ''}`}
                    style={done ? { background: habit.color } : undefined}
                    title={formatDate(day)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
