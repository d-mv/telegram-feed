import { Optional } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { MutableRefObject } from 'react';

import { TMessagePhoto, TMessageVideo } from '../../entities';
import { getMediaContainerStyle, getPhotoContainerStyle, getPhotoSize } from '../../tools';
import { MaybeNull } from '../../types';
import { Image } from '../Image';
import { Video } from '../Video';
import classes from './CardVideo.module.scss';

interface CardProps {
  widthRem: number;
  video: TMessageVideo;
  // photo: TMessagePhoto;
  className?: string;
}

export function CardVideo({ video, className, widthRem }: CardProps) {
  // eslint-disable-next-line no-console
  console.log('####', video);

  // TODO: add video downloaded and formatter
  return (
    <Video
      fileId={video.video.video.id}
      className={clsx(classes.container, className)}
      mimeType={video.video.mime_type}
      alt='some'
      style={getMediaContainerStyle(video.video.height, video.video.width, { width: widthRem })}
    />
  );
  // return (
  //   <Image
  //     asBackground
  //     photoId={photoSize.photo.id}
  //     className={clsx(classes.container, className)}
  //     alt='CardPhoto'
  // style={getPhotoContainerStyle(photoSize, { width: widthRem })}
  //   />
  // );
  return <div />;
}
