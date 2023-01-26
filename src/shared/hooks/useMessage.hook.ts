import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs, { extend } from 'dayjs';
import { isNil } from 'ramda';

import { TMessage } from '../entities';
import { myselfSelector } from '../store';

extend(relativeTime);

// TODO: why isChat here?
export function useMessage(message: TMessage, isChat = false) {
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

  return { messageDate, getRelativeMessageDate, isMyMessage };
}
