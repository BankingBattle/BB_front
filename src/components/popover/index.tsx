import { PropsWithChildren, useRef } from 'react';
import {
  usePopover,
  DismissButton,
  Overlay,
  AriaPopoverProps,
} from '@react-aria/overlays';
import { OverlayTriggerState } from 'react-stately';

type Props = Omit<
  PropsWithChildren<AriaPopoverProps> & {
    state: OverlayTriggerState;
  },
  'popoverRef'
>;

export function Popover({ children, state, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef: ref,
    },
    state
  );

  return (
    <Overlay>
      Test
      <div {...underlayProps} className="fixed inset-0" />
      <div
        {...popoverProps}
        ref={ref}
        className="absolute top-full bg-white border border-gray-300 rounded-md shadow-lg mt-2 p-8 z-10"
      >
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}
