import { useState } from 'react';
import type { Habit } from '../types';
import { formatDate } from '../utils/dates';
import { dayLogValue } from '../utils/habit';

const COUNT_PRESETS = [1, 5, 10, 25, 50];
const MINS_PRESETS  = [5, 10, 15, 20, 30, 45, 60];

interface Props {
  habit: Habit;
  date: string;
  onSave: (value: number) => void;
  onClose: () => void;
}

export function LogModal({ habit, date, onSave, onClose }: Props) {
  const isMins = habit.target.type === 'mins';
  const target = habit.target.value ?? 1;
  const existing = dayLogValue(habit, date);
  const [value, setValue] = useState(existing > 0 ? String(existing) : '');

  const presets = isMins ? MINS_PRESETS : COUNT_PRESETS;
  const unit = isMins ? 'min' : '';
  const progress = Math.min(1, (Number(value) || 0) / target);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSave() {
    onSave(Number(value) || 0);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <div>
            <h2>
              {habit.icon} {habit.name}
            </h2>
            <p className="modal-sub">
              {formatDate(date)} &middot; Target: {target}{unit ? ' ' + unit : ''}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Progress bar */}
          <div className="log-progress-wrap">
            <div className="log-progress-bar">
              <div
                className="log-progress-fill"
                style={{ width: `${progress * 100}%`, background: habit.color }}
              />
            </div>
            <span className="log-progress-label">
              {Number(value) || 0}{unit} / {target}{unit}
            </span>
          </div>

          {/* Preset buttons */}
          <div className="log-presets">
            {presets.map(p => (
              <button
                key={p}
                className="log-preset-btn"
                style={Number(value) === p ? { background: habit.color, color: '#fff', borderColor: habit.color } : undefined}
                onClick={() => setValue(String(p))}
              >
                {p}{unit}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="field">
            <label>Custom amount</label>
            <div className="log-input-row">
              <input
                className="modal-input"
                type="number"
                min="0"
                max="9999"
                placeholder={`Enter ${isMins ? 'minutes' : 'count'}…`}
                value={value}
                onChange={e => setValue(e.target.value)}
                autoComplete="off"
              />
              {unit && <span className="log-unit">{unit}</span>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {existing > 0 && (
            <button className="btn-danger" onClick={() => { onSave(0); onClose(); }}>
              Clear
            </button>
          )}
          <div className="modal-footer-right">
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
