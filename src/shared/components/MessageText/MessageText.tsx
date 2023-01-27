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
} from '../..';
import { FeedContext } from '../../../domains/feed/feed.context';
import classes from './MessageText.module.scss';

const VALID_MESSAGE_TYPES = ['messagePhoto', 'messageText'];

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

  // const getChatSelector = useSelector(getChatById);

  // const getSender = useSelector()
  // const { sender } = useSender(message, isChat);
  // const sender = useMemo(() => getSender(message), [getSender, message]);
  // useEffect(() => {
  //   // eslint-disable-next-line no-console
  //   console.log('sender', sender);
  // }, [sender]);

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
      className={clsx(classes.container, chooseClassname(), 'animate__animated animate__fadeIn')}
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
