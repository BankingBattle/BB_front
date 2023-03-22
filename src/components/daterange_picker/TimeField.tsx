import { TimeValue } from '@react-types/datepicker';
import { useRef } from 'react';
import { AriaTimeFieldProps, useLocale, useTimeField } from 'react-aria';
import { useTimeFieldState } from 'react-stately';
import { Segment } from './Segment';

type Props = AriaTimeFieldProps<TimeValue> & {
  label: string;
};

export function TimeField(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { locale } = useLocale();
  const state = useTimeFieldState({
    ...props,
    locale,
  });

  const { labelProps, fieldProps } = useTimeField(props, state, ref);

  return (
    <div className="flex mt-2">
      <label {...labelProps}>{props.label}</label>
      <div {...fieldProps} ref={ref} className="inline-flex pr-2">
        {state.segments.map((segment, i) => (
          <Segment key={i} segment={segment} state={state} />
        ))}
      </div>
    </div>
  );
}
