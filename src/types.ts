export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: string; // YYYY-MM-DD
  completions: string[]; // array of YYYY-MM-DD strings
}
