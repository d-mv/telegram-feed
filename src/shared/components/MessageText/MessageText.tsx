import { clsx } from 'clsx';
import { useRef, useMemo } from 'react';
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
} from '../..';
import { FeedContext } from '../../../domains/feed/feed.context';
import classes from './MessageText.module.scss';

const VALID_MESSAGE_TYPES = ['messagePhoto', 'messageText'];

export function MessageText() {
  const [message, onClick, isChat] = useContextSelector(FeedContext, c => [c.message, c.onCardClick, c.isChat]);

  const { sender, getRelativeMessageDate, isMyMessage } = useMessage(message, isChat);

  const text = useTextProcessor(message.content);

  const containerRef = useRef<MaybeNull<HTMLDivElement | HTMLImageElement>>(null);

  const currentContainerRef = containerRef?.current;

  const containerWidth = useMemo(() => (currentContainerRef?.clientWidth || 0) / 10, [currentContainerRef]);

  if (!VALID_MESSAGE_TYPES.includes(message.content['@type'])) return null;

  function chooseClassname() {
    if (!isChat) return;

    if (isMyMessage) return classes.myself;

    return classes.owner;
  }

  function renderWebPage() {
    if (message.content['@type'] === 'messageText' && message.content.web_page) return null;

    // @ts-ignore -- typescript doesn't choose the type correctly
    return <CardWebPage webPage={message.content.web_page} />;
  }

  function renderPhoto() {
    if (message.content['@type'] !== 'messagePhoto') return null;

    return <CardPhoto photo={message.content.photo} widthRem={containerWidth} />;
  }

  return (
    <Card
      containerRef={containerRef}
      id={`message-text-${message.id}`}
      onClick={onClick}
      className={clsx(classes.container, chooseClassname())}
    >
      {renderPhoto()}
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
