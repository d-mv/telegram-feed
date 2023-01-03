import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

import classes from './CardText.module.scss';

interface CardProps {
  className?: string;
}

export function CardText({ children, className }: PropsWithChildren<CardProps>) {
  return <p className={clsx('p4 serif', classes.container, className)}>{children}</p>;
}
