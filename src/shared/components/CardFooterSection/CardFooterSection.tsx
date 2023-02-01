import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

import classes from './CardFooterSection.module.scss';

interface CardProps {
  className?: string;
  left?: boolean;
  right?: boolean;
}

export function CardFooterSection({ children, className, left, right }: PropsWithChildren<CardProps>) {
  return (
    <footer
      className={clsx(classes.container, className, { [classes['align-left']]: left, [classes['align-right']]: right })}
    >
      {children}
    </footer>
  );
}
