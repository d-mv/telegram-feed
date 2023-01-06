import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { MutableRefObject, PropsWithChildren } from 'react';

import classes from './Card.module.scss';
import { MaybeNull } from '../../types';

interface CardProps {
  id: string;
  chatId: number;
  className?: string;
  containerRef?: MutableRefObject<MaybeNull<HTMLElement>>;
}

export function Card({ children, id, chatId, className, containerRef }: PropsWithChildren<CardProps>) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/chat/${chatId}`);
  }

  return (
    <article ref={containerRef} id={id} className={clsx(classes.container, className)} onClick={handleClick}>
      {children}
    </article>
  );
}
