import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { pick, propEq } from 'ramda';

import { chatsSelector, supergroupsSelector } from '../store';
import { TChatPhotoInfo } from '../entities';

export type TChatRender = { id: number; title: string; photo: TChatPhotoInfo };

export function useChats() {
  const chats = useRecoilValue(chatsSelector);

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

  return { getChatById, getSupergroupUsernameById, makeChatList };
}
