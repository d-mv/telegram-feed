import { useMemo } from 'react';
import { TMessage } from '../entities';
import { useSelector, getChatById, getUserById } from '../store';

export function useMessage(message: TMessage) {
  const getChat = useSelector(getChatById);

  const getUser = useSelector(getUserById);

  const messageDate = useMemo(() => message.date * 1000, [message]);

  function getSender() {
    const s = message.sender_id;

    const chat = getChat(message.chat_id);

    if (s['@type'] === 'messageSenderUser') {
      const user = getUser(s.user_id);

      const senderName = `${user?.first_name} ${user?.last_name}`;

      if (senderName === chat?.title) return senderName;

      return `${chat?.title} (${senderName})`;
    }

    return getChat(s.chat_id)?.title;
  }

  return { messageDate, sender: getSender() };
}
