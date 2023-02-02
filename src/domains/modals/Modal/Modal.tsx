import { capitalize } from '@mv-d/toolbelt';
import { path } from 'ramda';
import { LazyExoticComponent, PropsWithChildren } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';

import { LazyLoad, modalState } from '../../../shared';
import { Dialog } from '../Dialog';
import { Header } from '../Header';
import classes from './Modal.module.scss';

interface ModalProps {
  widgets?: Record<string, LazyExoticComponent<() => JSX.Element>>;
  footer?: LazyExoticComponent<() => JSX.Element>;
}

export default function Modal({ children, widgets, footer }: PropsWithChildren<ModalProps>) {
  const closeModal = useResetRecoilState(modalState);

  const modalId = useRecoilValue(modalState);

  function renderFooter() {
    if (!footer) return null;

    const Footer = footer;

    return (
      <LazyLoad>
        <Footer />
      </LazyLoad>
    );
  }

  return (
    <section id='modal' className={classes.container}>
      <div id='modal-overlay' onClick={closeModal} className={classes.overlay} />
      <Dialog>
        <Header widget={path(['header'], widgets)}>{capitalize(modalId)}</Header>
        {children}
        {renderFooter()}
      </Dialog>
    </section>
  );
}
