import { PropsWithChildren } from 'react';

import classes from './Button.module.scss';

export interface ButtonProps {
  isDisabled: boolean;
  onClick?: () => void;
  type?: 'submit' | 'button';
}

export function Button({ isDisabled, children, onClick, type = 'button' }: PropsWithChildren<ButtonProps>) {
  return (
    <button disabled={isDisabled} className={classes.container} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
