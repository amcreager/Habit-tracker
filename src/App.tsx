import { useHabits } from './hooks/useHabits';
import { AddHabit } from './components/AddHabit';
import { HabitRow } from './components/HabitRow';
import { WeekHeader } from './components/WeekHeader';
import { Summary } from './components/Summary';
import { getLast7Days, formatDate, today } from './utils/dates';

const days = getLast7Days();

export default function App() {
  const { habits, addHabit, removeHabit, toggleCompletion } = useHabits();

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div>
            <h1 className="title">Habit Tracker</h1>
            <p className="subtitle">{formatDate(today())}</p>
          </div>
          <AddHabit onAdd={addHabit} />
        </div>
      </header>

      <main className="main">
        <Summary habits={habits} />

        {habits.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📋</div>
            <h2>No habits yet</h2>
            <p>Add your first habit above to start tracking your progress.</p>
          </div>
        ) : (
          <div className="habit-list">
            <WeekHeader days={days} />
            {habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                days={days}
                onToggle={toggleCompletion}
                onRemove={removeHabit}
              />
            ))}
          </div>
        )}

        <div className="legend">
          <span>🔥 Current streak</span>
          <span>⭐ Best streak</span>
        </div>
      </main>
    </div>
  );
}
