import { ifTrue } from '@mv-d/toolbelt';
import { useContextSelector } from 'use-context-selector';

import { Card, CardFooter, CardDivider, CardHeader, CardText, CardWebPage, useMessage, Icon } from '../../../shared';
import { FeedContext } from '../feed.context';

export function MessageText() {
  const message = useContextSelector(FeedContext, c => c.message);

  const { sender, getRelativeMessageDate } = useMessage(message);

  if (message.content['@type'] !== 'messageText') return null;

  const hasWebPage = message.content.web_page;

  function renderWebPage() {
    if (!hasWebPage) return null;

    // @ts-ignore -- typescript doesn't choose the type correctly
    return <CardWebPage webPage={message.content.web_page} />;
  }

  // eslint-disable-next-line no-console
  console.log('###', message.content);
  // TODO: add interaction_info

  function renderStatistics() {
    const views = message.interaction_info?.view_count ? (
      <>
        <Icon icon='eye' />
        {message.interaction_info.view_count}
      </>
    ) : (
      <span />
    );

    const forward_count = message.interaction_info?.forward_count ? (
      <>
        <Icon icon='forward' />
        {message.interaction_info.forward_count}
      </>
    ) : (
      <span />
    );

    return (
      <div style={{ display: 'flex' }}>
        {views}
        {forward_count}
      </div>
    );
  }

  return (
    <Card id={`message-text-${message.id}`}>
      <CardHeader>{sender}</CardHeader>
      <CardText>{message.content.text.text}</CardText>
      {renderWebPage()}
      <CardFooter>
        {getRelativeMessageDate()}
        <CardDivider />
        {renderStatistics()}
      </CardFooter>
    </Card>
  );
}
