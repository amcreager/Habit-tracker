import { useState } from 'react';
import type { Habit } from '../types';
import { today, isExpectedDay } from '../utils/dates';
import { completedDays } from '../utils/habit';

interface Props {
  habits: Habit[];
}

function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

/** 0=Mon…6=Sun JS-style */
function dowMon(date: string): number {
  const d = new Date(date + 'T12:00:00').getDay();
  return d === 0 ? 6 : d - 1;
}

function pctColor(pct: number): string {
  if (pct === 0) return 'var(--border)';
  if (pct < 40) return '#ef4444';
  if (pct < 70) return '#f59e0b';
  if (pct < 100) return '#22c55e';
  return '#6366f1';
}

export function MonthlyReview({ habits }: Props) {
  const t = today();
  const now = new Date(t + 'T12:00:00');
  const [monthOffset, setMonthOffset] = useState(0);

  const year = now.getFullYear();
  const month = new Date(year, now.getMonth() + monthOffset, 1);
  const displayYear = month.getFullYear();
  const displayMonth = month.getMonth();

  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(displayYear, displayMonth);
  const isFutureMonth = month > now;

  // Precompute completed sets per habit
  const completedSets = habits.map(h => new Set(completedDays(h)));

  // For each day, compute % of expected habits completed
  function getDayStats(date: string): { pct: number; done: number; expected: number } | null {
    if (date > t) return null; // future
    const expected = habits.filter(h => isExpectedDay(date, h.frequency));
    if (expected.length === 0) return null;
    const done = expected.filter((h) => {
      const idx = habits.indexOf(h);
      return completedSets[idx].has(date);
    }).length;
    return { pct: Math.round((done / expected.length) * 100), done, expected: expected.length };
  }

  // Summary stats
  const pastDays = days.filter(d => d <= t);
  const statsPerDay = pastDays.map(d => getDayStats(d)).filter(Boolean) as { pct: number; done: number; expected: number }[];
  const avgPct = statsPerDay.length
    ? Math.round(statsPerDay.reduce((s, x) => s + x.pct, 0) / statsPerDay.length)
    : 0;
  const perfectDays = statsPerDay.filter(x => x.pct === 100).length;
  const zeroDays = statsPerDay.filter(x => x.pct === 0).length;

  // Build calendar grid: pad start to Monday
  const firstDow = dowMon(days[0]);
  const calDays: (string | null)[] = [
    ...Array(firstDow).fill(null),
    ...days,
  ];
  // Pad end to full weeks
  while (calDays.length % 7 !== 0) calDays.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < calDays.length; i += 7) weeks.push(calDays.slice(i, i + 7));

  const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="monthly-review">
      {/* Month navigation */}
      <div className="monthly-nav">
        <button className="monthly-nav-btn" onClick={() => setMonthOffset(o => o - 1)}>‹</button>
        <span className="monthly-nav-label">{monthLabel}</span>
        <button
          className="monthly-nav-btn"
          onClick={() => setMonthOffset(o => o + 1)}
          disabled={monthOffset >= 0}
        >›</button>
      </div>

      {/* Summary cards */}
      {!isFutureMonth && statsPerDay.length > 0 && (
        <div className="monthly-stats">
          <div className="monthly-stat-card">
            <span className="monthly-stat-value">{avgPct}%</span>
            <span className="monthly-stat-label">Avg / day</span>
          </div>
          <div className="monthly-stat-card">
            <span className="monthly-stat-value" style={{ color: '#6366f1' }}>{perfectDays}</span>
            <span className="monthly-stat-label">Perfect days</span>
          </div>
          <div className="monthly-stat-card">
            <span className="monthly-stat-value" style={{ color: '#ef4444' }}>{zeroDays}</span>
            <span className="monthly-stat-label">Missed days</span>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="monthly-calendar">
        {/* Day of week headers */}
        <div className="monthly-dow-row">
          {DOW.map(d => <span key={d} className="monthly-dow">{d}</span>)}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="monthly-week-row">
            {week.map((day, di) => {
              if (!day) return <div key={di} className="monthly-day-cell empty" />;
              const stats = getDayStats(day);
              const isToday = day === t;
              const dayNum = parseInt(day.slice(8));
              return (
                <div
                  key={day}
                  className={`monthly-day-cell ${isToday ? 'today' : ''} ${!stats ? 'future' : ''}`}
                >
                  <span className="monthly-day-num">{dayNum}</span>
                  {stats && (
                    <div
                      className="monthly-day-fill"
                      style={{ background: pctColor(stats.pct), opacity: 0.15 + stats.pct / 100 * 0.85 }}
                    />
                  )}
                  {stats && (
                    <span className="monthly-day-pct">{stats.pct}%</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="monthly-legend">
        {[['0%', '#ef4444'], ['<70%', '#f59e0b'], ['<100%', '#22c55e'], ['100%', '#6366f1']].map(([label, color]) => (
          <div key={label} className="monthly-legend-item">
            <span className="monthly-legend-dot" style={{ background: color as string }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
