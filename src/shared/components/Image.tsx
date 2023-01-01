import { AnyValue } from '@mv-d/toolbelt';
import { useEffect, useState } from 'react';
import { useTelegram } from '../entities';

interface PhotoProps {
  photoId: number;
  className?: string;
  alt: string;
}

export function Image({ photoId, className, alt }: PhotoProps) {
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

  if (!image) return null;

  return <img src={image} className={className} alt={alt} />;
}
