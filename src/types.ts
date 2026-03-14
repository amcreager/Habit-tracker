export type Category =
  | 'health' | 'fitness' | 'work' | 'learning'
  | 'mindfulness' | 'personal' | 'other';

/** days: Mon=0 … Sun=6 */
export type Frequency =
  | 'daily' | 'weekdays' | 'weekends'
  | { times: number }
  | { days: number[] };

export interface HabitTarget {
  type: 'check' | 'count' | 'mins';
  value?: number; // target per day (required for count/mins)
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface DayNote {
  date: string;
  text: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: Category;
  frequency: Frequency;
  target: HabitTarget;
  reminder?: string; // 'HH:MM'
  goalStreak?: number;
  createdAt: string;
  completions: string[]; // used for 'check' type
  logs: DayLog[];        // used for 'count' and 'mins' types
  notes: DayNote[];
  order: number;
}
