import { clsx } from 'clsx';

import classes from './CardDivider.module.scss';

interface CardProps {
  className?: string;
}

export function CardDivider({ className }: CardProps) {
  return <div className={clsx(classes.container, className)} />;
}
