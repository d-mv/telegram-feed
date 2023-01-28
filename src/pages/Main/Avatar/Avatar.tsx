import { AnyValue, as } from '@mv-d/toolbelt';
import { useEffect, useState } from 'react';
import { TdObject } from 'tdweb';
import { Image, TUser, useTelegram } from '../../../shared';
import classes from './Avatar.module.scss';
interface AvatarProps {
  user: TUser;
}

export default function Avatar({ user }: AvatarProps) {
  return (
    <div className={classes.container}>
      {/* <Image media={user.profile_photo} alt={user.first_name} className={classes.image} /> */}
    </div>
  );
}
// 'data:image/jpeg;base64,' + user.profile_photo.minithumbnail.data;
