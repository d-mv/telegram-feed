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
  fileId: number;
  className?: string;
  style?: CSSProperties;
  alt: string;

  width?: number;
  mimeType?: string;
}

export function Video({ fileId, className, alt, style, width, mimeType }: PhotoProps) {
  const downloadProgress = useRecoilValue(fileDownloadProgressSelector);

  const [id, setId] = useState<number>(0);

  const [file, setFile] = useState<AnyValue>();

  const { downloadFile } = useTelegram();

  const progress = useMemo(
    () => path([fileId], downloadProgress),

    [downloadProgress, fileId],
  );

  useEffect(() => {
    async function get() {
      const file = await downloadFile(fileId);

      if (file.isOK) setFile(URL.createObjectURL(file.payload.data));
    }

    if (fileId !== id) {
      setId(fileId);
      get();
    }
  }, [downloadFile, fileId, id]);

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
