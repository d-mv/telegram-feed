import { clsx } from 'clsx';

import { TVideo } from '../../entities';
import { getMediaContainerStyle } from '../../tools';
import { Video } from '../Video';
import classes from './CardVideo.module.scss';

interface CardProps {
  widthRem: number;
  media: TVideo;
  className?: string;
}

export function CardVideo({ media, className, widthRem }: CardProps) {
  return (
    <Video
      media={media}
      className={clsx(classes.container, className)}
      mimeType={media.mime_type}
      alt={media.file_name}
      style={getMediaContainerStyle(media.height, media.width, { width: widthRem })}
    />
  );
}
