import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import { Button, ButtonProps } from '../Button';
import classes from './PrimaryButton.module.scss';

type PrimaryButtonProps = ButtonProps;

export function PrimaryButton({ children, className, isBusy, ...props }: PropsWithChildren<PrimaryButtonProps>) {
  return (
    <Button className={clsx(classes.container, className, { [classes.busy]: isBusy })} {...props}>
      {children}
    </Button>
  );
}
