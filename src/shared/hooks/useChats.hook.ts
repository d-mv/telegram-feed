import { useCallback } from 'react';
import { propEq } from 'ramda';

import { chatsSelector } from '../store';
import { useRecoilValue } from 'recoil';

export function useChats() {
  const chats = useRecoilValue(chatsSelector);

  const getChatById = useCallback((id: number) => chats.find(propEq('id', id)), [chats]);

  return { getChatById };
}
