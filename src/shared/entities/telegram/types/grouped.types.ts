import {
  TAuthorizationStateClosed,
  TAuthorizationStateReady,
  TUpdateAuthorizationState,
  TUpdateWaitEncryptionKey,
  TUpdateWaitOtherDeviceConfirmation,
  TUpdateWaitPassword,
  TUpdateWaitPhoneNumber,
} from './auth.types';
import {
  TUpdateChatFilters,
  TUpdateChatLastMessage,
  TUpdateChatNotificationSettings,
  TUpdateChatReadInbox,
  TUpdateChatReadOutbox,
  TUpdateNewChat,
  TUpdateVideoChat,
} from './chat.types';
import { TUpdateChatThemes } from './chatTheme.types';
import { TUpdateDeleteMessages, TUpdateMessageInteractionInfo, TUpdateNewMessage } from './message.types';
import {
  TUpdateHavePendingNotifications,
  TUpdateNotificationSettingsScopeChannelChats,
  TUpdatePendingNotifications,
  TUpdateScopeNotificationSettings,
} from './notifications.types';
import { TUpdateConnState, TUpdateDiceEmojis, TUpdateOption, TUpdateSelectedBackground } from './settings.types';
import { TUpdateSupergroup, TUpdateSupergroupFullInfo } from './supergroup.types';
import { TUpdateUser } from './user.types';

export type TUpdates =
  | TUpdateDeleteMessages
  | TUpdateWaitPassword
  | TUpdateWaitEncryptionKey
  | TUpdateWaitPhoneNumber
  | TUpdateAuthorizationState
  | TAuthorizationStateClosed
  | TAuthorizationStateReady
  | TUpdateVideoChat
  | TUpdateUser
  | TUpdateSupergroupFullInfo
  | TUpdateSupergroup
  | TUpdateSelectedBackground
  | TUpdateScopeNotificationSettings
  | TUpdatePendingNotifications
  | TUpdateOption
  | TUpdateNotificationSettingsScopeChannelChats
  | TUpdateNewChat
  | TUpdateNewMessage
  | TUpdateMessageInteractionInfo
  | TUpdateChatThemes
  | TUpdateConnState
  | TUpdateDiceEmojis
  | TUpdateHavePendingNotifications
  | TUpdateWaitOtherDeviceConfirmation
  | TUpdateWaitPassword
  | TUpdateChatFilters
  | TUpdateChatLastMessage
  | TUpdateChatNotificationSettings
  | TUpdateChatReadInbox
  | TUpdateChatReadOutbox;
