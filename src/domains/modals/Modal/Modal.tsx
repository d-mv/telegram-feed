import { capitalize } from '@mv-d/toolbelt';
import { PropsWithChildren } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';

import { Dialog } from '../Dialog';
import { Header } from '../Header';
import { modalState } from '../modals.store';
import classes from './Modal.module.scss';

export default function Modal({ children }: PropsWithChildren) {
  const closeModal = useResetRecoilState(modalState);

  const modalId = useRecoilValue(modalState);

  return (
    <section id='modal' className={classes.container}>
      <div id='modal-overlay' onClick={closeModal} className={classes.overlay} />
      <Dialog>
        <Header>{capitalize(modalId)}</Header>
        {children}
      </Dialog>
    </section>
  );
}
