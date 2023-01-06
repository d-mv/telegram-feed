import { useMemo } from 'react';
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
} from '../../../shared';
import { FeedContext } from '../feed.context';

export function MessageText() {
  const message = useContextSelector(FeedContext, c => c.message);

  const { sender, getRelativeMessageDate } = useMessage(message);

  const text = useTextProcessor(message.content);

  if (message.content['@type'] !== 'messageText') {
    // eslint-disable-next-line no-console
    console.log('missing incorrect', message);
    return null;
  }

  const hasWebPage = message.content.web_page;

  function renderWebPage() {
    if (!hasWebPage) return null;

    // @ts-ignore -- typescript doesn't choose the type correctly
    return <CardWebPage webPage={message.content.web_page} />;
  }

  return (
    <Card id={`message-text-${message.id}`} chatId={message.chat_id}>
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
        {getRelativeMessageDate()}
        <CardDivider />
        <CardInteractionInfo interactionInfo={message.interaction_info} />
      </CardFooter>
    </Card>
  );
}
