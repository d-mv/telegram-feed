import { clsx } from 'clsx';
import { useMemo } from 'react';
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
  getSenderFromMessage,
  useChats,
  useUsers,
  myselfSelector,
  Image,
} from '../..';
import { FeedContext } from '../../../domains';
import { Video } from '../Video';
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

  const containerWidth = 0;

  const type = message.content['@type'];

  if (!VALID_MESSAGE_TYPES.includes(type)) return null;

  function renderWebPage() {
    if (type !== 'messageText' || !message.content.web_page) return null;

    return <CardWebPage webPage={message.content.web_page} width={containerWidth - 2} />;
  }

  return (
    <Card
      id={String(message.id)}
      onClick={openMessage()}
      className={clsx(classes.container, 'animate__animated animate__fadeIn')}
    >
      <Image />
      <Video />
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
        <CardFooterSection left>{getRelativeMessageDate()}</CardFooterSection>
        <CardDivider />
        <CardFooterSection right>
          <CardInteractionInfo interactionInfo={message.interaction_info} />
        </CardFooterSection>
      </CardFooter>
    </Card>
  );
}
