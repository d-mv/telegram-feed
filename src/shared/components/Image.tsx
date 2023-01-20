import { AnyValue } from '@mv-d/toolbelt';
import { CSSProperties, useEffect, useState } from 'react';

import { useTelegram } from '../entities';
import { Icon } from './Icon';

interface PhotoProps {
  photoId: number;
  className?: string;
  style?: CSSProperties;
  alt: string;
  asBackground?: boolean;
}

export function Image({ photoId, className, alt, style, asBackground }: PhotoProps) {
  const [id, setId] = useState<number>(0);

  const { downloadFile } = useTelegram();

  const [image, setImage] = useState<AnyValue>();

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
    // TODO: switch to classNames
    return (
      <div className={className} style={{ ...style, display: 'grid', placeItems: 'center' }}>
        <Icon icon='image' style={{ height: '35%', width: '100%', fill: 'var(--color-primary-4)' }} />
      </div>
    );

  if (asBackground)
    return <div id={alt} className={className} style={{ backgroundImage: `url(${image})`, ...style }} />;

  return <img src={image} className={className} alt={alt} style={style} />;
}
