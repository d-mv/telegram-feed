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
  MaybeNull,
  getSenderFromMessage,
  useChats,
  useUsers,
  myselfSelector,
  CardMedia,
} from '../..';
import { FeedContext } from '../../../domains/feed/feed.context';
import classes from './MessageText.module.scss';

const VALID_MESSAGE_TYPES = ['messagePhoto', 'messageText', 'messageVideo'];

export function MessageText() {
  const message = useContextSelector(FeedContext, c => c.message);

  const myself = useRecoilValue(myselfSelector);

  const { getRelativeMessageDate, openMessage } = useMessage(message);

  const { getChatById } = useChats();

  const { getUserById } = useUsers();

  const sender = useMemo(
    () =>
      getSenderFromMessage({
        message,
        getChat: getChatById,
        getUser: getUserById,
        myself,
      }),
    [getChatById, getUserById, message, myself],
  );

  const text = useTextProcessor(message.content);

  const containerRef = useRef<MaybeNull<HTMLDivElement | HTMLImageElement>>(null);

  const currentContainerRef = containerRef?.current;

  const containerWidth = useMemo(() => (currentContainerRef?.clientWidth || 0) / 10, [currentContainerRef]);

  const type = message.content['@type'];

  if (!VALID_MESSAGE_TYPES.includes(type)) return null;

  function renderWebPage() {
    if (type !== 'messageText' || !message.content.web_page) return null;

    return <CardWebPage webPage={message.content.web_page} width={containerWidth - 2} />;
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
      onClick={openMessage()}
      className={clsx(classes.container, 'animate__animated animate__fadeIn')}
    >
      {renderMedia()}
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
