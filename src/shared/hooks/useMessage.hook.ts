import { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs, { extend } from 'dayjs';
import { isNil } from 'ramda';

import { TelegramService, TMessage, TMessageLink } from '../entities';
import { myselfSelector } from '../store';

extend(relativeTime);

// TODO: why isChat here?
export function useMessage(message: TMessage) {
  const messageDate = useMemo(() => message.date * 1000, [message]);

  const myself = useRecoilValue(myselfSelector);

  const getRelativeMessageDate = () => dayjs(messageDate).fromNow();

  const isMyMessage = useMemo(
    () =>
      message.sender_id['@type'] === 'messageSenderUser' &&
      !isNil(message.sender_id.user_id) &&
      message.sender_id.user_id === myself?.id,
    [myself, message],
  );

  const getMessageLinkByMessageId = useCallback(async (deepLink = true) => {
    const result = await TelegramService.send<TMessageLink>({
      type: 'getMessageLink',
      chat_id: message.chat_id,
      message_id: message.id,
    });

    // TODO: notification
    if (result.isNone) return '';

    // TODO: cover private ones
    if (!deepLink) return result.value.link;

    const [chatName, messageId] = result.value.link.split('/').slice(3);

    return `tg://resolve?domain=${chatName}&post=${messageId}&single`;
  }, []);

  const openMessageIn = useCallback(
    async (app = true) => {
      const link = await getMessageLinkByMessageId(app);

      if (!link) return;

      window.open(link, '_blank');
    },
    [getMessageLinkByMessageId],
  );

  const openMessage = useCallback(
    (app = true) =>
      () =>
        openMessageIn(app),
    [openMessageIn],
  );

  return {
    messageDate,
    getRelativeMessageDate,
    isMyMessage,
    getMessageLinkByMessageId,
    openMessageIn,
    openMessage,
  };
}
