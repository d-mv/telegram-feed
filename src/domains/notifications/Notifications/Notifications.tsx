import { getMessages, useSelector } from '../../../shared';
import { Message } from '../message.types';
import { Toast } from '../Toast';
import classes from './Notifications.module.scss';

export function Notifications() {
  const messages = useSelector(getMessages);

  function renderMessages(message: Message) {
    return <Toast key={message.id} {...message} />;
  }

  return <div className={classes.container}>{messages.map(renderMessages)}</div>;
}
