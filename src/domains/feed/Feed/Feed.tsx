import { makeMatch, RecordObject, R, generateId } from '@mv-d/toolbelt';
import { useEffect, useState } from 'react';
import { getMessages, TMessage, useSelector, useTelegram } from '../../../shared';
import { FeedContext } from '../feed.context';
import { MessageText } from '../MessageText';
import classes from './Feed.module.scss';

const MATCH_RENDERERS = makeMatch({ messageText: MessageText }, () => <div />);

export function Feed() {
  const { getChats } = useTelegram();

  const messages = useSelector(getMessages);

  useEffect(() => {
    getChats();
  }, []);

  function renderMessage(message: TMessage) {
    const type = message.content['@type'];

    const Component = MATCH_RENDERERS[type];

    return (
      <FeedContext.Provider key={message.id} value={{ message }}>
        <Component />
      </FeedContext.Provider>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.feed}>{messages.map(renderMessage)}</div>
    </div>
  );
}
