import { logger, makeMatch } from '@mv-d/toolbelt';
import { MouseEvent, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { getMessages, Icon, TMessage, useSelector, useTelegram, useUser } from '../../../shared';
import { FeedContext } from '../feed.context';
import { MessagePhoto } from '../MessagePhoto';
import { MessageText } from '../MessageText';
import classes from './Feed.module.scss';

// "messageAnimatedEmoji", "messageUnsupported", "messageVideo"
const MATCH_RENDERERS = makeMatch({ messageText: MessageText, messagePhoto: MessagePhoto }, null);

export default function Feed() {
  const { getChats } = useTelegram();

  const { byMyself } = useUser();

  const messages = useSelector(getMessages);

  const navigate = useNavigate();

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

  function handleClick(chatId: number) {
    return function click(e: MouseEvent<HTMLDivElement>) {
      if ('path' in e.nativeEvent) {
        const path = e.nativeEvent.path as HTMLElement[];

        const outsideLink = path.find(el => el.id === 'outside-link');

        if (outsideLink) {
          e.stopPropagation();
          logger.info('Outside link clicked');
          return;
        }
      }

      navigate(`/chat/${chatId}`);
    };
  }

  function renderMessage(message: TMessage) {
    const type = message.content['@type'];

    const Component = MATCH_RENDERERS[type];

    if (!Component) {
      logger.warn(`Missing renderer for ${type}`);
      return null;
    }

    return (
      <FeedContext.Provider key={message.id} value={{ message, onCardClick: handleClick(message.chat_id) }}>
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
