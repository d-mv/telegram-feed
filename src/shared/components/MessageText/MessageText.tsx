import { clsx } from 'clsx';
import { useRef, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useContextSelector } from 'use-context-selector';

import {
  Card,
  CardFooter,
  CardDivider,
  CardHeader,
  CardText,
  CardWebPage,
  useMessage,
  CardInteractionInfo,
  useTextProcessor,
  CardFooterSection,
  CardPhoto,
  MaybeNull,
  getSenderFromMessage,
  useChats,
  useUsers,
  myselfSelector,
  CardVideo,
  CardMedia,
} from '../..';
import { FeedContext } from '../../../domains/feed/feed.context';
import classes from './MessageText.module.scss';

const VALID_MESSAGE_TYPES = ['messagePhoto', 'messageText', 'messageVideo'];

export function MessageText() {
  const [message, onClick, isChat] = useContextSelector(FeedContext, c => [c.message, c.onCardClick, c.isChat]);

  const myself = useRecoilValue(myselfSelector);

  const { getRelativeMessageDate, isMyMessage } = useMessage(message, isChat);

  const { getChatById } = useChats();

  const { getUserById } = useUsers();

  const sender = useMemo(
    () =>
      getSenderFromMessage({
        isChat,
        message,
        getChat: getChatById,
        getUser: getUserById,
        myself,
      }),
    [getChatById, getUserById, isChat, message, myself],
  );

  const text = useTextProcessor(message.content);

  const containerRef = useRef<MaybeNull<HTMLDivElement | HTMLImageElement>>(null);

  const currentContainerRef = containerRef?.current;

  const containerWidth = useMemo(() => (currentContainerRef?.clientWidth || 0) / 10, [currentContainerRef]);

  const type = message.content['@type'];

  if (!VALID_MESSAGE_TYPES.includes(type)) return null;

  function chooseClassname() {
    if (!isChat) return;

    if (isMyMessage) return classes.myself;

    return classes.owner;
  }

  function renderWebPage() {
    if (type === 'messageText' && message.content.web_page) return null;

    // @ts-ignore -- typescript doesn't choose the type correctly
    return <CardWebPage webPage={message.content.web_page} />;
  }

  function renderPhoto() {
    if (type !== 'messagePhoto') return null;

    return <CardPhoto media={message.content.photo} widthRem={containerWidth} />;
  }

  function renderVideo() {
    if (type !== 'messageVideo') return null;

    return <CardVideo media={message.content.video} widthRem={containerWidth} />;
  }

  function renderMedia() {
    if (type !== 'messagePhoto' && type !== 'messageVideo') return null;

    const media = type === 'messageVideo' ? message.content.video : message.content.photo;

    return <CardMedia asBackground media={media} width={containerWidth} />;
  }

  return (
    <Card
      containerRef={containerRef}
      id={`${type}-${message.id}`}
      onClick={onClick}
      className={clsx(classes.container, chooseClassname(), 'animate__animated animate__fadeIn')}
    >
      {renderMedia()}
      {/* {renderPhoto()} */}
      {/* {renderVideo()} */}
      <CardHeader>{sender}</CardHeader>
      <CardText>
        <span
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      </CardText>
      {renderWebPage()}
      <CardFooter>
        <CardFooterSection>{getRelativeMessageDate()}</CardFooterSection>
        <CardDivider />
        <CardFooterSection>
          <CardInteractionInfo interactionInfo={message.interaction_info} />
        </CardFooterSection>
      </CardFooter>
    </Card>
  );
}
