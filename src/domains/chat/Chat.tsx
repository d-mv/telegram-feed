import { logger } from '@mv-d/toolbelt';
import { useEffect, useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import {
  CONFIG,
  isDebugLogging,
  List,
  MainCenter,
  MainSection,
  MATCH_MESSAGE_RENDERERS,
  MaybeNull,
  messagesSelector,
  selectedChatSelector,
} from '../../shared';
import { FeedContext } from '../feed/feed.context';

export default function Chat() {
  const selectedChat = useRecoilValue(selectedChatSelector);

  const messages = useRecoilValue(messagesSelector);

  const displayMessages = useMemo(
    () => messages.filter(m => m.chat_id === selectedChat?.id).sort((a, b) => a.date - b.date),
    // .reverse(),
    [messages, selectedChat?.id],
  );

  const bottomRef = useRef<MaybeNull<HTMLElement>>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  });

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

  const setBottomRef = (ref: HTMLButtonElement) => (bottomRef.current = ref);

  const renderChat = () => <List renderItem={renderMessageByIndex} setBottomRef={setBottomRef} />;

  return (
    <MainSection>
      <MainCenter>{renderChat()}</MainCenter>
      {/* <span id='bottom' ref={bottomRef} /> */}
    </MainSection>
  );
}
