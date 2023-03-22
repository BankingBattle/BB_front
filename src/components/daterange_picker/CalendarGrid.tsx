import { AriaCalendarGridProps, useCalendarGrid } from 'react-aria';
import { RangeCalendarState } from 'react-stately';
import { useLocale } from 'react-aria';
import { endOfMonth, getWeeksInMonth } from '@internationalized/date';
import { CalendarCell } from './CalendarCell';

interface Props extends AriaCalendarGridProps {
  state: RangeCalendarState;
  offset?: { months?: number };
}

export function CalendarGrid({ state, offset = {} }: Props) {
  const startDate = state.visibleRange.start.add(offset);
  const endDate = endOfMonth(startDate);
  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    {
      startDate,
      endDate,
    },
    state
  );
  const weeksInMonth = getWeeksInMonth(startDate, useLocale().locale);

  return (
    <table {...gridProps} cellPadding="0" className="flex-1">
      <thead {...headerProps} className="text-gray-600">
        <tr>
          {weekDays.map((day, index) => (
            <th className="text-center" key={index}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: weeksInMonth }).map((_, weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex, startDate)
              .map((date, dayIndex) =>
                date ? (
                  <CalendarCell
                    key={dayIndex}
                    state={state}
                    date={date}
                    currentMonth={startDate}
                  />
                ) : (
                  <td key={dayIndex} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
