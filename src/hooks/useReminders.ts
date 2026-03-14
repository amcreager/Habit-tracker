import { useEffect } from 'react';
import type { Habit } from '../types';
import { today } from '../utils/dates';

export function useReminders(habits: Habit[]) {
  useEffect(() => {
    if (!('Notification' in window)) return;
    const check = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hh}:${mm}`;
      const t = today();
      habits.forEach(habit => {
        if (
          habit.reminder === currentTime &&
          !habit.completions.includes(t) &&
          Notification.permission === 'granted'
        ) {
          new Notification(`⏰ ${habit.name}`, {
            body: `Time to complete your habit: "${habit.name}"`,
            icon: '/favicon.svg',
          });
        }
      });
    };
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [habits]);

  async function requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  return { requestPermission };
}
