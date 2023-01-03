import { ifTrue } from '@mv-d/toolbelt';
import { clsx } from 'clsx';

import { TMessagePhoto } from '../../entities';
import { Image } from '../Image';
import classes from './CardPhoto.module.scss';

interface CardProps {
  photo: TMessagePhoto;
  className?: string;
}

function getPhotoSize(photo: TMessagePhoto, size = 'x') {
  const { sizes } = photo;

  return sizes.find(ph => ph.type === size);
}

// TODO: refactor
export function CardPhoto({ photo, className }: CardProps) {
  const ph = getPhotoSize(photo);

  function getContainerStyle() {
    if (!ph) return {};

    const ratio = (ph?.height || 1) / (ph?.width || 1);

    const isVertical = ratio > 1;

    const r = ph.width / 400;

    if (isVertical) return { width: '40rem', height: ph.height / r };

    return { width: '40rem', height: `${40 * ratio}rem` };
  }

  return (
    <div
      data-ratio={`${ph?.height}-${ph?.width}`}
      className={clsx(classes.container, className)}
      style={getContainerStyle()}
    >
      {ifTrue(ph, () => (
        <Image asBackground photoId={ph!.photo.id} className={classes.photo} alt='CardPhoto' />
      ))}
    </div>
  );
}
