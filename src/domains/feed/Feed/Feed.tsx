import { ifTrue, logger, R } from '@mv-d/toolbelt';
import { MouseEvent, useMemo } from 'react';

import {
  CONFIG,
  getByMyself,
  getChatById,
  getLoadMessage,
  getMessages,
  isDebugLogging,
  List,
  MainSection,
  MATCH_MESSAGE_RENDERERS,
  MessageDivider,
  setSelectedChatId,
  useDispatch,
  useSelector,
} from '../../../shared';
import { FeedContext } from '../feed.context';
import classes from './Feed.module.scss';

export default function Feed() {
  const dispatch = useDispatch();

  const messages = useSelector(getMessages);

  const getChat = useSelector(getChatById);

  const byMyself = useSelector(getByMyself);

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
      <FeedContext.Provider key={message.id} value={{ message, onCardClick: handleClick(message.chat_id) }}>
        <Component />
        <MessageDivider id={message.id} />
      </FeedContext.Provider>
    );
  }

  const renderFeed = () => <List renderItem={renderMessageByIndex} />;

  return (
    <MainSection>
      {ifTrue(
        loadMessage,
        <div className={classes.loading}>
          <p className='p4'>{loadMessage}</p>
        </div>,
      )}
      {ifTrue(!loadMessage, renderFeed)}
    </MainSection>
  );
}
