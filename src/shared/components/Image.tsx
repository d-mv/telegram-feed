import { ifTrue } from '@mv-d/toolbelt';
import { useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { useContextSelector } from 'use-context-selector';

import { FeedContext } from '../../domains/feed/feed.context';
import { useDownload } from '../hooks';
import { containerWidthSelector } from '../store';
import { getMediaContainerStyle } from '../tools';
import { DownloadIndicator } from './DownloadIndicator';
import { Icon } from './Icon';

interface ImageProps {
  isWebPage?: boolean;
}

export function Image({ isWebPage }: ImageProps) {
  const [media, thumbnail] = useContextSelector(FeedContext, c =>
    isWebPage ? [c.webPagePhoto, c.webPageThumbnail] : [c.photo, c.thumbnail],
  );

  const cardWidth = useRecoilValue(containerWidthSelector);

  const fileId = useMemo(() => (media.isSome ? media.value.photo.id : 0), [media]);

  const { file } = useDownload(fileId, media.isSome ? media.value.photo.expected_size : 0);

  const containerRef = useRef<HTMLDivElement>(null);

  if (media.isNone) return null;

  const { height, width, photo } = media.value;

  const style = getMediaContainerStyle(height, width, { width: cardWidth });

  const renderIcon = () => <Icon icon='image' className='media-stub-icon' />;

  const renderThumbnail = () => <img src={`data:image/jpeg;base64,${thumbnail}`} alt='video' className='w-100 mini' />;

  if (!file)
    return (
      <div
        id={`id:${fileId};size:${photo.expected_size}`}
        ref={containerRef}
        className='center media-container'
        style={style}
      >
        {ifTrue(thumbnail, renderThumbnail, renderIcon)}
        <DownloadIndicator fileId={fileId} />
      </div>
    );

  return (
    <div
      id={`id:${fileId};size:${photo.expected_size}`}
      className='media-container'
      style={{
        backgroundImage: `url(${file})`,
        backgroundSize: 'cover',
        ...style,
      }}
    />
  );
}
