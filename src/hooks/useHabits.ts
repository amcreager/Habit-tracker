import { useState, useEffect } from 'react';
import type { Habit } from '../types';
import { today } from '../utils/dates';

const STORAGE_KEY = 'habit-tracker-habits';

const COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6',
];

function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHabits(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  function addHabit(name: string) {
    const color = COLORS[habits.length % COLORS.length];
    const habit: Habit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      createdAt: today(),
      completions: [],
    };
    setHabits((prev) => [...prev, habit]);
  }

  function removeHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  function toggleCompletion(id: string, date: string) {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const has = h.completions.includes(date);
        return {
          ...h,
          completions: has
            ? h.completions.filter((d) => d !== date)
            : [...h.completions, date],
        };
      })
    );
  }

  return { habits, addHabit, removeHabit, toggleCompletion };
}
