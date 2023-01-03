import { clsx } from 'clsx';

import { TMessagePhoto } from '../../entities';
import { getPhotoContainerStyle, getPhotoSize } from '../../tools';
import { Image } from '../Image';
import classes from './CardPhoto.module.scss';

interface CardProps {
  photo: TMessagePhoto;
  className?: string;
}

export function CardPhoto({ photo, className }: CardProps) {
  const photoSize = getPhotoSize(photo);

  if (!photoSize) return null;

  return (
    <Image
      asBackground
      photoId={photoSize.photo.id}
      className={clsx(classes.container, className)}
      alt='CardPhoto'
      style={getPhotoContainerStyle(photoSize)}
    />
  );
}
