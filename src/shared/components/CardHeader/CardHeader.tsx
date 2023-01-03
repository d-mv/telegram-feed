import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

import classes from './CardHeader.module.scss';

interface CardProps {
  className?: string;
}

export function CardHeader({ children, className }: PropsWithChildren<CardProps>) {
  return <header className={clsx('serif', classes.container, className)}>{children}</header>;
}
