import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

import classes from './CardFooter.module.scss';

interface CardProps {
  className?: string;
}

export function CardFooter({ children, className }: PropsWithChildren<CardProps>) {
  return <footer className={clsx(classes.container, className)}>{children}</footer>;
}
