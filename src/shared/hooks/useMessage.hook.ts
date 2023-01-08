import { useMemo } from 'react';
import { R } from '@mv-d/toolbelt';
import { TMessage } from '../entities';
import { useSelector, getChatById, getUserById } from '../store';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs, { extend } from 'dayjs';
import { getSenderFromMessage } from '../tools';
import { useUser } from './useUser.hook';
import { useContextSelector } from 'use-context-selector';
import { FeedContext } from '../../domains/feed/feed.context';

extend(relativeTime);

export function useMessage(message: TMessage, isChat = false) {
  const { myself } = useUser();

  const getChat = useSelector(getChatById);

  const getUser = useSelector(getUserById);

  const messageDate = useMemo(() => message.date * 1000, [message]);

  const sender = getSenderFromMessage({ isChat, message, getChat, getUser, myself });

  const getRelativeMessageDate = () => dayjs(messageDate).fromNow();

  const isMyMessage = useMemo(
    () =>
      message.sender_id['@type'] === 'messageSenderUser' &&
      !R.isNil(message.sender_id.user_id) &&
      message.sender_id.user_id === myself?.id,
    [myself, message],
  );

  return { messageDate, sender, getRelativeMessageDate, isMyMessage };
}
