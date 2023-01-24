import { Optional } from '@mv-d/toolbelt';
import { useEffect, useState } from 'react';
import { TMessage, useTelegram } from '../entities';
import { useSelector, getMyself, getChatById, getUserById } from '../store';
import { getSenderFromMessage } from '../tools';

export function useSender(message: TMessage, isChat = false) {
  const [sender, setSender] = useState<string>('');

  const myself = useSelector(getMyself);

  const getChatSelector = useSelector(getChatById);

  const getUser = useSelector(getUserById);

  const { getChat } = useTelegram();

  useEffect(() => {
    if (!getChat(message.chat_id)) getChat(message.chat_id);
    else {
      const r = getSenderFromMessage({ isChat, message, getChat: getChatSelector, getUser, myself });

      if (r !== (sender || '')) setSender(r || '');
    }
  }, [message]);

  return { sender };
}
