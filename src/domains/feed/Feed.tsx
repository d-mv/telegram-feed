import { ifTrue, option } from '@mv-d/toolbelt';
import { useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';

import { useGetChats } from './useGetChats.hook';
import {
  contextLogger,
  getPhotoSize,
  GoToTop,
  List,
  MainSection,
  MATCH_MESSAGE_RENDERERS,
  MaybeNull,
  MessageDivider,
  messagesSelector,
  myselfSelector,
  TMessage,
  TVideo,
} from '../../shared';
import { FeedContext } from './feed.context';
import { compose, path } from 'ramda';

const { warn } = contextLogger('Feed');

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

    // TODO: add retrieve of 'messageForwardInfo' and 'messageReplyInfo'?
    if (!Component) {
      warn(`Missing renderer for ${type}`);
      return null;
    }

    // TODO: abstract into fn
    const thumbnail =
      type === 'messagePhoto'
        ? message.content.photo.minithumbnail.data
        : type === 'messageVideo'
        ? message.content.video.minithumbnail.data
        : '';

    const getWebPagePhoto = (e: TMessage) => (e.content['@type'] === 'messageText' ? e.content.web_page?.photo : null);

    const getWebPageThumbnail = (e: TMessage) =>
      e.content['@type'] === 'messageText' ? e.content.web_page?.photo?.minithumbnail?.data : null;

    const getPhoto = (e: TMessage) => (e.content['@type'] === 'messagePhoto' ? e.content.photo : null);

    const getVideo = (e: TMessage) => (e.content['@type'] === 'messageVideo' ? e.content.video : null);

    return (
      <FeedContext.Provider
        key={message.id}
        value={{
          message,
          photo: compose(getPhotoSize, getPhoto)(message),
          webPagePhoto: compose(getPhotoSize, getWebPagePhoto)(message),
          webPageThumbnail: getWebPageThumbnail(message) || '',
          video: compose(option<TVideo>, getVideo)(message),
          thumbnail,
        }}
      >
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
