import { useState } from 'react';
import type { Habit, Category, Frequency } from '../types';
import type { HabitInput } from '../hooks/useHabits';
import { HeatmapView } from './HeatmapView';

const COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6',
  '#f97316', '#06b6d4',
];

const HABIT_EMOJIS = [
  '🏃','🚴','🏋️','🧘','💪','🤸','🏊','🚶',
  '📚','✍️','🎸','🎨','💻','📝','🎯','🧠',
  '🥗','💧','🍎','😴','💊','❤️','🌿','🩺',
  '🧹','🍳','🌱','☀️','🌙','🙏','😊','🎉',
  '💰','📊','📅','⏰','✅','🔑','🏆','🌊',
];

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'health',      label: 'Health',      emoji: '❤️' },
  { value: 'fitness',     label: 'Fitness',     emoji: '💪' },
  { value: 'work',        label: 'Work',        emoji: '💼' },
  { value: 'learning',    label: 'Learning',    emoji: '📚' },
  { value: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
  { value: 'personal',    label: 'Personal',    emoji: '⭐' },
  { value: 'other',       label: 'Other',       emoji: '📌' },
];

const FREQ_OPTIONS: { value: string; label: string }[] = [
  { value: 'daily',    label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays (Mon–Fri)' },
  { value: 'weekends', label: 'Weekends (Sat–Sun)' },
  { value: '2', label: '2× per week' },
  { value: '3', label: '3× per week' },
  { value: '4', label: '4× per week' },
  { value: '5', label: '5× per week' },
  { value: '6', label: '6× per week' },
];

function freqToStr(freq: Frequency): string {
  if (typeof freq === 'object') return String(freq.times);
  return freq;
}
function strToFreq(s: string): Frequency {
  if (s === 'daily' || s === 'weekdays' || s === 'weekends') return s;
  return { times: parseInt(s) };
}

interface Props {
  habit?: Habit;
  onSave: (input: HabitInput) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function HabitModal({ habit, onSave, onDelete, onClose }: Props) {
  const [tab, setTab] = useState<'edit' | 'stats'>('edit');
  const [name, setName] = useState(habit?.name ?? '');
  const [icon, setIcon] = useState(habit?.icon ?? '⭐');
  const [category, setCategory] = useState<Category>(habit?.category ?? 'personal');
  const [color, setColor] = useState(habit?.color ?? COLORS[0]);
  const [freqStr, setFreqStr] = useState(habit ? freqToStr(habit.frequency) : 'daily');
  const [goalStreak, setGoalStreak] = useState(habit?.goalStreak ? String(habit.goalStreak) : '');
  const [reminder, setReminder] = useState(habit?.reminder ?? '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      icon,
      category,
      color,
      frequency: strToFreq(freqStr),
      goalStreak: goalStreak ? parseInt(goalStreak) : undefined,
      reminder: reminder || undefined,
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>{habit ? 'Edit Habit' : 'New Habit'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {habit && (
          <div className="modal-tabs">
            <button className={tab === 'edit'  ? 'active' : ''} onClick={() => setTab('edit')}>Edit</button>
            <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>Stats &amp; History</button>
          </div>
        )}

        {tab === 'edit' ? (
          <div className="modal-body">

            {/* Icon + Name hero */}
            <div className="habit-hero">
              <button
                className="icon-picker-btn"
                style={{ background: color }}
                onClick={() => setShowEmojiPicker(v => !v)}
                title="Pick emoji"
              >
                {icon}
              </button>
              <input
                autoFocus
                className="modal-input hero-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Habit name…"
                maxLength={60}
              />
            </div>

            {showEmojiPicker && (
              <div className="emoji-grid">
                {HABIT_EMOJIS.map(e => (
                  <button
                    key={e}
                    className={`emoji-btn ${icon === e ? 'selected' : ''}`}
                    onClick={() => { setIcon(e); setShowEmojiPicker(false); }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            {/* Color */}
            <div className="field">
              <label>Color</label>
              <div className="color-grid">
                {COLORS.map(c => (
                  <button
                    key={c}
                    className={`color-swatch ${color === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="field">
              <label>Category</label>
              <div className="pill-grid">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    className={`pill ${category === cat.value ? 'active' : ''}`}
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced toggle */}
            <button
              className="advanced-toggle"
              onClick={() => setShowAdvanced(v => !v)}
            >
              {showAdvanced ? '▲' : '▶'} Advanced settings
            </button>

            {showAdvanced && (
              <>
                <div className="field">
                  <label>Frequency</label>
                  <select className="modal-select" value={freqStr} onChange={e => setFreqStr(e.target.value)}>
                    {FREQ_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Goal streak</label>
                  <input
                    className="modal-input"
                    type="number" min="1" max="365"
                    placeholder="e.g. 30 days"
                    value={goalStreak}
                    onChange={e => setGoalStreak(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Daily reminder</label>
                  <input
                    className="modal-input"
                    type="time"
                    value={reminder}
                    onChange={e => setReminder(e.target.value)}
                  />
                  <p className="field-hint">Keep this page open for reminders to fire.</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="modal-body">
            {habit && <HeatmapView habit={habit} />}
          </div>
        )}

        <div className="modal-footer">
          {onDelete && (
            <button className="btn-danger" onClick={() => { if (confirm(`Delete "${habit?.name}"?`)) { onDelete(); onClose(); } }}>
              Delete
            </button>
          )}
          <div className="modal-footer-right">
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave} disabled={!name.trim()}>
              {habit ? 'Save' : 'Add Habit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
