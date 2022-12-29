import { TUpdate } from './event.types';
import { TMiniThumbnail, TPhotoSize } from './photo.types';

export interface TMessageSenderId {
  '@type': 'messageSenderChat';
  chat_id: number;
}

export interface TMessageReplyInfo {
  '@type': 'messageReplyInfo';
  last_message_id: number;
  last_read_inbox_message_id: number;
  last_read_outbox_message_id: number;
  recent_replier_ids: unknown[];
  reply_count: number;
}

export interface TMessageInteractionInfo {
  '@type': 'messageInteractionInfo';
  forward_count: number;
  reply_info: TMessageReplyInfo;
  view_count: number;
}

export interface TMessageCaptionEntitiesBold {
  '@type': 'textEntityTypeBold';
}

export interface TMessageTextEntity {
  '@type': 'textEntity';
  length: number;
  offset: number;
  type: TMessageCaptionEntitiesBold;
}

export interface TMessageCaption {
  '@type': 'formattedText';
  entities: TMessageTextEntity[];
  text: string;
}

export interface TMessagePhoto {
  '@type': 'photo';
  has_stickers: boolean;
  minithumbnail: TMiniThumbnail;
  sizes: TPhotoSize[];
}

export interface TMessageContent {
  '@type': 'messagePhoto';
  caption: TMessageCaption;
  is_secret: false;
  photo: TMessagePhoto;
}

export interface TMessage {
  '@type': 'message';
  author_signature: string;
  can_be_deleted_for_all_users: boolean;
  can_be_deleted_only_for_self: boolean;
  can_be_edited: boolean;
  can_be_forwarded: boolean;
  can_be_saved: boolean;
  can_get_media_timestamp_links: boolean;
  can_get_message_thread: boolean;
  can_get_statistics: boolean;
  can_get_viewers: boolean;
  chat_id: number;
  contains_unread_mention: boolean;
  content: TMessageContent;
  date: number;
  edit_date: number;
  has_timestamped_media: boolean;
  id: number;
  interaction_info: TMessageInteractionInfo;
  is_channel_post: boolean;
  is_outgoing: boolean;
  is_pinned: boolean;
  media_album_id: string;
  message_thread_id: number;
  reply_in_chat_id: number;
  reply_to_message_id: number;
  restriction_reason: string;
  sender_id: TMessageSenderId;
  ttl: number;
  ttl_expires_in: number;
  via_bot_user_id: number;
}

// updates
export interface TUpdateNewMessage extends TUpdate {
  '@type': 'updateNewMessage';
  message: TMessage;
}

export interface TUpdateMessageInteractionInfo extends TUpdate {
  '@type': 'updateMessageInteractionInfo';
  chat_id: number;
  interaction_info: TMessageInteractionInfo;
  message_id: number;
}
