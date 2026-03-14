import { useState } from 'react';
import type { Habit, Category, Frequency, HabitTarget } from '../types';
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

const TIMES_OPTIONS = [2, 3, 4, 5, 6];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type FreqMode = 'daily' | 'weekdays' | 'weekends' | 'times' | 'days';

function freqToMode(freq: Frequency): FreqMode {
  if (freq === 'daily') return 'daily';
  if (freq === 'weekdays') return 'weekdays';
  if (freq === 'weekends') return 'weekends';
  if (typeof freq === 'object' && 'times' in freq) return 'times';
  return 'days';
}

function buildFreq(mode: FreqMode, times: number, days: number[]): Frequency {
  if (mode === 'daily') return 'daily';
  if (mode === 'weekdays') return 'weekdays';
  if (mode === 'weekends') return 'weekends';
  if (mode === 'times') return { times };
  return { days };
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
  const [freqMode, setFreqMode] = useState<FreqMode>(() => freqToMode(habit?.frequency ?? 'daily'));
  const [times, setTimes] = useState(() =>
    habit && typeof habit.frequency === 'object' && 'times' in habit.frequency
      ? habit.frequency.times : 3
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(() =>
    habit && typeof habit.frequency === 'object' && 'days' in habit.frequency
      ? habit.frequency.days : [0, 2, 4]
  );
  const [targetType, setTargetType] = useState<HabitTarget['type']>(habit?.target?.type ?? 'check');
  const [targetValue, setTargetValue] = useState(habit?.target?.value ? String(habit.target.value) : '');
  const [goalStreak, setGoalStreak] = useState(habit?.goalStreak ? String(habit.goalStreak) : '');
  const [reminder, setReminder] = useState(habit?.reminder ?? '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  function toggleDay(d: number) {
    setSelectedDays(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  }

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
      frequency: buildFreq(freqMode, times, selectedDays),
      target: {
        type: targetType,
        value: targetValue ? parseInt(targetValue) : undefined,
      },
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

            {/* Icon + Name */}
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
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="words"
                spellCheck={false}
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

            {/* Target type */}
            <div className="field">
              <label>Track by</label>
              <div className="freq-grid">
                {([
                  { type: 'check', label: '✓ Checkbox' },
                  { type: 'count', label: '# Count' },
                  { type: 'mins',  label: '⏱ Minutes' },
                ] as { type: HabitTarget['type']; label: string }[]).map(opt => (
                  <button
                    key={opt.type}
                    className={`freq-btn ${targetType === opt.type ? 'active' : ''}`}
                    onClick={() => setTargetType(opt.type)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {targetType !== 'check' && (
                <div className="log-input-row" style={{ marginTop: 8 }}>
                  <input
                    className="modal-input"
                    type="number"
                    min="1"
                    placeholder={targetType === 'mins' ? 'e.g. 30' : 'e.g. 10'}
                    value={targetValue}
                    onChange={e => setTargetValue(e.target.value)}
                    autoComplete="off"
                  />
                  <span className="log-unit">{targetType === 'mins' ? 'min / day' : '/ day'}</span>
                </div>
              )}
            </div>

            {/* Frequency */}
            <div className="field">
              <label>Frequency</label>

              {/* Row 1: preset modes */}
              <div className="freq-grid">
                {(['daily', 'weekdays', 'weekends'] as FreqMode[]).map(mode => (
                  <button
                    key={mode}
                    className={`freq-btn ${freqMode === mode ? 'active' : ''}`}
                    onClick={() => setFreqMode(mode)}
                  >
                    {mode === 'daily' ? '📅 Every day' : mode === 'weekdays' ? '💼 Weekdays' : '🌅 Weekends'}
                  </button>
                ))}
              </div>

              {/* Row 2: X times per week */}
              <div className="freq-times-row">
                <span className="freq-times-label">Times per week:</span>
                <div className="freq-times-btns">
                  {TIMES_OPTIONS.map(n => (
                    <button
                      key={n}
                      className={`freq-num-btn ${freqMode === 'times' && times === n ? 'active' : ''}`}
                      onClick={() => { setFreqMode('times'); setTimes(n); }}
                    >
                      {n}×
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: specific days */}
              <div className="freq-days-section">
                <button
                  className={`freq-days-toggle ${freqMode === 'days' ? 'active' : ''}`}
                  onClick={() => setFreqMode('days')}
                >
                  📆 Specific days
                </button>
                {freqMode === 'days' && (
                  <div className="day-picker">
                    {DAY_LABELS.map((label, i) => (
                      <button
                        key={i}
                        className={`day-toggle ${selectedDays.includes(i) ? 'active' : ''}`}
                        onClick={() => toggleDay(i)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Advanced */}
            <button
              className="advanced-toggle"
              onClick={() => setShowAdvanced(v => !v)}
            >
              {showAdvanced ? '▲' : '▶'} Advanced settings
            </button>

            {showAdvanced && (
              <>
                <div className="field">
                  <label>Goal streak</label>
                  <input
                    className="modal-input"
                    type="number" min="1" max="365"
                    placeholder="e.g. 30 days"
                    value={goalStreak}
                    onChange={e => setGoalStreak(e.target.value)}
                    autoComplete="off"
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
            <button className="btn-danger" onClick={() => {
              if (confirm(`Delete "${habit?.name}"?`)) { onDelete(); onClose(); }
            }}>Delete</button>
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
