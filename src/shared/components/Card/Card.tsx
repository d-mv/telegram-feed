import { clsx } from 'clsx';
import { R } from '@mv-d/toolbelt';
import { MutableRefObject, PropsWithChildren } from 'react';

import classes from './Card.module.scss';
import { setSelectedChatId, useDispatch } from '../../store';
import { MaybeNull } from '../../types';

interface CardProps {
  id: string;
  chatId: number;
  className?: string;
  containerRef?: MutableRefObject<MaybeNull<HTMLElement>>;
}

export function Card({ children, id, chatId, className, containerRef }: PropsWithChildren<CardProps>) {
  const dispatch = useDispatch();

  function handleClick() {
    R.compose(dispatch, setSelectedChatId)(chatId);
  }

  return (
    <article ref={containerRef} id={id} className={clsx(classes.container, className)} onClick={handleClick}>
      {children}
    </article>
  );
}
