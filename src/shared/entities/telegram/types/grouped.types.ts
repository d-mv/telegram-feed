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
import {
  TUpdateConnState,
  TUpdateDarkTheme,
  TUpdateDiceEmojis,
  TUpdateOption,
  TUpdateSelectedBackground,
} from './settings.types';
import { TUpdateSupergroup, TUpdateSupergroupFullInfo } from './supergroup.types';
import { TUpdateUser, TUpdateUserFullInfo } from './user.types';

export type TUpdates =
  | TUpdateDarkTheme
  | TAuthorizationStateClosed
  | TAuthorizationStateReady
  | TUpdateAuthorizationState
  | TUpdateChatFilters
  | TUpdateChatLastMessage
  | TUpdateChatNotificationSettings
  | TUpdateChatReadInbox
  | TUpdateChatReadOutbox
  | TUpdateChatThemes
  | TUpdateConnState
  | TUpdateDeleteMessages
  | TUpdateDiceEmojis
  | TUpdateHavePendingNotifications
  | TUpdateMessageInteractionInfo
  | TUpdateNewChat
  | TUpdateNewMessage
  | TUpdateNotificationSettingsScopeChannelChats
  | TUpdateOption
  | TUpdatePendingNotifications
  | TUpdateScopeNotificationSettings
  | TUpdateSelectedBackground
  | TUpdateSupergroup
  | TUpdateSupergroupFullInfo
  | TUpdateUser
  | TUpdateUserFullInfo
  | TUpdateVideoChat
  | TUpdateWaitEncryptionKey
  | TUpdateWaitOtherDeviceConfirmation
  | TUpdateWaitPassword
  | TUpdateWaitPassword
  | TUpdateWaitPhoneNumber;
