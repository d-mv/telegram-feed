import { Optional } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { MutableRefObject } from 'react';

import { TMessagePhoto, TMessageVideo } from '../../entities';
import { getPhotoContainerStyle, getPhotoSize } from '../../tools';
import { MaybeNull } from '../../types';
import { Image } from '../Image';
import classes from './CardVideo.module.scss';

interface CardProps {
  widthRem: number;
  video: TMessageVideo;
  // photo: TMessagePhoto;
  className?: string;
}

export function CardVideo({ video, className, widthRem }: CardProps) {
  // eslint-disable-next-line no-console
  // console.log('####', video);
  // TODO: add video downloaded and formatter
  return <div />;
  // const photoSize = getPhotoSize(photo);

  // if (!photoSize) return null;

  // return (
  //   <Image
  //     asBackground
  //     photoId={photoSize.photo.id}
  //     className={clsx(classes.container, className)}
  //     alt='CardPhoto'
  //     style={getPhotoContainerStyle(photoSize, { width: widthRem })}
  //   />
  // );
}
