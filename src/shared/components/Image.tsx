import { AnyValue } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
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
    return (
      <div className={clsx('center', className)} style={style}>
        <Icon icon='image' className='media-stub-icon' />
      </div>
    );

  if (asBackground)
    return <div id={alt} className={className} style={{ backgroundImage: `url(${image})`, ...style }} />;

  return <img src={image} className={className} alt={alt} style={style} />;
}
