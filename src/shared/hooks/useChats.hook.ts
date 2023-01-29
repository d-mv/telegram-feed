import { useCallback, useEffect } from 'react';
import { propEq } from 'ramda';

import { chatsSelector, supergroupsSelector } from '../store';
import { useRecoilValue } from 'recoil';

export function useChats() {
  const chats = useRecoilValue(chatsSelector);

  const supergroups = useRecoilValue(supergroupsSelector);

  const getChatById = useCallback((id: number) => chats.find(propEq('id', id)), [chats]);

  const getSupergroupUsernameById = useCallback(
    (id: number) => {
      // TODO: rename
      const id0 = parseInt(String(id).replace(/^-100/, ''));

      return supergroups[id0].username;
    },
    [supergroups],
  );

  return { getChatById, getSupergroupUsernameById };
}
