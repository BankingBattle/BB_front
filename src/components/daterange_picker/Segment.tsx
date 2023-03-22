import cn from 'classnames';
import { useRef } from 'react';
import { DateFieldState, DateSegment } from 'react-stately';
import { useDateSegment } from 'react-aria';

type Props = {
  segment: DateSegment;
  state: DateFieldState;
};

export function Segment({ segment, state }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
        minWidth:
          segment.maxValue != null
            ? String(segment.maxValue).length + 'ch'
            : undefined,
      }}
      className={cn(
        'px-0.5 box-content tabular-nums text-right outline-none rounded-sm focus:bg-vioconst-600 focus:text-white group',
        [segment.isEditable ? 'text-gray-800' : 'text-gray-500']
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'block w-full text-center italic text-gray-500 group-focus:text-white pointer-events-none	',
          {
            'invisible h-0': !segment.isPlaceholder,
          }
        )}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? '' : segment.text}
    </div>
  );
}
