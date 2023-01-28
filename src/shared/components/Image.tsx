import { AnyValue, ifTrue } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { path } from 'ramda';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { useTelegram } from '../entities';
import { fileDownloadProgressSelector } from '../store';
import { DownloadIndicator } from './DownloadIndicator';
import { Icon } from './Icon';

interface PhotoProps {
  photoId: number;
  className?: string;
  style?: CSSProperties;
  alt: string;
  asBackground?: boolean;
}

export function Image({ photoId, className, alt, style, asBackground }: PhotoProps) {
  const downloadProgress = useRecoilValue(fileDownloadProgressSelector);

  const [id, setId] = useState<number>(0);

  const { downloadFile } = useTelegram();

  const [image, setImage] = useState<AnyValue>();

  const progress = useMemo(
    () => path([photoId], downloadProgress),

    [downloadProgress, photoId],
  );

  useEffect(() => {
    async function get() {
      const file = await downloadFile(photoId);

      if (file.isOK) setImage(URL.createObjectURL(file.payload.data));
    }

    if (photoId !== id) {
      setId(photoId);
      get();
    }
  }, [downloadFile, id, photoId]);

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
