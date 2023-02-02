import { ifTrue, Optional } from '@mv-d/toolbelt';
import { LazyExoticComponent, PropsWithChildren } from 'react';
import { useResetRecoilState } from 'recoil';

import { Icon, LazyLoad, modalState } from '../../../shared';
import classes from './Header.module.scss';

interface HeaderProps {
  widget: Optional<LazyExoticComponent<() => JSX.Element>>;
}

export function Header({ children, widget }: PropsWithChildren<HeaderProps>) {
  const closeModal = useResetRecoilState(modalState);

  function renderWidget() {
    if (!widget) return null;

    const Widget = widget;

    return (
      <LazyLoad>
        <Widget />
      </LazyLoad>
    );
  }

  return (
    <header className={classes.container}>
      <div className={classes.left}>
        <h6>{children}</h6>
        {ifTrue(widget, renderWidget)}
      </div>
      <button className={classes['close-button']} onClick={closeModal}>
        <Icon icon='close' />
      </button>
    </header>
  );
}
