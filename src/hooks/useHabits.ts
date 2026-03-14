import { useState, useEffect } from 'react';
import type { Habit, Category, Frequency } from '../types';
import { today } from '../utils/dates';

const STORAGE_KEY = 'habit-tracker-v2';

const COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981',
  '#3b82f6', '#ef4444', '#8b5cf6', '#14b8a6',
  '#f97316', '#06b6d4',
];

export interface HabitInput {
  name: string;
  color: string;
  category: Category;
  frequency: Frequency;
  reminder?: string;
  goalStreak?: number;
}

function migrateHabit(raw: Record<string, unknown>, index: number): Habit {
  return {
    id: raw.id as string,
    name: raw.name as string,
    color: (raw.color as string) ?? COLORS[index % COLORS.length],
    category: (raw.category as Category) ?? 'personal',
    frequency: (raw.frequency as Frequency) ?? 'daily',
    reminder: raw.reminder as string | undefined,
    goalStreak: raw.goalStreak as number | undefined,
    createdAt: (raw.createdAt as string) ?? today(),
    completions: (raw.completions as string[]) ?? [],
    notes: (raw.notes as Habit['notes']) ?? [],
    order: typeof raw.order === 'number' ? raw.order : index,
  };
}

function load(): Habit[] {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem('habit-tracker-habits');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, unknown>[];
    return parsed.map((h, i) => migrateHabit(h, i));
  } catch {
    return [];
  }
}

function save(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(load);

  useEffect(() => {
    save(habits);
  }, [habits]);

  function addHabit(input: HabitInput) {
    const habit: Habit = {
      id: crypto.randomUUID(),
      ...input,
      createdAt: today(),
      completions: [],
      notes: [],
      order: habits.length,
    };
    setHabits(prev => [...prev, habit]);
  }

  function updateHabit(id: string, updates: Partial<HabitInput>) {
    setHabits(prev =>
      prev.map(h => (h.id === id ? { ...h, ...updates } : h))
    );
  }

  function removeHabit(id: string) {
    setHabits(prev =>
      prev
        .filter(h => h.id !== id)
        .map((h, i) => ({ ...h, order: i }))
    );
  }

  function toggleCompletion(id: string, date: string) {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const has = h.completions.includes(date);
        return {
          ...h,
          completions: has
            ? h.completions.filter(d => d !== date)
            : [...h.completions, date],
        };
      })
    );
  }

  function setNote(id: string, date: string, text: string) {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const notes = h.notes.filter(n => n.date !== date);
        if (text.trim()) notes.push({ date, text: text.trim() });
        return { ...h, notes };
      })
    );
  }

  function reorderHabit(id: string, direction: 'up' | 'down') {
    setHabits(prev => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex(h => h.id === id);
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= sorted.length) return prev;
      [sorted[idx], sorted[newIdx]] = [sorted[newIdx], sorted[idx]];
      return sorted.map((h, i) => ({ ...h, order: i }));
    });
  }

  const sorted = [...habits].sort((a, b) => a.order - b.order);
  return {
    habits: sorted,
    addHabit,
    updateHabit,
    removeHabit,
    toggleCompletion,
    setNote,
    reorderHabit,
  };
}
