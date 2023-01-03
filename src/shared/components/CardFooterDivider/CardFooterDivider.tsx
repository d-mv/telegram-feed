import { clsx } from 'clsx';

import classes from './CardFooterDivider.module.scss';

interface CardProps {
  className?: string;
}

export function CardFooterDivider({ className }: CardProps) {
  return <div className={clsx(classes.container, className)} />;
}
