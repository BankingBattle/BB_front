import { useRef } from 'react';
import { RangeCalendarProps, useLocale, useRangeCalendar } from 'react-aria';
import { useRangeCalendarState } from 'react-stately';
import { createCalendar, DateValue } from '@internationalized/date';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';

import { CalendarButton } from '../button';
import { CalendarGrid } from './CalendarGrid';

type Props = RangeCalendarProps<DateValue>;

export function RangeCalendar(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { locale } = useLocale();

  const state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar,
    visibleDuration: { months: 2 },
  });

  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar(props, state, ref);

  return (
    <div {...calendarProps} ref={ref}>
      <div className="flex items-center">
        <h2 className="flex-1 font-bold text-xl ml-2">{title}</h2>
        <CalendarButton {...prevButtonProps}>
          <FontAwesomeIcon icon={faChevronLeft} className="h-6 w-6" />
        </CalendarButton>
        <CalendarButton {...nextButtonProps}>
          <FontAwesomeIcon icon={faChevronRight} className="h-6 w-6" />
        </CalendarButton>
      </div>
      <CalendarGrid state={state} />
      <CalendarGrid state={state} offset={{ months: 1 }} />
    </div>
  );
}
