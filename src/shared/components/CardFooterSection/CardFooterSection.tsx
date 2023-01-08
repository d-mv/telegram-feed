import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

import classes from './CardFooterSection.module.scss';

interface CardProps {
  className?: string;
}

export function CardFooterSection({ children, className }: PropsWithChildren<CardProps>) {
  return <footer className={clsx(classes.container, className)}>{children}</footer>;
}
