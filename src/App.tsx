import { useState } from 'react';
import { useHabits } from './hooks/useHabits';
import { useReminders } from './hooks/useReminders';
import { HabitRow } from './components/HabitRow';
import { WeekHeader } from './components/WeekHeader';
import { Summary } from './components/Summary';
import { HabitModal } from './components/HabitModal';
import { CategoryFilter } from './components/CategoryFilter';
import { MonthlyReview } from './components/MonthlyReview';
import { getLast7Days, formatDate, today } from './utils/dates';
import type { Habit, Category } from './types';
import type { HabitInput } from './hooks/useHabits';

type View = 'habits' | 'monthly';

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
  const [view, setView] = useState<View>('habits');

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

      {/* Bottom tab bar */}
      <nav className="tab-bar">
        <button
          className={`tab-btn ${view === 'habits' ? 'active' : ''}`}
          onClick={() => setView('habits')}
        >
          <span className="tab-icon">✓</span>
          <span className="tab-label">Habits</span>
        </button>
        <button
          className={`tab-btn ${view === 'monthly' ? 'active' : ''}`}
          onClick={() => setView('monthly')}
        >
          <span className="tab-icon">📅</span>
          <span className="tab-label">Monthly</span>
        </button>
      </nav>

      <main className="main">
        {view === 'monthly' ? (
          <MonthlyReview habits={habits} />
        ) : (
          <>
            <Summary habits={filtered} />

            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon-wrap">
                  <span className="empty-icon">
                    {habits.length === 0 ? '✨' : '🔍'}
                  </span>
                </div>
                <h2>
                  {habits.length === 0
                    ? 'Start your streak today'
                    : 'No habits here'}
                </h2>
                <p>
                  {habits.length === 0
                    ? 'Build better habits one day at a time. Add your first habit to begin.'
                    : 'Try a different category or add a new habit.'}
                </p>
                {habits.length === 0 && (
                  <button className="empty-cta" onClick={() => setEditingHabit('new')}>
                    + Add your first habit
                  </button>
                )}
              </div>
            ) : (
              <div className="habit-list">
                <WeekHeader days={days} />
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
          </>
        )}
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
