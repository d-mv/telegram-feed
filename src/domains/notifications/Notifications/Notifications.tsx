import { getMessages, useSelector } from '../../../shared';
import { Message } from '../message.types';
import classes from './Notifications.module.scss';
import { Toast } from '../Toast';

export function Notifications() {
  const messages = useSelector(getMessages);

  function renderMessages(message: Message) {
    return <Toast key={message.id} {...message} />;
  }

  return <div className={classes.container}>{messages.map(renderMessages)}</div>;
}
