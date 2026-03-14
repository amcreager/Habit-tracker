import { useState } from 'react';
import type { Habit } from '../types';
import {
  today, formatDate,
  calcCurrentStreak, calcBestStreak,
  formatFrequency, streakLabel,
} from '../utils/dates';
import { completedDays, dayLogValue, dayProgress, formatTarget } from '../utils/habit';
import { HeatmapView } from './HeatmapView';
import { DayNoteModal } from './DayNoteModal';
import { LogModal } from './LogModal';

interface Props {
  habit: Habit;
  days: string[];
  onToggle: (id: string, date: string) => void;
  onLog: (id: string, date: string, value: number) => void;
  onEdit: (habit: Habit) => void;
  onNote: (id: string, date: string, text: string) => void;
  onReorder: (id: string, dir: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

export function HabitRow({
  habit, days, onToggle, onLog, onEdit, onNote, onReorder, isFirst, isLast,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [noteDate, setNoteDate] = useState<string | null>(null);
  const [logDate, setLogDate] = useState<string | null>(null);
  const [justToggled, setJustToggled] = useState<string | null>(null);

  const t = today();
  const isTracked = habit.target.type !== 'check';
  const doneDays = completedDays(habit);
  const currentStreak = calcCurrentStreak(doneDays, habit.frequency);
  const bestStreak = calcBestStreak(doneDays, habit.frequency);
  const unit = streakLabel(habit.frequency);
  const doneToday = doneDays.includes(t);
  const goalPct = habit.goalStreak && currentStreak > 0
    ? Math.min(100, Math.round((currentStreak / habit.goalStreak) * 100))
    : null;

  function handleCellTap(day: string) {
    if (isTracked) {
      setLogDate(day);
    } else {
      onToggle(habit.id, day);
      setJustToggled(day);
      setTimeout(() => setJustToggled(null), 350);
    }
  }

  return (
    <>
      <div className={`habit-row ${doneToday ? 'done-today' : ''}`}>
        {/* Icon */}
        <button
          className="habit-icon"
          style={{ background: habit.color }}
          onClick={() => onEdit(habit)}
          title="Edit habit"
        >
          {habit.icon}
        </button>

        {/* Name + meta */}
        <div className="habit-info">
          <span className="habit-name">{habit.name}</span>
          <span className="habit-meta">
            {formatFrequency(habit.frequency)}
            {formatTarget(habit) && ` · ${formatTarget(habit)}`}
            {habit.reminder && ` · ⏰ ${habit.reminder}`}
          </span>
          {goalPct !== null && (
            <div className="goal-bar-wrap" title={`Goal: ${habit.goalStreak}${unit}`}>
              <div className="goal-bar">
                <div className="goal-fill" style={{ width: `${goalPct}%`, background: habit.color }} />
              </div>
              <span className="goal-pct">{goalPct}%</span>
            </div>
          )}
        </div>

        {/* 7-day grid */}
        <div className="habit-days">
          {days.map(day => {
            const done = doneDays.includes(day);
            const isToday = day === t;
            const hasNote = habit.notes.some(n => n.date === day);
            const popping = justToggled === day;
            const progress = isTracked ? dayProgress(habit, day) : 0;
            const logVal = isTracked ? dayLogValue(habit, day) : 0;
            const isMins = habit.target.type === 'mins';

            return (
              <div key={day} className={`day-col ${isToday ? 'is-today' : ''}`}>
                <button
                  className={`day-cell
                    ${done ? 'day-done' : ''}
                    ${isToday && !done ? 'day-today' : ''}
                    ${popping ? 'pop' : ''}
                    ${progress > 0 && !done ? 'day-partial' : ''}
                  `}
                  style={{
                    ...(done ? { background: habit.color, borderColor: habit.color } : {}),
                    ...(progress > 0 && !done
                      ? { '--progress': progress, '--cell-color': habit.color } as React.CSSProperties
                      : {}),
                  }}
                  onClick={() => handleCellTap(day)}
                  title={formatDate(day)}
                >
                  {done ? (
                    isTracked && logVal > 0
                      ? <span className="day-value">{logVal > 99 ? '✓' : `${logVal}${isMins ? 'm' : ''}`}</span>
                      : <span className="check">✓</span>
                  ) : logVal > 0 ? (
                    <span className="day-value">{logVal}{isMins ? 'm' : ''}</span>
                  ) : isToday ? (
                    <span className="today-dot" />
                  ) : null}
                </button>
                {(done || logVal > 0) && (
                  <button
                    className={`note-btn ${hasNote ? 'has-note' : ''}`}
                    onClick={() => setNoteDate(day)}
                    title={hasNote ? 'Edit note' : 'Add note'}
                  >
                    {hasNote ? '📝' : '+'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Streaks + actions */}
        <div className="habit-right">
          <div className="habit-streaks">
            <div className="streak-chip" title="Current streak">
              <span className="streak-fire">🔥</span>
              <span className="streak-num">{currentStreak}</span>
              <span className="streak-unit">{unit}</span>
            </div>
            <div className="streak-chip best" title="Best streak">
              <span className="streak-fire">⭐</span>
              <span className="streak-num">{bestStreak}</span>
              <span className="streak-unit">{unit}</span>
            </div>
          </div>
          <div className="habit-actions">
            <button className="action-btn" onClick={() => setExpanded(e => !e)} title="History">
              {expanded ? '▲' : '▼'}
            </button>
            <div className="reorder-btns">
              <button className="action-btn" onClick={() => onReorder(habit.id, 'up')} disabled={isFirst} title="Move up">↑</button>
              <button className="action-btn" onClick={() => onReorder(habit.id, 'down')} disabled={isLast} title="Move down">↓</button>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="habit-expanded">
          <HeatmapView habit={habit} />
        </div>
      )}

      {noteDate && (
        <DayNoteModal
          habit={habit} date={noteDate}
          onSave={text => onNote(habit.id, noteDate, text)}
          onClose={() => setNoteDate(null)}
        />
      )}

      {logDate && (
        <LogModal
          habit={habit} date={logDate}
          onSave={value => onLog(habit.id, logDate, value)}
          onClose={() => setLogDate(null)}
        />
      )}
    </>
  );
}
