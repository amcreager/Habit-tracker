import { today } from '../utils/dates';

interface Props {
  days: string[];
}

export function WeekHeader({ days }: Props) {
  const t = today();
  return (
    <div className="week-header">
      <div className="week-header-spacer" />
      <div className="week-header-days">
        {days.map((day) => {
          const [, , d] = day.split('-');
          const label = new Date(day + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
          return (
            <div key={day} className={`week-day-label ${day === t ? 'today-label' : ''}`}>
              <span className="week-day-name">{label}</span>
              <span className="week-day-num">{parseInt(d)}</span>
            </div>
          );
        })}
      </div>
      <div className="week-header-streak-spacer" />
    </div>
  );
}
