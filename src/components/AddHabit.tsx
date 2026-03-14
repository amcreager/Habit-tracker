import { useState } from 'react';

interface Props {
  onAdd: (name: string) => void;
}

export function AddHabit({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="add-btn" onClick={() => setOpen(true)}>
        + Add Habit
      </button>
    );
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        autoFocus
        className="add-input"
        placeholder="Habit name (e.g. Exercise, Read, Meditate)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={60}
      />
      <div className="add-actions">
        <button type="submit" className="btn-primary" disabled={!value.trim()}>
          Add
        </button>
        <button type="button" className="btn-ghost" onClick={() => { setOpen(false); setValue(''); }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
