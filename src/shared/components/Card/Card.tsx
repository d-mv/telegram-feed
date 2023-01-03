import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

import classes from './Card.module.scss';

interface CardProps {
  id: string;
  className?: string;
}

export function Card({ children, id, className }: PropsWithChildren<CardProps>) {
  return (
    <div id={id} className={clsx(classes.container, className)}>
      {children}
    </div>
  );
}
