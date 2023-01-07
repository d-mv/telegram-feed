import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { MutableRefObject, PropsWithChildren, MouseEvent } from 'react';

import classes from './Card.module.scss';
import { MaybeNull } from '../../types';

interface CardProps {
  id: string;

  className?: string;
  containerRef?: MutableRefObject<MaybeNull<HTMLElement>>;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export function Card({ children, id, className, containerRef, onClick }: PropsWithChildren<CardProps>) {
  function handleClick(e: MouseEvent<HTMLDivElement>) {
    if (onClick) {
      e.persist();
      onClick(e);
    }
  }

  return (
    <article ref={containerRef} id={id} className={clsx(classes.container, className)} onClick={handleClick}>
      {children}
    </article>
  );
}
