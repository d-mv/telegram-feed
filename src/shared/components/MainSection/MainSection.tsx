import { PropsWithChildren } from 'react';
import classes from './MainSection.module.scss';

export function MainSection({ children }: PropsWithChildren) {
  return <section className={classes.container}>{children}</section>;
}
