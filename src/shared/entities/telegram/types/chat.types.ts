import { TData, TUpdate } from './event.types';
import { TMessage } from './message.types';
import { TChatNotificationSettings } from './notifications.types';
import { TMiniThumbnail, TPhoto, TPhotoSize } from './photo.types';

export interface TChatFilter {
  '@type': 'chatFilterInfo';
  id: number;
  title: string;
  icon_name: string;
}

export interface TChatPermissions {
  '@type': 'chatPermissions';
  can_add_web_page_previews: boolean;
  can_change_info: boolean;
  can_invite_users: boolean;
  can_pin_messages: boolean;
  can_send_media_messages: boolean;
  can_send_messages: boolean;
  can_send_other_messages: boolean;
  can_send_polls: boolean;
}

export interface TChatTypeSupergroup {
  '@type': 'chatTypeSupergroup';
  supergroup_id: number;
  is_channel: boolean;
}

export interface TChatTypePrivate {
  '@type': 'chatTypePrivate';
  user_id: number;
}

export interface TChatPhotoInfo extends TPhoto {
  '@type': 'chatPhotoInfo';
}

export interface TVideotChat {
  '@type': 'videoChat';
  group_call_id: number;
  has_participants: boolean;
}

export interface TChat {
  '@type': 'chat';
  can_be_deleted_for_all_users: boolean;
  can_be_deleted_only_for_self: boolean;
  can_be_reported: boolean;
  client_data: string;
  default_disable_notification: boolean;
  has_protected_content: boolean;
  has_scheduled_messages: boolean;
  id: -1001774242343;
  is_blocked: boolean;
  is_marked_as_unread: boolean;
  last_read_inbox_message_id: 0;
  last_read_outbox_message_id: 2251799812636672;
  message_ttl: 0;
  notification_settings: TChatNotificationSettings;
  permissions: TChatPermissions;
  photo: TChatPhotoInfo;
  positions: unknown[];
  reply_markup_message_id: number;
  theme_name: string;
  title: string;
  type: TChatTypeSupergroup | TChatTypePrivate;
  unread_count: number;
  unread_mention_count: number;
  video_chat: TVideotChat;
}

export interface TChatPhoto {
  '@type': 'chatPhoto';
  added_date: number;
  id: string;
  minithumbnail: TMiniThumbnail;
  sizes: TPhotoSize[];
}

export interface TChats extends TData {
  '@type': 'chats';
  chat_ids: number[];
  total_count: number;
}

export interface TChatListFilter {
  '@type': 'chatListFilter';
  chat_filter_id: number;
}

export interface TChatPosition {
  '@type': 'chatPosition';
  is_pinned: boolean;
  list: TChatListFilter;
}

// updates
export interface TUpdateChatTitle extends TUpdate {
  '@client_id': 1;
  '@type': 'updateChatTitle';
  chat_id: number;
  title: string;
}

export interface TUpdateChatPosition extends TUpdate {
  '@type': 'updateChatPosition';
  chat_id: number;
  position: TChatPosition;
  order: string;
}

export interface TUpdateChatFilters extends TUpdate {
  '@type': 'updateChatFilters';
  chat_filters: TChatFilter[];
}

export interface TUpdateChatLastMessage extends TUpdate {
  '@type': 'updateChatLastMessage';
  chat_id: number;
  last_message: TMessage;
  positions: unknown[];
}

export interface TUpdateNewChat extends TUpdate {
  '@type': 'updateNewChat';
  chat: TChat;
}

export interface TUpdateChatReadInbox extends TUpdate {
  '@type': 'updateChatReadInbox';
  chat_id: number;
  last_read_inbox_message_id: number;
  unread_count: number;
}

export interface TUpdateChatNotificationSettings extends TUpdate {
  '@type': 'updateChatNotificationSettings';
  chat_id: number;
  notification_settings: TChatNotificationSettings;
}

export interface TUpdateChatReadOutbox extends TUpdate {
  '@type': 'updateChatReadOutbox';
  chat_id: number;
  last_read_outbox_message_id: number;
}

export interface TUpdateVideoChat extends TUpdate {
  '@type': 'updateChatVideoChat';
  chat_id: number;
  video_chat: TVideotChat;
}
