import { TUpdate } from './event.types';
import { TPhoto } from './photo.types';

export interface TProfilePhoto extends TPhoto {
  '@type': 'profilePhoto';
}

export interface TUserStatusOffline {
  '@type': 'userStatusOffline';
  was_online: 1672325496;
}

export interface TUserStatusOnline {
  '@type': 'userStatusOnline';
  expires: number;
}

export type TUserStatus = TUserStatusOffline | TUserStatusOnline;

export interface TUserType {
  '@type': 'userTypeRegular';
}

export interface TUser {
  '@type': 'user';
  first_name: string;
  have_access: boolean;
  id: number;
  is_contact: boolean;
  is_fake: boolean;
  is_mutual_contact: boolean;
  is_scam: boolean;
  is_support: boolean;
  is_verified: boolean;
  language_code: string;
  last_name: string;
  phone_number: string;
  profile_photo: TProfilePhoto;
  restriction_reason: string;
  status: TUserStatus;
  type: TUserType;
  username: string;
}

export interface TUserFullInfo {
  '@type': 'userFullInfo';
  bio: string;
  can_be_called: boolean;
  commands: unknown[];
  description: string;
  group_in_common_count: number;
  has_private_calls: boolean;
  has_private_forwards: boolean;
  is_blocked: boolean;
  need_phone_number_privacy_exception: boolean;
  share_text: string;
  supports_video_calls: boolean;
}

// update
export interface TUpdateUser extends TUpdate {
  '@type': 'updateUser';
  user: TUser;
}

export interface TUpdateUserFullInfo extends TUpdate {
  '@type': 'updateUserFullInfo';
  user_full_info: TUserFullInfo;
  user_id: number;
}

export interface TUpdateUserStatus extends TUpdate {
  '@type': 'updateUserStatus';
  status: TUserStatus;
  user_id: number;
}
