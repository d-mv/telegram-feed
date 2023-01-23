import { logger } from '@mv-d/toolbelt';
import { useEffect, useMemo, useRef } from 'react';
import {
  CONFIG,
  getMessagesForSelectedChat,
  isDebugLogging,
  List,
  MainCenter,
  MainSection,
  MATCH_MESSAGE_RENDERERS,
  MaybeNull,
  TMessage,
  useSelector,
} from '../../shared';
import { FeedContext } from '../feed/feed.context';

export default function Chat() {
  const messages = useSelector(getMessagesForSelectedChat);

  const displayMessages = useMemo(() => messages.reverse(), [messages]);

  const bottomRef = useRef<MaybeNull<HTMLElement>>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [bottomRef]);

  // trigger loading comments for message_thread_id
  function handleClick(messageId: number) {
    return function call() {
      // eslint-disable-next-line no-console
      console.log('message click', messageId);
    };
  }

  function renderMessageByIndex(index: number) {
    const message = displayMessages[index];

    if (!message) return null;

    const type = message.content['@type'];

    // No direct input from user, so no need to be careful
    // eslint-disable-next-line security/detect-object-injection
    const Component = MATCH_MESSAGE_RENDERERS[type];

    if (!Component) {
      if (isDebugLogging(CONFIG)) logger.warn(`Missing renderer for ${type}`);

      return null;
    }

    return (
      <FeedContext.Provider
        key={message.id}
        value={{ isChat: true, message, onCardClick: handleClick(message.id), isLast: index === 0 }}
      >
        <Component />
        {/* <MessageDivider id={message.id} /> */}
      </FeedContext.Provider>
    );
  }

  const renderChat = () => <List renderItem={renderMessageByIndex} />;

  return (
    <MainSection>
      <MainCenter>{renderChat()}</MainCenter>
      <span ref={bottomRef} />
    </MainSection>
  );
}
