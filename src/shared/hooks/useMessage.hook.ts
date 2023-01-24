import { useMemo } from 'react';
import { R } from '@mv-d/toolbelt';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs, { extend } from 'dayjs';

import { TMessage, useTelegram } from '../entities';
import { useSelector, getChatById, getUserById, getMyself } from '../store';
import { getSenderFromMessage } from '../tools';

extend(relativeTime);

export function useMessage(message: TMessage, isChat = false) {
  const messageDate = useMemo(() => message.date * 1000, [message]);

  const myself = useSelector(getMyself);

  const getRelativeMessageDate = () => dayjs(messageDate).fromNow();

  const isMyMessage = useMemo(
    () =>
      message.sender_id['@type'] === 'messageSenderUser' &&
      !R.isNil(message.sender_id.user_id) &&
      message.sender_id.user_id === myself?.id,
    [myself, message],
  );

  return { messageDate, getRelativeMessageDate, isMyMessage };
}
