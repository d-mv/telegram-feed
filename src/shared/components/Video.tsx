import { AnyValue, ifTrue, Result } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { path } from 'ramda';
import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { TFilePart, TVideo, useTelegram } from '../entities';
import { fileDownloadProgressSelector } from '../store';
import { DownloadIndicator } from './DownloadIndicator';
import { Icon } from './Icon';

interface PhotoProps {
  media: TVideo;
  className?: string;
  style?: CSSProperties;
  alt: string;

  width?: number;
  mimeType?: string;
}

export function Video({ media, className, alt, style, width, mimeType }: PhotoProps) {
  const downloadProgress = useRecoilValue(fileDownloadProgressSelector);

  const fileId = media.video.id;

  const [id, setId] = useState<number>(0);

  const [file, setFile] = useState<AnyValue>();

  const { queueFileDownload } = useTelegram();

  const progress = useMemo(
    () => path([media.video.id], downloadProgress),

    [downloadProgress, media],
  );

  const setFileToState = useCallback((file: Result<TFilePart, Error>) => {
    if (file.isOK) setFile(URL.createObjectURL(file.payload.data));
  }, []);

  useEffect(() => {
    async function get() {
      queueFileDownload(fileId, media.video.expected_size || 0, setFileToState);
    }

    if (fileId !== id) {
      setId(fileId);
      get();
    }
  }, [fileId, id, media.video.expected_size, queueFileDownload, setFileToState]);

  if (!file)
    return (
      <div className={clsx('center', className)} style={style}>
        <Icon icon='video' className='media-stub-icon' />
        {ifTrue(progress, () => (
          <DownloadIndicator progress={progress} />
        ))}
      </div>
    );

  return (
    <video id={alt} width={width ? `${width}rem` : '100%'} controls className={className}>
      <source src={file} type={mimeType}></source>
    </video>
  );
}
