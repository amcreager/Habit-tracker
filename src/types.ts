export type Category =
  | 'health'
  | 'fitness'
  | 'work'
  | 'learning'
  | 'mindfulness'
  | 'personal'
  | 'other';

/** days: Mon=0 … Sun=6 */
export type Frequency = 'daily' | 'weekdays' | 'weekends' | { times: number } | { days: number[] };

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
