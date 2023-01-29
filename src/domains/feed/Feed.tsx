import { ifTrue, logger } from '@mv-d/toolbelt';
import { useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import { useGetChats } from './useGetChats.hook';

import {
  CONFIG,
  GoToTop,
  isDebugLogging,
  List,
  MainSection,
  MATCH_MESSAGE_RENDERERS,
  MaybeNull,
  MessageDivider,
  messagesSelector,
  myselfSelector,
} from '../../shared';
import { FeedContext } from './feed.context';

export default function Feed() {
  const messages = useRecoilValue(messagesSelector);

  const myself = useRecoilValue(myselfSelector);

  const topRef = useRef<MaybeNull<HTMLSpanElement>>(null);

  useGetChats();

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

  const qtyMessages = useMemo(() => displayMessages.length, [displayMessages]);

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
      <FeedContext.Provider key={message.id} value={{ message }}>
        <Component />
        <MessageDivider id={message.id} />
      </FeedContext.Provider>
    );
  }

  const setTopRef = (ref: HTMLSpanElement) => (topRef.current = ref);

  const handleGotToTop = () => topRef.current?.scrollIntoView();

  const renderFeed = () => <List renderItem={renderMessageByIndex} qtyItems={qtyMessages} setTopRef={setTopRef} />;

  return (
    <MainSection>
      {ifTrue(displayMessages.length, renderFeed)}
      <GoToTop onClick={handleGotToTop} />
    </MainSection>
  );
}
