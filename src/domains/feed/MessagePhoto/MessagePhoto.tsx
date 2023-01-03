import { useContextSelector } from 'use-context-selector';

import { Card, CardFooter, CardFooterDivider, CardHeader, CardPhoto, CardText, useMessage } from '../../../shared';
import { FeedContext } from '../feed.context';

export function MessagePhoto() {
  const message = useContextSelector(FeedContext, c => c.message);

  const { getRelativeMessageDate, sender } = useMessage(message);

  if (message.content['@type'] !== 'messagePhoto') return null;

  // eslint-disable-next-line no-console
  console.log('### photo', message);

  return (
    <Card id={`message-photo-${message.id}`}>
      <CardPhoto photo={message.content.photo} />
      <CardHeader>{sender}</CardHeader>
      <CardText>{message.content.caption.text}</CardText>
      <CardFooter>
        {getRelativeMessageDate()}
        <CardFooterDivider />
        <div />
      </CardFooter>
    </Card>
  );
}