import { useRef } from 'react';
import { useDateFieldState } from 'react-stately';
import { AriaDateFieldProps, useDateField, useLocale } from 'react-aria';
import { createCalendar, DateValue } from '@internationalized/date';
import { Segment } from './Segment';

export function DateField(props: AriaDateFieldProps<DateValue>) {
  const ref = useRef<HTMLDivElement>(null);
  const { locale } = useLocale();

  const state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  const { fieldProps } = useDateField(props, state, ref);

  return (
    <div {...fieldProps} ref={ref} className="flex">
      {state.segments.map((segment, i) => (
        <Segment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
}
