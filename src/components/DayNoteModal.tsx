import { useState } from 'react';
import type { Habit } from '../types';
import { formatDate } from '../utils/dates';

interface Props {
  habit: Habit;
  date: string;
  onSave: (text: string) => void;
  onClose: () => void;
}

export function DayNoteModal({ habit, date, onSave, onClose }: Props) {
  const existing = habit.notes.find(n => n.date === date);
  const [text, setText] = useState(existing?.text ?? '');

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <div>
            <h2>Journal Note</h2>
            <p className="modal-sub">
              {habit.name} &middot; {formatDate(date)}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <textarea
            autoFocus
            className="note-textarea"
            placeholder="How did it go? Any thoughts…"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
          />
        </div>
        <div className="modal-footer">
          {existing && (
            <button
              className="btn-danger"
              onClick={() => {
                onSave('');
                onClose();
              }}
            >
              Delete
            </button>
          )}
          <div className="modal-footer-right">
            <button className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                onSave(text);
                onClose();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
