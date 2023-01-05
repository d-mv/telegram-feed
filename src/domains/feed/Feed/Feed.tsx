import { makeMatch } from '@mv-d/toolbelt';
import { useCallback, useEffect, useState } from 'react';

import { getMessages, TMessage, useSelector, useTelegram, useUser } from '../../../shared';
import { FeedContext } from '../feed.context';
import { MessagePhoto } from '../MessagePhoto';
import { MessageText } from '../MessageText';
import classes from './Feed.module.scss';

// "messageAnimatedEmoji", "messageUnsupported",
const MATCH_RENDERERS = makeMatch({ messageText: MessageText, messagePhoto: MessagePhoto }, () => <div />);

export function Feed() {
  const { getChats } = useTelegram();

  const { byMyself } = useUser();

  const messages = useSelector(getMessages);

  useEffect(() => {
    getChats();
  }, []);

  const [displayMessages, setDisplayMessages] = useState<TMessage[]>([]);

  const updateFeedDisplay = useCallback(() => {
    setDisplayMessages(_ =>
      // don't show comments to thread and messages from myself
      messages.filter(m => {
        if (m.message_thread_id !== 0) return false;

        if (m.sender_id['@type'] === 'messageSenderUser' && byMyself(m.sender_id.user_id)) return false;

        return true;
      }),
    );
  }, [byMyself, messages]);

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
