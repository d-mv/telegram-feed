import { clsx } from 'clsx';
import { MutableRefObject, PropsWithChildren } from 'react';
import { MaybeNull } from '../../types';
import classes from './MainCenter.module.scss';

interface MainCenterProps {
  isReverse?: boolean;
  containerRef?: MutableRefObject<MaybeNull<HTMLElement>>;
}

export function MainCenter({ children, isReverse, containerRef }: PropsWithChildren<MainCenterProps>) {
  return (
    <section id='main-center' ref={containerRef} className={clsx(classes.container, { [classes.reverse]: isReverse })}>
      {children}
    </section>
  );
}
