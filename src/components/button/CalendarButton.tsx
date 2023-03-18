import cn from 'classnames';
import { useRef } from 'react';
import {
  useButton,
  useFocusRing,
  mergeProps,
  AriaButtonProps,
} from 'react-aria';

type Props = AriaButtonProps<'button'>;

export function CalendarButton(props: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={cn('p-2 rounded-full outline-none', {
        'text-gray-400': props.isDisabled,
        'ring-2 ring-offset-2 ring-purple-600': isFocusVisible,
      })}
    >
      {props.children}
    </button>
  );
}
