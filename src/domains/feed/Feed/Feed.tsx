import { ifTrue, logger, R } from '@mv-d/toolbelt';
import { MouseEvent, useMemo } from 'react';

import {
  CONFIG,
  getChatById,
  getLoadMessage,
  getMessages,
  isDebugLogging,
  List,
  MainCenter,
  MainSection,
  MATCH_MESSAGE_RENDERERS,
  MessageDivider,
  RenderList,
  setSelectedChatId,
  TMessage,
  useDispatch,
  useSelector,
  useUser,
} from '../../../shared';
import { FeedContext } from '../feed.context';

export default function Feed() {
  const { byMyself } = useUser();

  const dispatch = useDispatch();

  const messages = useSelector(getMessages);

  const getChat = useSelector(getChatById);

  const loadMessage = useSelector(getLoadMessage);

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

          if (isDebugLogging(CONFIG)) logger.info('Outside link clicked');

          return;
        }
      }

      R.compose(dispatch, setSelectedChatId)({ id: chatId, title: getChat(chatId)?.title || '' });
    };
  }

  function renderMessage(message: TMessage) {
    const type = message.content['@type'];

    // No direct input from user, so no need to be careful
    // eslint-disable-next-line security/detect-object-injection
    const Component = MATCH_MESSAGE_RENDERERS[type];

    if (!Component) {
      if (isDebugLogging(CONFIG)) logger.warn(`Missing renderer for ${type}`);

      return <div />;
    }

    return (
      <FeedContext.Provider key={message.id} value={{ message, onCardClick: handleClick(message.chat_id) }}>
        <MainCenter>
          <Component />
          <MessageDivider id={message.id} />
        </MainCenter>
      </FeedContext.Provider>
    );
  }

  const renderFeed = () => (
    <List
      messages={displayMessages.filter(m => m.content['@type'] in MATCH_MESSAGE_RENDERERS)}
      render={renderMessage}
    />
  );

  return (
    <MainSection>
      <MainCenter>
        {ifTrue(loadMessage, <p>{loadMessage}</p>)}
        {ifTrue(!loadMessage, renderFeed)}
      </MainCenter>
    </MainSection>
  );
}
