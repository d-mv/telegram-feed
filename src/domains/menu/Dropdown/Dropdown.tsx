import { PropsWithChildren, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { menuIsOpenState } from '../menu.store';

import classes from './Dropdown.module.scss';

export function Dropdown({ children }: PropsWithChildren) {
  const isOpen = useRecoilValue(menuIsOpenState);

  const containerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <div ref={containerRef} className={classes.container}>
      {children}
    </div>
  );
}
