import { logger, makeMatch } from '@mv-d/toolbelt';
import { useEffect, useMemo } from 'react';

import { getMessages, Icon, TMessage, useSelector, useTelegram, useUser } from '../../../shared';
import { FeedContext } from '../feed.context';
import { MessagePhoto } from '../MessagePhoto';
import { MessageText } from '../MessageText';
import classes from './Feed.module.scss';

// "messageAnimatedEmoji", "messageUnsupported", "messageVideo"
const MATCH_RENDERERS = makeMatch({ messageText: MessageText, messagePhoto: MessagePhoto }, null);

export function Feed() {
  const { getChats } = useTelegram();

  const { byMyself } = useUser();

  const messages = useSelector(getMessages);

  useEffect(() => {
    getChats();
  }, []);

  const displayMessages = useMemo(
    () =>
      // don't show comments to thread and messages from myself
      messages.filter(m => {
        if (m.message_thread_id !== 0) return false;

        if (m.sender_id['@type'] === 'messageSenderUser' && byMyself(m.sender_id.user_id)) return false;

        return true;
      }),
    [byMyself, messages],
  );

  function renderMessage(message: TMessage) {
    const type = message.content['@type'];

    const Component = MATCH_RENDERERS[type];

    if (!Component) {
      logger.warn(`Missing renderer for ${type}`);
      return null;
    }

    return (
      <FeedContext.Provider key={message.id} value={{ message }}>
        <Component />
        <div id={`divider-${message.id}`} className={classes['message-divider']}>
          <Icon icon='radioCircle' />
        </div>
      </FeedContext.Provider>
    );
  }

  return (
    <section className={classes.container}>
      <div className={classes.feed}>{displayMessages.map(renderMessage)}</div>
    </section>
  );
}
