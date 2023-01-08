import { clsx } from 'clsx';
import { Icon } from '../Icon';

import classes from './MessageDivider.module.scss';

interface CardProps {
  id: number;
  className?: string;
}

export function MessageDivider({ id, className }: CardProps) {
  return (
    <div id={`message-divider-${id}`} className={clsx(classes.container, className)}>
      <Icon icon='radioCircle' />
    </div>
  );
}
