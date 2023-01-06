import { Optional } from '@mv-d/toolbelt';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import {
  Card,
  CardFooter,
  CardDivider,
  CardHeader,
  CardPhoto,
  CardText,
  useMessage,
  CardInteractionInfo,
  MaybeNull,
  useTextProcessor,
} from '../../../shared';
import { FeedContext } from '../feed.context';

export function MessagePhoto() {
  const message = useContextSelector(FeedContext, c => c.message);

  const { getRelativeMessageDate, sender } = useMessage(message);

  const containerRef = useRef<MaybeNull<HTMLDivElement | HTMLImageElement>>(null);

  const currentContainerRef = containerRef?.current;

  const containerWidth = useMemo(() => (currentContainerRef?.clientWidth || 0) / 10, [currentContainerRef]);

  const text = useTextProcessor(message.content);

  if (message.content['@type'] !== 'messagePhoto') {
    // eslint-disable-next-line no-console
    console.log('missing incorrect photo', message);
    return null;
  }

  return (
    <Card containerRef={containerRef} id={`message-photo-${message.id}`} chatId={message.chat_id}>
      <CardPhoto photo={message.content.photo} widthRem={containerWidth} />
      <CardHeader>{sender}</CardHeader>
      <CardText>
        <span
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        />
      </CardText>
      <CardFooter>
        {getRelativeMessageDate()}
        <CardDivider />
        <CardInteractionInfo interactionInfo={message.interaction_info} />
      </CardFooter>
    </Card>
  );
}
