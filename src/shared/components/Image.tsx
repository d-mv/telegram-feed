import { AnyValue, ifTrue, Result } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { path } from 'ramda';
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { TFilePart, TPhoto, useTelegram } from '../entities';
import { fileDownloadProgressSelector } from '../store';
import { getMediaContainerStyle, getPhotoSize } from '../tools';
import { DownloadIndicator } from './DownloadIndicator';
import { Icon } from './Icon';

interface PhotoProps {
  media: TPhoto;
  className?: string;

  width: number;
  alt: string;
  asBackground?: boolean;
}

export function Image({ media, className, alt, width, asBackground }: PhotoProps) {
  const photoSize = getPhotoSize(media);

  const photoId = photoSize?.photo.id || 0;

  const downloadProgress = useRecoilValue(fileDownloadProgressSelector);

  const [id, setId] = useState<number>(0);

  const { downloadFile, queueFileDownload } = useTelegram();

  const [image, setImage] = useState<AnyValue>();

  const progress = useMemo(
    () => path([photoId], downloadProgress),

    [downloadProgress, photoId],
  );

  const setImageToState = useCallback((file: Result<TFilePart, Error>) => {
    // eslint-disable-next-line no-console
    console.log('setImageToState', file);

    if (file.isOK) setImage(URL.createObjectURL(file.payload.data));
  }, []);

  useEffect(() => {
    async function get() {
      queueFileDownload(photoId, photoSize?.photo.expected_size || 0, setImageToState);
    }

    if (photoId !== id) {
      setId(photoId);
      get();
    }
  }, [downloadFile, id, photoId, photoSize?.photo.expected_size, queueFileDownload, setImageToState]);

  if (!photoSize) return null;

  const style = getMediaContainerStyle(photoSize.height, photoSize.width, { width });

  if (!image)
    return (
      <div className={clsx('center', className)} style={style}>
        <Icon icon='image' className='media-stub-icon' />
        {ifTrue(progress, () => (
          <DownloadIndicator progress={progress} />
        ))}
      </div>
    );

  if (asBackground)
    return <div id={alt} className={className} style={{ backgroundImage: `url(${image})`, ...style }} />;

  return <img src={image} className={className} alt={alt} style={style} />;
}
