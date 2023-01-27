import { AnyValue } from '@mv-d/toolbelt';
import { CSSProperties, useEffect, useState } from 'react';

import { useTelegram } from '../entities';
import { Icon } from './Icon';

interface PhotoProps {
  fileId: number;
  className?: string;
  style?: CSSProperties;
  alt: string;
  asBackground?: boolean;
  width?: number;
  mimeType?: string;
}

export function Video({ fileId, className, alt, style, asBackground, width, mimeType }: PhotoProps) {
  const [id, setId] = useState<number>(0);

  const { downloadFile } = useTelegram();

  const [file, setFile] = useState<AnyValue>();

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
    // TODO: switch to classNames
    return (
      <div className={className} style={{ ...style, display: 'grid', placeItems: 'center' }}>
        <Icon icon='video' style={{ height: '6rem', width: '100%', fill: 'var(--color-primary-4)' }} />
      </div>
    );

  if (asBackground) return <div id={alt} className={className} style={{ backgroundImage: `url(${file})`, ...style }} />;

  return (
    <video width={width ? `${width}rem` : '100%'} controls className={className}>
      <source src={file} type={mimeType}></source>
    </video>
  );
}
