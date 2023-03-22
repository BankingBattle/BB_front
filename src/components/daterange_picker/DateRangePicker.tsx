import { useRef } from 'react';
import {
  DateRangePickerStateOptions,
  useDateRangePickerState,
} from 'react-stately';
import { AriaDateRangePickerProps, useDateRangePicker } from 'react-aria';
import { DateValue } from '@internationalized/date';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';

import { RangeCalendar } from './RangeCalendar';
import { DateField } from './DateField';
import { FieldButton } from '../button';
import { Popover } from '../popover';
import { Dialog } from '../dialog';
import { TimeField } from './TimeField';
import { TimeValue } from '@react-types/datepicker';
import { useTranslation } from 'react-i18next';

type Props = AriaDateRangePickerProps<DateValue> & DateRangePickerStateOptions;

export function DateRangePicker(props: Props) {
  const { t } = useTranslation();
  const state = useDateRangePickerState(props);
  const ref = useRef<HTMLDivElement>(null);
  const {
    groupProps,
    labelProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    calendarProps,
  } = useDateRangePicker(props, state, ref);

  return (
    <div className="relative inline-flex flex-col text-left" ref={ref}>
      <span {...labelProps} className="text-sm text-gray-800">
        {props.label}
      </span>
      <div {...groupProps} className="flex group">
        <div className="flex bg-white border border-gray-300 group-hover:border-gray-400 transition-colors rounded-l-md pr-10 group-focus-within:border-violet-600 group-focus-within:group-hover:border-violet-600 p-1 relative">
          <DateField {...startFieldProps} />
          <span aria-hidden="true" className="px-2">
            –
          </span>
          <DateField {...endFieldProps} />
          {state.validationState === 'invalid' && (
            <FontAwesomeIcon
              icon={faExclamation}
              className="w-6 h-6 text-red-500 absolute right-1"
            />
          )}
        </div>
        <FieldButton {...buttonProps} isPressed={state.isOpen}>
          <FontAwesomeIcon
            icon={faCalendar}
            className="w-5 h-5 text-gray-700 group-focus-within:text-violet-700"
          />
        </FieldButton>
      </div>
      <RangeCalendar {...calendarProps} />
      <div className="flex">
        <TimeField
          label={t('Start time')}
          value={state.timeRange?.start || null}
          onChange={(value: TimeValue) => state.setTime('start', value)}
        />
        <TimeField
          label={t('End time')}
          value={state.timeRange?.end || null}
          onChange={(value: TimeValue) => state.setTime('end', value)}
        />
      </div>
    </div>
  );
}
