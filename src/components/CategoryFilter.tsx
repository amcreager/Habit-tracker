import type { Category, Habit } from '../types';

export const CATEGORY_META: Record<
  Category | 'all',
  { label: string; emoji: string }
> = {
  all: { label: 'All', emoji: '✦' },
  health: { label: 'Health', emoji: '❤️' },
  fitness: { label: 'Fitness', emoji: '💪' },
  work: { label: 'Work', emoji: '💼' },
  learning: { label: 'Learning', emoji: '📚' },
  mindfulness: { label: 'Mindfulness', emoji: '🧘' },
  personal: { label: 'Personal', emoji: '⭐' },
  other: { label: 'Other', emoji: '📌' },
};

interface Props {
  selected: Category | 'all';
  onChange: (cat: Category | 'all') => void;
  habits: Habit[];
}

export function CategoryFilter({ selected, onChange, habits }: Props) {
  const keys = Object.keys(CATEGORY_META) as (Category | 'all')[];
  return (
    <div className="category-filter">
      {keys.map(key => {
        const count =
          key === 'all'
            ? habits.length
            : habits.filter(h => h.category === key).length;
        if (count === 0 && key !== 'all') return null;
        const { emoji, label } = CATEGORY_META[key];
        return (
          <button
            key={key}
            className={`cat-pill ${selected === key ? 'active' : ''}`}
            onClick={() => onChange(key)}
          >
            {emoji} {label}
            {key !== 'all' && <span className="cat-count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
