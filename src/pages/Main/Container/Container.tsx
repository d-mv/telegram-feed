import { PropsWithChildren } from 'react';
import classes from './Container.module.scss';

export function Container({ children }: PropsWithChildren) {
  return <main className={classes.container}>{children}</main>;
}
