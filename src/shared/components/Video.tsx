import { ifTrue } from '@mv-d/toolbelt';
import { useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { useContextSelector } from 'use-context-selector';

import { FeedContext } from '../../domains';
import { useDownload } from '../hooks';
import { containerWidthSelector } from '../store';
import { getMediaContainerStyle } from '../tools';
import { DownloadIndicator } from './DownloadIndicator';
import { Icon } from './Icon';

export function Video() {
  const [media, thumbnail] = useContextSelector(FeedContext, c => [c.video, c.thumbnail]);

  const cardWidth = useRecoilValue(containerWidthSelector);

  const fileId = useMemo(() => (media.isSome ? media.value.video.id : 0), [media]);

  const { file } = useDownload(fileId, media.isSome ? media.value.video.expected_size : 0);

  const containerRef = useRef<HTMLDivElement>(null);

  if (media.isNone) return null;

  const { height, width, mime_type } = media.value;

  const style = getMediaContainerStyle(height, width, { width: cardWidth });

  const renderIcon = () => <Icon icon='video' className='media-stub-icon' />;

  const renderThumbnail = () => <img src={`data:image/jpeg;base64,${thumbnail}`} alt='video' className='w-100 mini' />;

  function renderPlaceholder() {
    return (
      <>
        {ifTrue(thumbnail, renderThumbnail, renderIcon)}
        <DownloadIndicator fileId={fileId} />
      </>
    );
  }

  function renderVideo() {
    return (
      <video id={String(fileId)} width={`${cardWidth}rem`} controls className='w-100'>
        <source src={file} type={mime_type}></source>
      </video>
    );
  }

  return (
    <div id={String(fileId)} ref={containerRef} className='center media-container' style={style}>
      {ifTrue(file, renderVideo)}
      {ifTrue(!file, renderPlaceholder)}
    </div>
  );
}
