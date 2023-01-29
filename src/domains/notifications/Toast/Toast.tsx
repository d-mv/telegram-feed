import { makeMatch, Optional } from '@mv-d/toolbelt';
import { useRecoilState } from 'recoil';
import { clsx } from 'clsx';
import { useCallback, useEffect } from 'react';

import { Icon, notificationsState } from '../../../shared';
import { Message, MessageTypes } from '../message.types';
import classes from './Toast.module.scss';

const SIDE_CLASSES = makeMatch(
  {
    [MessageTypes.ERROR]: classes['side-error'],
    [MessageTypes.SUCCESS]: classes['side-success'],
    [MessageTypes.WARNING]: classes['side-warning'],
  },
  classes['side-info'],
);

const ICONS = makeMatch(
  {
    [MessageTypes.ERROR]: 'error',
    [MessageTypes.SUCCESS]: 'success',
    [MessageTypes.WARNING]: 'warn',
  },
  'info',
);

const ICON_CLASSES = makeMatch(
  {
    [MessageTypes.ERROR]: classes['icon-error'],
    [MessageTypes.SUCCESS]: classes['icon-success'],
    [MessageTypes.WARNING]: classes['icon-warning'],
  },
  classes['icon-info'],
);

let timer: Optional<NodeJS.Timeout> = undefined;

export function Toast(message: Message) {
  const [messages, setMessages] = useRecoilState(notificationsState);

  const handleClick = useCallback(() => {
    setMessages(messages.filter(m => m.id !== message.id));
  }, [message.id, messages, setMessages]);

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
    }
  }

  useEffect(() => {
    timer = setTimeout(handleClick, 5000);
    return clearTimer;
  }, [handleClick]);

  return (
    <div id={`toast-${message.id}`} className={classes.container}>
      <span className={clsx(classes.side, SIDE_CLASSES[message.type])} />
      <span className={clsx(classes.icon, ICON_CLASSES[message.type])}>
        <Icon icon={ICONS[message.type]} />
      </span>
      <div className={classes.message}>
        <p className={clsx('p5', classes.text)}>{message.text}</p>
      </div>
      <button className={classes['close-button']} onClick={handleClick}>
        <Icon icon='close' />
      </button>
    </div>
  );
}
