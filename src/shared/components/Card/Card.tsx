import { clsx } from 'clsx';
import { R } from '@mv-d/toolbelt';
import { PropsWithChildren } from 'react';

import classes from './Card.module.scss';
import { setSelectedChatId, useDispatch } from '../../store';

interface CardProps {
  id: string;
  chatId: number;
  className?: string;
}

export function Card({ children, id, chatId, className }: PropsWithChildren<CardProps>) {
  const dispatch = useDispatch();

  function handleClick() {
    R.compose(dispatch, setSelectedChatId)(chatId);
  }

  return (
    <div id={id} className={clsx(classes.container, className)} onClick={handleClick}>
      {children}
    </div>
  );
}
