import { clsx } from 'clsx';
import { PropsWithChildren, MouseEvent } from 'react';
import { useSetRecoilState } from 'recoil';

import classes from './Card.module.scss';
import { containerWidthSelector } from '../../store';

interface CardProps {
  id: string;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export function Card({ children, id, className, onClick }: PropsWithChildren<CardProps>) {
  const setContainerWidth = useSetRecoilState(containerWidthSelector);

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    if (onClick) {
      e.persist();
      onClick(e);
    }
  }

  return (
    <article
      ref={r => setContainerWidth((r?.clientWidth || 0) / 10)}
      id={id}
      className={clsx(classes.container, className)}
      onClick={handleClick}
    >
      {children}
    </article>
  );
}
