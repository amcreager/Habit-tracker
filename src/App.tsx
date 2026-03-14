import { useState } from 'react';
import { useHabits } from './hooks/useHabits';
import { useReminders } from './hooks/useReminders';
import { HabitRow } from './components/HabitRow';
import { Summary } from './components/Summary';
import { HabitModal } from './components/HabitModal';
import { CategoryFilter } from './components/CategoryFilter';
import { getLast7Days, formatDate, today } from './utils/dates';
import type { Habit, Category } from './types';
import type { HabitInput } from './hooks/useHabits';

const days = getLast7Days();

export default function App() {
  const {
    habits,
    addHabit,
    updateHabit,
    removeHabit,
    toggleCompletion,
    logDay,
    setNote,
    reorderHabit,
  } = useHabits();

  const { requestPermission } = useReminders(habits);

  const [editingHabit, setEditingHabit] = useState<Habit | 'new' | null>(null);
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');

  const filtered =
    filterCat === 'all' ? habits : habits.filter(h => h.category === filterCat);

  function handleSave(input: HabitInput) {
    if (editingHabit === 'new') {
      addHabit(input);
    } else if (editingHabit) {
      updateHabit(editingHabit.id, input);
    }
    if (input.reminder) requestPermission();
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div>
            <h1 className="title">Habit Tracker</h1>
            <p className="subtitle">{formatDate(today())}</p>
          </div>
          <button className="add-btn" onClick={() => setEditingHabit('new')}>
            + Add Habit
          </button>
        </div>
        <CategoryFilter
          selected={filterCat}
          onChange={setFilterCat}
          habits={habits}
        />
      </header>

      <main className="main">
        <Summary habits={filtered} />

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📋</div>
            <h2>
              {habits.length === 0
                ? 'No habits yet'
                : 'No habits in this category'}
            </h2>
            <p>
              {habits.length === 0
                ? 'Tap "+ Add Habit" to start tracking your progress.'
                : 'Try a different category or add a new habit.'}
            </p>
          </div>
        ) : (
          <div className="habit-list">
            {filtered.map((habit, i) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                days={days}
                onToggle={toggleCompletion}
                onLog={logDay}
                onEdit={setEditingHabit}
                onNote={setNote}
                onReorder={reorderHabit}
                isFirst={i === 0}
                isLast={i === filtered.length - 1}
              />
            ))}
          </div>
        )}

        <div className="legend">
          <span>Tap a day to check off &middot; 📝 to add a note &middot; ▼ for history</span>
        </div>
      </main>

      {editingHabit && (
        <HabitModal
          habit={editingHabit === 'new' ? undefined : editingHabit}
          onSave={handleSave}
          onDelete={
            editingHabit !== 'new'
              ? () => removeHabit(editingHabit.id)
              : undefined
          }
          onClose={() => setEditingHabit(null)}
        />
      )}
    </div>
  );
}
