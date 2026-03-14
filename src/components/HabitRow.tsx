import { useState } from 'react';
import type { Habit } from '../types';
import {
  today,
  formatDate,
  calcCurrentStreak,
  calcBestStreak,
  formatFrequency,
  streakLabel,
} from '../utils/dates';
import { HeatmapView } from './HeatmapView';
import { DayNoteModal } from './DayNoteModal';

interface Props {
  habit: Habit;
  days: string[];
  onToggle: (id: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onNote: (id: string, date: string, text: string) => void;
  onReorder: (id: string, dir: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

export function HabitRow({
  habit, days, onToggle, onEdit, onNote, onReorder, isFirst, isLast,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [noteDate, setNoteDate] = useState<string | null>(null);
  const [justToggled, setJustToggled] = useState<string | null>(null);

  const t = today();
  const currentStreak = calcCurrentStreak(habit.completions, habit.frequency);
  const bestStreak = calcBestStreak(habit.completions, habit.frequency);
  const unit = streakLabel(habit.frequency);
  const doneToday = habit.completions.includes(t);
  const goalPct = habit.goalStreak && currentStreak > 0
    ? Math.min(100, Math.round((currentStreak / habit.goalStreak) * 100))
    : null;

  function handleToggle(date: string) {
    onToggle(habit.id, date);
    setJustToggled(date);
    setTimeout(() => setJustToggled(null), 350);
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
            const done = habit.completions.includes(day);
            const isToday = day === t;
            const hasNote = habit.notes.some(n => n.date === day);
            const popping = justToggled === day;
            return (
              <div key={day} className={`day-col ${isToday ? 'is-today' : ''}`}>
                <button
                  className={`day-cell ${done ? 'day-done' : ''} ${isToday ? 'day-today' : ''} ${popping ? 'pop' : ''}`}
                  style={done ? { background: habit.color, borderColor: habit.color } : undefined}
                  onClick={() => handleToggle(day)}
                  title={formatDate(day)}
                >
                  {done ? <span className="check">✓</span> : isToday ? <span className="today-dot" /> : null}
                </button>
                {done && (
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
            <div className="streak-chip" title={`Current streak`}>
              <span className="streak-fire">🔥</span>
              <span className="streak-num">{currentStreak}</span>
              <span className="streak-unit">{unit}</span>
            </div>
            <div className="streak-chip best" title={`Best streak`}>
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
          habit={habit}
          date={noteDate}
          onSave={text => onNote(habit.id, noteDate, text)}
          onClose={() => setNoteDate(null)}
        />
      )}
    </>
  );
}
