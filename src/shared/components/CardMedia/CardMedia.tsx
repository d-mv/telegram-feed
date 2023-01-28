import { AnyValue, ifTrue, Optional, Result } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { path } from 'ramda';
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { TFile, TFilePart, TPhoto, TVideo, useTelegram } from '../../entities';
import { fileDownloadProgressSelector } from '../../store';
import { getMediaContainerStyle, getPhotoSize } from '../../tools';
import { DownloadIndicator } from '../DownloadIndicator';
import { Icon } from '../Icon';
import { Image } from '../Image';
import classes from './CardMedia.module.scss';

interface CardMediaProps {
  width: number;
  asBackground?: boolean;
  media: TPhoto | TVideo;
  className?: string;
  title?: string;
  id?: string;
}

export function CardMedia({ asBackground, media, className, width, title, id }: CardMediaProps) {
  const downloadProgress = useRecoilValue(fileDownloadProgressSelector);

  const isVideo = 'video' in media;

  const photoSize = !isVideo ? getPhotoSize(media) : undefined;

  const mediaData = isVideo ? media.video : photoSize?.photo || { id: 0, expected_size: 0 };

  const fileId = isVideo ? media.video.id : mediaData.id;

  const [file, setFile] = useState('');

  const { queueFileDownload } = useTelegram();

  const progress = useMemo(
    () => path([fileId], downloadProgress),

    [downloadProgress, fileId],
  );

  const setFileToState = useCallback((file: Result<TFilePart, Error>) => {
    if (file.isOK) setFile(URL.createObjectURL(file.payload.data));
  }, []);

  useEffect(() => {
    async function get() {
      queueFileDownload(fileId, mediaData.expected_size || 0, setFileToState);
    }

    get();
  }, [fileId, mediaData.expected_size, queueFileDownload, setFileToState]);

  function makeImageStyle(): CSSProperties {
    if (isVideo || !photoSize) return {};

    return getMediaContainerStyle(photoSize.height, photoSize.width, { width });
  }

  function makeVideoStyle(): CSSProperties {
    if (!isVideo) return {};

    return getMediaContainerStyle(media.height, media.width, { width });
  }

  const style: CSSProperties = isVideo ? makeVideoStyle() : makeImageStyle();

  if (!file)
    return (
      <div className={clsx('center', classes.container, className)} style={style}>
        <Icon icon={isVideo ? 'video' : 'image'} className='media-stub-icon' />
        {ifTrue(progress, () => (
          <DownloadIndicator progress={progress} />
        ))}
      </div>
    );

  function renderVideo() {
    if (!isVideo) return null;

    return (
      <video
        id={id || title || media.file_name}
        width={width ? `${width}rem` : '100%'}
        controls
        className={clsx(classes.container, className)}
      >
        <source src={file} type={media.mime_type}></source>
      </video>
    );
  }

  function renderImage() {
    if (isVideo) return null;

    const idAttr = String(id || title || mediaData.id);

    const classNames = clsx(classes.container, classes['height-100'], className);

    if (asBackground)
      return <div id={idAttr} className={classNames} style={{ backgroundImage: `url(${file})`, ...style }} />;

    return <img src={file} className={classNames} alt={idAttr} style={style} />;
  }

  return <>{ifTrue(isVideo, renderVideo, renderImage)}</>;
}
