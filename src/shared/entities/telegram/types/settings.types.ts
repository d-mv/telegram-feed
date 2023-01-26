import { TUpdate } from './event.types';

export interface TOptionBoolean {
  '@type': 'optionValueBoolean';
  value: boolean;
}

export interface TOptionInteger {
  '@type': 'optionValueInteger';
  value: string;
}

export interface TOptionString {
  '@type': 'optionValueString';
  value: string;
}

export interface TOptions {
  // extends Record<string, TOptionBoolean | TOptionInteger | TOptionString>
  animation_search_bot_username: TOptionString;
  archive_and_mute_new_chats_from_unknown_users: TOptionBoolean;
  authorization_date: TOptionInteger;
  basic_group_size_max: TOptionInteger;
  call_connect_timeout_ms: TOptionInteger;
  call_packet_timeout_ms: TOptionInteger;
  calls_enabled: TOptionBoolean;
  can_ignore_sensitive_content_restrictions: TOptionBoolean;
  channel_bot_user_id: TOptionInteger;
  expect_blocking: TOptionBoolean;
  favorite_stickers_limit: TOptionInteger;
  for_dark_theme: TOptionBoolean;
  forwarded_message_count_max: TOptionInteger;
  group_anonymous_bot_user_id: TOptionInteger;
  ignore_background_updates: TOptionBoolean;
  ignore_sensitive_content_restrictions: TOptionBoolean;
  is_location_visible: TOptionBoolean;
  language_pack_database_path: TOptionString;
  message_caption_length_max: TOptionInteger;
  message_text_length_max: TOptionInteger;
  my_id: TOptionInteger;
  photo_search_bot_username: TOptionString;
  pinned_archived_chat_count_max: TOptionInteger;
  pinned_chat_count_max: TOptionInteger;
  replies_bot_chat_id: TOptionInteger;
  store_all_files_in_files_directory: TOptionBoolean;
  suggested_video_note_audio_bitrate: TOptionInteger;
  suggested_video_note_length: TOptionInteger;
  suggested_video_note_video_bitrate: TOptionInteger;
  supergroup_size_max: TOptionInteger;
  t_me_url: TOptionString;
  telegram_service_notifications_chat_id: TOptionInteger;
  test_mode: TOptionBoolean;
  unix_time: TOptionInteger;
  utc_time_offset: TOptionInteger;
  venue_search_bot_username: TOptionString;
  version: TOptionString;
}

export type TOption = keyof TOptions;

// updates

export interface TUpdateOption extends TUpdate {
  '@type': 'updateOption' | 'updateSelectedBackground';
  name: TOption;
  value: TOptionBoolean | TOptionInteger | TOptionString;
}

export interface TUpdateMyIdOption extends TUpdate {
  '@type': 'updateOption';
  name: 'my_id';
  value: TOptionInteger;
}

export interface TUpdateSelectedBackground extends TUpdate {
  '@type': 'updateSelectedBackground';
  for_dark_theme: boolean;
}

export interface TUpdateConnState extends TUpdate {
  '@type': 'updateConnectionState';
  state: {
    '@type': string;
  };
}

export interface TUpdateDiceEmojis extends TUpdate {
  '@type': 'updateDiceEmojis';
  emojis: string[];
}

// not technically part of the options
// TODO: move to app options?
export interface TUpdateDarkTheme extends TUpdate {
  '@type': 'for_dark_theme';
  name: TOption;
  value: TOptionBoolean;
}
