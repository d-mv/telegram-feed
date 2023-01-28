import { Optional } from '@mv-d/toolbelt';
import { clsx } from 'clsx';

import { TPhoto } from '../../entities';
import { getMediaContainerStyle, getPhotoSize } from '../../tools';
import { Image } from '../Image';
import classes from './CardPhoto.module.scss';

interface CardProps {
  widthRem: number;
  media: TPhoto;
  className?: string;
}

export function CardPhoto({ media, className, widthRem }: CardProps) {
  return (
    <Image asBackground media={media} className={clsx(classes.container, className)} alt='Photo' width={widthRem} />
  );
}
