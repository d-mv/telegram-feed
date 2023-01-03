import { useContextSelector } from 'use-context-selector';

import { Card, CardFooter, CardFooterDivider, CardHeader, CardText, useMessage } from '../../../shared';
import { FeedContext } from '../feed.context';

export function MessageText() {
  const message = useContextSelector(FeedContext, c => c.message);

  const { sender, getRelativeMessageDate } = useMessage(message);

  if (message.content['@type'] !== 'messageText') return null;

  return (
    <Card id={`message-text-${message.id}`}>
      <CardHeader>{sender}</CardHeader>
      <CardText>{message.content.text.text}</CardText>
      <CardFooter>
        {getRelativeMessageDate()}
        <CardFooterDivider />
        <div />
      </CardFooter>
    </Card>
  );
}
