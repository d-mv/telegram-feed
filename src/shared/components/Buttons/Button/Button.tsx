import clsx from 'clsx';
import { CSSProperties, MouseEvent, PropsWithChildren } from 'react';

import classes from './Button.module.scss';

export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export interface ButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  size: ButtonSize;
  className?: string;
  style?: CSSProperties;
  autoFocus?: boolean | undefined;
  disabled?: boolean | undefined;
  name?: string | undefined;
  type?: 'submit' | 'reset' | 'button' | undefined;
  value?: string | ReadonlyArray<string> | number | undefined;
  id: string;
  isBusy?: boolean;
}

export function Button({ children, size, className, id, ...props }: PropsWithChildren<ButtonProps>) {
  function makeClasses() {
    const result = [classes.container, classes[size], className];

    return clsx(...result);
  }

  return (
    <button id={`${id}-button`} className={makeClasses()} {...props}>
      <div className={classes.children}>{children}</div>
    </button>
  );
}
