import { TChatPhoto } from './chat.types';
import { TUpdate } from './event.types';

export interface TSupergroupFullInfo {
  '@type': 'supergroupFullInfo';
  administrator_count: number;
  banned_count: number;
  bot_commands: unknown[];
  can_get_members: false;
  can_get_statistics: false;
  can_set_location: false;
  can_set_sticker_set: false;
  can_set_username: false;
  description: string;
  is_all_history_available: true;
  linked_chat_id: number;
  member_count: number;
  photo: TChatPhoto;
  restricted_count: number;
  slow_mode_delay: number;
  slow_mode_delay_expires_in: number;
  sticker_set_id: string;
  upgraded_from_basic_group_id: number;
  upgraded_from_max_message_id: number;
}

export interface TSupergroupStatusMember {
  '@type': 'chatMemberStatusMember';
}

export interface TSupergroup {
  '@type': 'supergroup';
  date: number;
  has_linked_chat: number;
  has_location: number;
  id: 1774242343;
  is_broadcast_group: number;
  is_channel: number;
  is_fake: number;
  is_scam: number;
  is_slow_mode_enabled: number;
  is_verified: number;
  member_count: 0;
  restriction_reason: '';
  sign_messages: number;
  status: TSupergroupStatusMember;

  username: string;
}

// updates
export interface TUpdateSupergroupFullInfo extends TUpdate {
  '@type': 'updateSupergroupFullInfo';
  supergroup_full_info: TSupergroupFullInfo;
  supergroup_id: number;
}

export interface TUpdateSupergroup extends TUpdate {
  '@type': 'updateSupergroup';
  supergroup: TSupergroup;
}
