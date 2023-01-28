import { useResetRecoilState } from 'recoil';
import { TelegramService } from '../entities';
import {
  authEventState,
  chatIdsState,
  chatsLoadedState,
  chatsState,
  fileDownloadProgressState,
  loadingMessageState,
  messagesState,
  myselfState,
  notificationsState,
  optionsState,
  passwordHintState,
  selectedChatState,
  usersState,
} from '../store';

export function useLogout() {
  const resetAuthEvent = useResetRecoilState(authEventState);

  const resetChatIds = useResetRecoilState(chatIdsState);

  const resetChats = useResetRecoilState(chatsState);

  const resetChatsLoaded = useResetRecoilState(chatsLoadedState);

  const resetFileDownloadProgress = useResetRecoilState(fileDownloadProgressState);

  const resetLoadingMessage = useResetRecoilState(loadingMessageState);

  const resetMessages = useResetRecoilState(messagesState);

  const resetMyself = useResetRecoilState(myselfState);

  const resetNotifications = useResetRecoilState(notificationsState);

  const resetOptions = useResetRecoilState(optionsState);

  const resetPasswordHint = useResetRecoilState(passwordHintState);

  const resetSelectedChat = useResetRecoilState(selectedChatState);

  const resetUsers = useResetRecoilState(usersState);

  async function logOut() {
    const r = await TelegramService.send({ type: 'logOut' });

    if (r.isNone) {
      console.error(r.error);
    } else {
      resetAuthEvent();
      resetChatIds();
      resetChats();
      resetChatsLoaded();
      resetFileDownloadProgress();
      resetLoadingMessage();
      resetMessages();
      resetMyself();
      resetNotifications();
      resetOptions();
      resetPasswordHint();
      resetSelectedChat();
      resetUsers();
    }
  }

  return { logOut };
}
