import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

import classes from './CardText.module.scss';

interface CardProps {
  className?: string;
}

export function CardText({ children, className }: PropsWithChildren<CardProps>) {
  return (
    <div className={classes.container}>
      <p
        className={clsx('p4 serif', classes.text, className)}
        // no need to trigger additional events, like click on card
        onClick={e => e.stopPropagation()}
      >
        {children}
      </p>
    </div>
  );
}
