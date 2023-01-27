import { none } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { path } from 'ramda';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { TVideo } from '../../entities';
import { fileDownloadProgressSelector } from '../../store';
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
      fileId={media.video.id}
      className={clsx(classes.container, className)}
      mimeType={media.mime_type}
      alt={media.file_name}
      style={getMediaContainerStyle(media.height, media.width, { width: widthRem })}
    />
  );
}
