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
import { CATEGORY_META } from './CategoryFilter';
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
  habit,
  days,
  onToggle,
  onEdit,
  onNote,
  onReorder,
  isFirst,
  isLast,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [noteDate, setNoteDate] = useState<string | null>(null);

  const t = today();
  const currentStreak = calcCurrentStreak(habit.completions, habit.frequency);
  const bestStreak = calcBestStreak(habit.completions, habit.frequency);
  const unit = streakLabel(habit.frequency);
  const doneToday = habit.completions.includes(t);
  const goalPct =
    habit.goalStreak && currentStreak > 0
      ? Math.min(100, Math.round((currentStreak / habit.goalStreak) * 100))
      : null;

  const { emoji } = CATEGORY_META[habit.category];

  return (
    <>
      <div className={`habit-row ${doneToday ? 'done-today' : ''}`}>
        {/* Left: info */}
        <div className="habit-info">
          <span className="habit-dot" style={{ background: habit.color }} />
          <div className="habit-name-block">
            <span className="habit-name">{habit.name}</span>
            <span className="habit-meta">
              {emoji} {formatFrequency(habit.frequency)}
              {habit.reminder && ` · ⏰ ${habit.reminder}`}
            </span>
          </div>
        </div>

        {/* Middle: 7-day grid */}
        <div className="habit-days">
          {days.map(day => {
            const done = habit.completions.includes(day);
            const isToday = day === t;
            const hasNote = habit.notes.some(n => n.date === day);
            return (
              <div key={day} className="day-col">
                <button
                  className={`day-cell ${done ? 'day-done' : ''} ${isToday ? 'day-today' : ''}`}
                  style={
                    done
                      ? { background: habit.color, borderColor: habit.color }
                      : undefined
                  }
                  onClick={() => onToggle(habit.id, day)}
                  title={formatDate(day)}
                >
                  {done && <span className="check">✓</span>}
                </button>
                {done && (
                  <button
                    className={`note-btn ${hasNote ? 'has-note' : ''}`}
                    onClick={() => setNoteDate(day)}
                    title={hasNote ? 'Edit note' : 'Add note'}
                  >
                    {hasNote ? '📝' : '·'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: streaks + actions */}
        <div className="habit-right">
          <div className="habit-streaks">
            <span className="streak" title={`Current streak: ${currentStreak} ${unit}`}>
              🔥 {currentStreak}
              <span className="streak-unit">{unit}</span>
            </span>
            <span className="streak best" title={`Best streak: ${bestStreak} ${unit}`}>
              ⭐ {bestStreak}
              <span className="streak-unit">{unit}</span>
            </span>
          </div>

          {goalPct !== null && (
            <div className="goal-bar-wrap" title={`Goal: ${habit.goalStreak} ${unit}`}>
              <div className="goal-bar">
                <div
                  className="goal-fill"
                  style={{ width: `${goalPct}%`, background: habit.color }}
                />
              </div>
              <span className="goal-pct">{goalPct}%</span>
            </div>
          )}

          <div className="habit-actions">
            <button
              className="action-btn"
              onClick={() => setExpanded(e => !e)}
              title="History"
            >
              {expanded ? '▲' : '▼'}
            </button>
            <button
              className="action-btn"
              onClick={() => onEdit(habit)}
              title="Edit"
            >
              ✎
            </button>
            <div className="reorder-btns">
              <button
                className="action-btn"
                onClick={() => onReorder(habit.id, 'up')}
                disabled={isFirst}
                title="Move up"
              >
                ↑
              </button>
              <button
                className="action-btn"
                onClick={() => onReorder(habit.id, 'down')}
                disabled={isLast}
                title="Move down"
              >
                ↓
              </button>
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
