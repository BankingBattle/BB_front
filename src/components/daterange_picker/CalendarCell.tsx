import { useRef } from 'react';
import cn from 'classnames';
import {
  useCalendarCell,
  useLocale,
  useFocusRing,
  mergeProps,
} from 'react-aria';
import {
  isSameDay,
  getDayOfWeek,
  CalendarDate,
  DateValue,
  isSameMonth,
} from '@internationalized/date';
import { RangeCalendarState } from 'react-stately';

type Props = {
  date: CalendarDate;
  state: RangeCalendarState;
  currentMonth: DateValue;
};

export function CalendarCell({ date, state, currentMonth }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
    isInvalid,
  } = useCalendarCell({ date }, state, ref);

  const isOutsideMonth = !isSameMonth(currentMonth, date);

  const { focusProps, isFocusVisible } = useFocusRing();

  const isSelectionStart = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.start)
    : isSelected;
  const isSelectionEnd = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.end)
    : isSelected;

  const dayOfWeek = getDayOfWeek(date, useLocale().locale);

  const isRoundedStart =
    isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 0);
  const isRoundedEnd =
    isSelected &&
    (isSelectionEnd ||
      dayOfWeek === 6 ||
      date.day === date.calendar.getDaysInMonth(date));

  return (
    <td {...cellProps}>
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth}
        className={cn('w-10 h-10 outline-none group', {
          'rounded-l-full': isRoundedStart,
          'rounded-r-full': isRoundedEnd,
          'bg-red-300': isSelected && isInvalid,
          'bg-violet-300': isSelected && !isInvalid,
          disabled: isDisabled,
        })}
      >
        <div
          className={cn(
            'w-full h-full rounded-full flex items-center justify-center cursor-default',
            {
              'text-gray-400': isDisabled && !isInvalid,
              'ring-2 group-focus:z-2 ring-violet-600 ring-offset-2':
                isFocusVisible,
              'bg-red-600 text-white hover:bg-red-700':
                (isSelectionStart || isSelectionEnd) && isInvalid,
              'bg-violet-600 text-white hover:bg-violet-700':
                (isSelectionStart || isSelectionEnd) && !isInvalid,
              'hover:bg-red-400':
                isSelected &&
                !isDisabled &&
                !(isSelectionStart || isSelectionEnd) &&
                isInvalid,
              'hover:bg-violet-400':
                isSelected &&
                !isDisabled &&
                !(isSelectionStart || isSelectionEnd) &&
                isInvalid,
              'hover:bg-violet-100': !isSelected && !isDisabled,
            }
          )}
        >
          {formattedDate}
        </div>
      </div>
    </td>
  );
}
