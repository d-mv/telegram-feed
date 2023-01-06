import { Optional } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { MutableRefObject } from 'react';

import { TMessagePhoto } from '../../entities';
import { getPhotoContainerStyle, getPhotoSize } from '../../tools';
import { MaybeNull } from '../../types';
import { Image } from '../Image';
import classes from './CardPhoto.module.scss';

interface CardProps {
  widthRem: number;
  photo: TMessagePhoto;
  className?: string;
}

export function CardPhoto({ photo, className, widthRem }: CardProps) {
  const photoSize = getPhotoSize(photo);

  if (!photoSize) return null;

  return (
    <Image
      asBackground
      photoId={photoSize.photo.id}
      className={clsx(classes.container, className)}
      alt='CardPhoto'
      style={getPhotoContainerStyle(photoSize, { width: widthRem })}
    />
  );
}
