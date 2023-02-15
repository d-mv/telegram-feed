import { TData, TExtra, TUpdate } from './event.types';
import { TFile } from './file.types';
import { TMiniThumbnail, TPhotoSize, TThumbnail } from './photo.types';

export interface TMessageSenderUser {
  '@type': 'messageSenderUser';
  user_id: number;
}

export interface TMessageSenderChat {
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
  forward_count?: number;
  reply_info?: TMessageReplyInfo;
  view_count?: number;
}

export interface TTextEntityTypeMention {
  '@type': 'textEntityTypeMention';
}

export interface TTextEntityTypeBold {
  '@type': 'textEntityTypeBold';
}

export interface TTextEntityHashtag {
  '@type': 'textEntityTypeHashtag';
}

export interface TTextEntityTypeItalic {
  '@type': 'textEntityTypeItalic';
}

export interface TTextEntityTypeTextUrl {
  '@type': 'textEntityTypeTextUrl';
  url: string;
}

export interface TTextEntityTypeUrl {
  '@type': 'textEntityTypeUrl';
}

export interface TTextEntityTypeBotCommand {
  '@type': 'textEntityTypeBotCommand';
}

export interface TTextEntityTypeCode {
  '@type': 'textEntityTypeCode';
}

export interface TTextEntityEmailAddress {
  '@type': 'textEntityTypeEmailAddress';
}

export interface TMessageTextEntity {
  '@type': 'textEntity';
  length: number;
  offset: number;
  type:
    | TTextEntityEmailAddress
    | TTextEntityTypeItalic
    | TTextEntityHashtag
    | TTextEntityTypeTextUrl
    | TTextEntityTypeBold
    | TTextEntityTypeUrl
    | TTextEntityTypeBotCommand
    | TTextEntityTypeCode
    | TTextEntityTypeMention;
}

export interface TFormattedText {
  '@type': 'formattedText';
  entities: TMessageTextEntity[];
  text: string;
}

export interface TPhoto {
  '@type': 'photo';
  has_stickers: boolean;
  minithumbnail?: TMiniThumbnail;
  sizes: TPhotoSize[];
}

export interface TWebPage {
  '@type': 'webPage';
  author: string;
  description: TFormattedText;
  display_url: string;
  duration: number;
  embed_height: number;
  embed_type: 'iframe';
  embed_url: string;
  embed_width: number;
  instant_view_version: number;
  photo?: TPhoto;
  site_name: string;
  title: string;
  type: 'video';
  url: string;
}

export interface TMessageText {
  '@type': 'messageText';
  text: TFormattedText;
  web_page?: TWebPage;
}

export interface TMessagePhoto {
  '@type': 'messagePhoto';
  caption: TFormattedText;
  is_secret: false;
  photo: TPhoto;
}

export interface TVideo {
  '@type': 'video';
  duration: number;
  file_name: string;
  has_stickers: boolean;
  height: number;
  mime_type: 'video/mp4';
  minithumbnail: TMiniThumbnail;
  supports_streaming: boolean;
  thumbnail: TThumbnail;
  video: TFile;
  width: number;
}

export interface TMessageVideo {
  '@type': 'messageVideo';
  caption: TFormattedText;
  is_secret: boolean;
  video: TVideo;
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
  content: TMessagePhoto | TFormattedText | TMessageText | TMessageVideo;
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
  sender_id: TMessageSenderUser | TMessageSenderChat;
  ttl: number;
  ttl_expires_in: number;
  via_bot_user_id: number;
}

export interface TMessages extends TData {
  '@type': 'messages';
  messages: TMessage[];
  total_count: number;
}

export interface TMessageLink extends TData {
  '@type': 'messageLink';
  is_public: boolean;
  link: string;
}

// updates
export interface TUpdateNewMessage extends TUpdate {
  '@type': 'updateNewMessage';
  message: TMessage;
}

export interface TUpdateDeleteMessages extends TUpdate {
  '@type': 'updateDeleteMessages';
  // TODO: missing items
}

export interface TUpdateMessageInteractionInfo extends TUpdate {
  '@type': 'updateMessageInteractionInfo';
  chat_id: number;
  interaction_info: TMessageInteractionInfo;
  message_id: number;
}
