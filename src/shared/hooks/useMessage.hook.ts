import { useMemo } from 'react';
import { TMessage } from '../entities';
import { useSelector, getChatById, getUserById } from '../store';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs, { extend } from 'dayjs';
import { getSenderFromMessage } from '../tools';
import { useUser } from './useUser.hook';

extend(relativeTime);

export function useMessage(message: TMessage) {
  const { myself } = useUser();

  const getChat = useSelector(getChatById);

  const getUser = useSelector(getUserById);

  const messageDate = useMemo(() => message.date * 1000, [message]);

  const sender = getSenderFromMessage(message, getChat, getUser, myself);

  const getRelativeMessageDate = () => dayjs(messageDate).fromNow();

  return { messageDate, sender, getRelativeMessageDate };
}
