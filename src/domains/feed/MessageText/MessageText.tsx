import { clsx } from 'clsx';
import dayjs, { extend } from 'dayjs';
import { useContextSelector } from 'use-context-selector';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useMessage } from '../../../shared';
import { FeedContext } from '../feed.context';
import classes from './MessageText.module.scss';

extend(relativeTime);

export function MessageText() {
  const message = useContextSelector(FeedContext, c => c.message);

  const { messageDate, sender } = useMessage(message);

  if (message.content['@type'] !== 'messageText') return null;

  return (
    <div className={classes.container}>
      <header>{sender}</header>
      <main>
        <p className={clsx('p4', classes.text)}>{message.content.text.text}</p>
      </main>
      <footer>{dayjs().to(messageDate)}</footer>
    </div>
  );
}
