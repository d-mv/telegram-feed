import { ifTrue, logger } from '@mv-d/toolbelt';
import { MouseEvent, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  CONFIG,
  isDebugLogging,
  List,
  MainSection,
  MATCH_MESSAGE_RENDERERS,
  MessageDivider,
  messagesSelector,
  myselfSelector,
  selectedChatSelector,
  useChats,
} from '../../shared';
import { FeedContext } from './feed.context';

export default function Feed() {
  const messages = useRecoilValue(messagesSelector);

  const myself = useRecoilValue(myselfSelector);

  const setSelectedChatId = useSetRecoilState(selectedChatSelector);

  const { getChatById } = useChats();

  const displayMessages = useMemo(
    () =>
      messages
        .filter(message => {
          if (!myself) return false;

          // don't show comments to thread and messages from myself
          if (message.message_thread_id !== 0) return false;

          if (message.sender_id['@type'] === 'messageSenderUser' && message.sender_id.user_id === myself.id)
            return false;

          return true;
        })
        .sort((a, b) => b.date - a.date),

    [messages, myself],
  );

  function handleClick(chatId: number) {
    return function click(e: MouseEvent<HTMLDivElement>) {
      if ('path' in e.nativeEvent) {
        const path = e.nativeEvent.path as HTMLElement[];

        const outsideLink = path.find(el => el.id === 'outside-link');

        if (outsideLink) {
          e.stopPropagation();

          if (isDebugLogging(CONFIG)) logger.info('Outside link clicked');
        }
      }

      const chat = getChatById(chatId);

      if (chat) setSelectedChatId({ id: chatId, title: chat.title || '' });
    };
  }

  function renderMessageByIndex(index: number) {
    // eslint-disable-next-line security/detect-object-injection
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
      <FeedContext.Provider key={message.id} value={{ message, onCardClick: handleClick(message.chat_id) }}>
        <Component />
        <MessageDivider id={message.id} />
      </FeedContext.Provider>
    );
  }

  const renderFeed = () => <List renderItem={renderMessageByIndex} />;

  return <MainSection>{ifTrue(displayMessages.length, renderFeed)}</MainSection>;
}
