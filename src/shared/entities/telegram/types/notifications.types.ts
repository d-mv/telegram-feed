import { TUpdate } from './event.types';

export interface TNotificationSettings {
  disable_mention_notifications: boolean;
  disable_pinned_message_notifications: boolean;
  mute_for: number;
  show_preview: boolean;
  sound: string;
  use_default_disable_mention_notifications?: boolean;
  use_default_disable_pinned_message_notifications?: boolean;
  use_default_mute_for?: boolean;
  use_default_show_preview?: boolean;
  use_default_sound?: boolean;
}

export interface TScopeNotificationSettings extends TNotificationSettings {
  '@type': 'scopeNotificationSettings';
}

export interface TChatNotificationSettings extends TNotificationSettings {
  '@type': 'chatNotificationSettings';
}

export interface TUpdateNotificationSettingsScopeChannelChats {
  '@type': 'notificationSettingsScopeChannelChats';
}
// updates

export interface TUpdatePendingNotifications extends TUpdate {
  '@type': 'updateHavePendingNotifications';
  have_delayed_notifications: boolean;
  have_unreceived_notifications: boolean;
}

export interface TUpdateHavePendingNotifications extends TUpdate {
  '@type': 'updateHavePendingNotifications';
  have_delayed_notifications: boolean;
  have_unreceived_notifications: boolean;
}

export interface TUpdateScopeNotificationSettings extends TUpdate {
  '@type': 'updateScopeNotificationSettings';
  notification_settings: TScopeNotificationSettings;
  scope: TUpdateNotificationSettingsScopeChannelChats;
}
