import { makeMatch } from '@mv-d/toolbelt';
import { useCallback, useEffect, useState } from 'react';

import { getMessages, TMessage, useSelector, useTelegram } from '../../../shared';
import { FeedContext } from '../feed.context';
import { MessagePhoto } from '../MessagePhoto';
import { MessageText } from '../MessageText';
import classes from './Feed.module.scss';

const MATCH_RENDERERS = makeMatch({ messageText: MessageText, messagePhoto: MessagePhoto }, () => <div />);

export function Feed() {
  const { getChats } = useTelegram();

  const messages = useSelector(getMessages);

  useEffect(() => {
    getChats();
  }, []);

  const [displayMessages, setDisplayMessages] = useState<TMessage[]>([]);

  const updateFeedDisplay = useCallback(() => {
    setDisplayMessages(_ => messages.filter(m => m.message_thread_id === 0));
  }, [messages]);

  useEffect(() => {
    updateFeedDisplay();
  }, [messages, updateFeedDisplay]);

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
      <div className={classes.feed}>{displayMessages.map(renderMessage)}</div>
    </div>
  );
}
