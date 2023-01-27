import { Optional } from '@mv-d/toolbelt';
import { clsx } from 'clsx';

import { TMessagePhoto } from '../../entities';
import { getMediaContainerStyle, getPhotoSize } from '../../tools';
import { Image } from '../Image';
import classes from './CardPhoto.module.scss';

interface CardProps {
  widthRem: number;
  media: TMessagePhoto;
  className?: string;
}

export function CardPhoto({ media, className, widthRem }: CardProps) {
  const photoSize = getPhotoSize(media);

  if (!photoSize) return null;

  return (
    <Image
      asBackground
      photoId={photoSize.photo.id}
      className={clsx(classes.container, className)}
      alt='Photo'
      style={getMediaContainerStyle(photoSize.height, photoSize.width, { width: widthRem })}
    />
  );
}
