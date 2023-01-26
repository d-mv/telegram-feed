import { useRecoilValue } from 'recoil';

import { notificationsSelector } from '../../../shared';
import { Message } from '../message.types';
import { Toast } from '../Toast';
import classes from './Notifications.module.scss';

export function Notifications() {
  const notifications = useRecoilValue(notificationsSelector);

  function renderNotifications(message: Message) {
    return <Toast key={message.id} {...message} />;
  }

  return <div className={classes.container}>{notifications.map(renderNotifications)}</div>;
}
