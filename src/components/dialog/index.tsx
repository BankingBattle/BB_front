import { useRef, PropsWithChildren } from 'react';
import { useDialog, AriaDialogProps } from 'react-aria';

export function Dialog({
  children,
  ...props
}: PropsWithChildren<AriaDialogProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const { dialogProps } = useDialog(props, ref);

  return (
    <div {...dialogProps} ref={ref}>
      {children}
    </div>
  );
}
