import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export function TooltipContent({ children }: PropsWithChildren) {
  return <div className={clsx('p4', 'tooltip-content')}>{children}</div>;
}
