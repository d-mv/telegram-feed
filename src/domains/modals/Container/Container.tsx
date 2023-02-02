import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

import classes from './Container.module.scss';

interface ContainerProps {
  className: string;
}

export function Container({ children, className }: PropsWithChildren<Partial<ContainerProps>>) {
  return (
    <div id='modal-container' className={clsx(classes.container, className)}>
      {children}
    </div>
  );
}
