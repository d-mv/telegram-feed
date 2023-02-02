import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

import classes from './Body.module.scss';

interface BodyProps {
  className?: string;
}

export function Body({ children, className }: PropsWithChildren<BodyProps>) {
  return <article className={clsx(classes.container, className)}>{children}</article>;
}
