export type Category =
  | 'health'
  | 'fitness'
  | 'work'
  | 'learning'
  | 'mindfulness'
  | 'personal'
  | 'other';

export type Frequency = 'daily' | 'weekdays' | 'weekends' | { times: number };

export interface DayNote {
  date: string; // YYYY-MM-DD
  text: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: Category;
  frequency: Frequency;
  reminder?: string; // 'HH:MM'
  goalStreak?: number;
  createdAt: string; // YYYY-MM-DD
  completions: string[]; // YYYY-MM-DD[]
  notes: DayNote[];
  order: number;
}
