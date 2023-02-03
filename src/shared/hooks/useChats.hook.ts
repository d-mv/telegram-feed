import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { pick, propEq } from 'ramda';

import { chatsSelector, messagesState, supergroupsSelector } from '../store';
import { TChatPhotoInfo } from '../entities';

export type TChatRender = { id: number; title: string; photo: TChatPhotoInfo };

export function useChats() {
  const chats = useRecoilValue(chatsSelector);

  const setMessages = useSetRecoilState(messagesState);

  const makeChatList = useCallback((): TChatRender[] => {
    return chats.map(c => pick(['id', 'title', 'photo'], c));
  }, [chats]);

  const supergroups = useRecoilValue(supergroupsSelector);

  const getChatById = useCallback((id: number) => chats.find(propEq('id', id)), [chats]);

  // TODO: do we need this?
  const getSupergroupUsernameById = useCallback(
    (id: number) => {
      // TODO: rename
      const id0 = parseInt(String(id).replace(/^-100/, ''));

      return supergroups[id0].username;
    },
    [supergroups],
  );

  const cleanUpOrphanMessages = useCallback(
    (chatIds: number[]) => {
      setMessages(state => state.filter(m => chatIds.includes(m.chat_id)));
    },
    [setMessages],
  );

  return { getChatById, getSupergroupUsernameById, makeChatList, cleanUpOrphanMessages };
}
