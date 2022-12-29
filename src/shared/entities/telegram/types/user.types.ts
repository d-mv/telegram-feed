import { TUpdate } from './event.types';
import { TPhoto } from './photo.types';

export interface TProfilePhoto extends TPhoto {
  '@type': 'profilePhoto';
}

export interface TUserStatus {
  '@type': 'userStatusOffline';
  was_online: 1672325496;
}

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

// update
export interface TUpdateUser extends TUpdate {
  '@type': 'updateUser';
  user: TUser;
}
