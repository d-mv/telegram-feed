import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import { Button, ButtonProps } from '../Button';
import classes from './SecondaryButton.module.scss';

type SecondaryButtonProps = ButtonProps;

export function SecondaryButton({ children, className, isBusy, ...props }: PropsWithChildren<SecondaryButtonProps>) {
  return (
    <Button className={clsx(classes.container, className, { [classes.busy]: isBusy })} {...props}>
      {children}
    </Button>
  );
}
