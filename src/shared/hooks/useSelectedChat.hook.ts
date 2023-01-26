import { as, logger } from '@mv-d/toolbelt';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { StorageService } from '../entities';
import { SelectedChatId, selectedChatSelector } from '../store';

export function useSelectedChat() {
  const setSelectedChat = useSetRecoilState(selectedChatSelector);

  const log = (v: SelectedChatId) => logger.info(`Selected chat: ${v.id}, ${v.title}`);

  useEffect(() => {
    const v = as<SelectedChatId>(StorageService.get('selectedChat'));

    log(v);
    setSelectedChat(v);
  }, [setSelectedChat]);
}
