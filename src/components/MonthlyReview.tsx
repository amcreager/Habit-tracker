import { useState } from 'react';
import type { Habit } from '../types';
import { isExpectedDay, getDow, today, calcBestStreak } from '../utils/dates';
import { completedDays } from '../utils/habit';

interface Props {
  habits: Habit[];
}

function getMonthDays(year: number, month: number): string[] {
  const days: string[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }
  return days;
}

function getMonthTitle(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

interface DayStat {
  date: string;
  expected: number;
  completed: number;
}

function calcDayStats(habits: Habit[], date: string): DayStat {
  let expected = 0;
  let completed = 0;
  for (const h of habits) {
    if (isExpectedDay(date, h.frequency)) {
      expected++;
      if (completedDays(h).includes(date)) completed++;
    }
  }
  return { date, expected, completed };
}

export function MonthlyReview({ habits }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const t = today();
  const monthDays = getMonthDays(year, month);

  // Per-day stats
  const dayStats = monthDays.map(d => calcDayStats(habits, d));
  const pastDays = dayStats.filter(d => d.date <= t && d.expected > 0);

  // Monthly stats
  const totalCompletions = pastDays.reduce((s, d) => s + d.completed, 0);
  const avgPct = pastDays.length > 0
    ? Math.round(pastDays.reduce((s, d) => s + d.completed / d.expected, 0) / pastDays.length * 100)
    : 0;
  const fullDays = pastDays.filter(d => d.completed === d.expected).length;
  const bestStreak = habits.length > 0
    ? Math.max(0, ...habits.map(h => calcBestStreak(completedDays(h), h.frequency)))
    : 0;

  // Per-habit stats for the month
  const habitStats = habits.map(h => {
    const done = completedDays(h);
    const expectedDays = monthDays.filter(d => d <= t && isExpectedDay(d, h.frequency));
    const completedCount = expectedDays.filter(d => done.includes(d)).length;
    const pct = expectedDays.length > 0 ? Math.round(completedCount / expectedDays.length * 100) : 0;
    return { habit: h, completedCount, expectedCount: expectedDays.length, pct };
  });

  // Calendar grid: pad start with empty cells
  const firstDow = getDow(monthDays[0]); // 0=Mon
  const calCells: (string | null)[] = [
    ...Array(firstDow).fill(null),
    ...monthDays,
  ];

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    const nowYear = new Date().getFullYear();
    const nowMonth = new Date().getMonth() + 1;
    if (year === nowYear && month === nowMonth) return;
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  function cellClass(date: string, stat: DayStat): string {
    const classes = ['cal-cell'];
    if (date === t) classes.push('cal-today-ring');
    if (date > t) { classes.push('cal-future'); return classes.join(' '); }
    if (stat.expected === 0) return classes.join(' ');
    const pct = stat.completed / stat.expected;
    if (pct === 1) classes.push('cal-done-full');
    else if (pct >= 0.5) classes.push('cal-done-high');
    else if (pct > 0) classes.push('cal-done-low');
    return classes.join(' ');
  }

  return (
    <div className="monthly-review">
      {/* Month navigation */}
      <div className="month-nav">
        <button className="month-nav-btn" onClick={prevMonth}>‹</button>
        <span className="month-nav-title">{getMonthTitle(year, month)}</span>
        <button className="month-nav-btn" onClick={nextMonth} disabled={isCurrentMonth}
          style={isCurrentMonth ? { opacity: 0.3, cursor: 'default' } : {}}>›</button>
      </div>

      {/* Stats */}
      <div className="review-stats">
        <div className="review-stat-card">
          <span className="review-stat-value">{totalCompletions}</span>
          <span className="review-stat-label">Completions</span>
        </div>
        <div className="review-stat-card">
          <span className="review-stat-value">{avgPct}%</span>
          <span className="review-stat-label">Avg daily</span>
        </div>
        <div className="review-stat-card">
          <span className="review-stat-value">{fullDays}</span>
          <span className="review-stat-label">Perfect days</span>
        </div>
        <div className="review-stat-card">
          <span className="review-stat-value">🔥 {bestStreak}</span>
          <span className="review-stat-label">Best streak</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="month-cal">
        <div className="cal-day-headers">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} className="cal-day-header">{d}</div>
          ))}
        </div>
        <div className="cal-grid">
          {calCells.map((date, i) => {
            if (!date) return <div key={`empty-${i}`} className="cal-cell cal-empty" />;
            const stat = dayStats.find(s => s.date === date)!;
            return (
              <div key={date} className={cellClass(date, stat)}>
                <span className="cal-cell-num">{Number(date.slice(8))}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-habit breakdown */}
      {habits.length > 0 && (
        <div className="review-habits-section">
          <div className="review-habits-title">Habits this month</div>
          <div className="review-habit-list">
            {habitStats.map(({ habit, completedCount, expectedCount, pct }) => (
              <div key={habit.id} className="review-habit-row">
                <div className="review-habit-icon" style={{ background: habit.color }}>
                  {habit.icon}
                </div>
                <span className="review-habit-name">{habit.name}</span>
                <span className="review-habit-meta">{completedCount}/{expectedCount}</span>
                <span className="review-habit-pct">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {habits.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📅</div>
          <h2>No habits yet</h2>
          <p>Add habits to see your monthly review.</p>
        </div>
      )}
    </div>
  );
}
