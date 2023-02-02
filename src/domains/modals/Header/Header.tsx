import { MouseEvent, PropsWithChildren } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { Icon } from '../../../shared';

import { modalState } from '../modals.store';
import classes from './Header.module.scss';

export function Header({ children }: PropsWithChildren) {
  const closeModal = useResetRecoilState(modalState);

  return (
    <header className={classes.container}>
      <h6>{children}</h6>
      <button className={classes['close-button']} onClick={closeModal}>
        <Icon icon='close' />
      </button>
    </header>
  );
}
