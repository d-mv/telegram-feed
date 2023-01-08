import { logger } from '@mv-d/toolbelt';
import { useRef } from 'react';
import {
  CONFIG,
  getMessagesForSelectedChat,
  isDebugLogging,
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

  const bottomRef = useRef<MaybeNull<HTMLElement>>(null);

  // TODO: finish
  if (bottomRef.current) {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  // trigger loading comments for message_thread_id
  function handleClick(messageId: number) {
    return function call() {
      // eslint-disable-next-line no-console
      console.log('message click', messageId);
    };
  }

  function renderMessage(message: TMessage, i: number) {
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
        value={{ isChat: true, message, onCardClick: handleClick(message.id), isLast: i === 0 }}
      >
        <Component />
        {/* <MessageDivider id={message.id} /> */}
      </FeedContext.Provider>
    );
  }

  return (
    <MainSection>
      <MainCenter>{messages.reverse().map(renderMessage)}</MainCenter>
      <span ref={bottomRef} />
    </MainSection>
  );
}
