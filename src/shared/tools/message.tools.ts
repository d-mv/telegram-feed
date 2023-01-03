import { TChat, TMessage, TUser } from '../entities';

export function getSenderFromMessage(
  message: TMessage,
  getChat: (id: number) => TChat | undefined,
  getUser: (id: number) => TUser | undefined,
) {
  const s = message.sender_id;

  const chat = getChat(message.chat_id);

  if (s['@type'] === 'messageSenderUser') {
    const user = getUser(s.user_id);

    if (!user) return '';

    const senderName = `${user?.first_name} ${user?.last_name}`;

    if (senderName === chat?.title) return senderName;

    return `${chat?.title} (${senderName})`;
  }

  return getChat(s.chat_id)?.title;
}
