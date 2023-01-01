import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';
import classes from './Row.module.scss';

export interface RowProps {
  className?: string;
}

export function Row({ children, className }: PropsWithChildren<RowProps>) {
  return <div className={clsx(classes.container, className)}>{children}</div>;
}
