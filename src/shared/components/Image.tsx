import { AnyValue, ifTrue, Result } from '@mv-d/toolbelt';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useContextSelector } from 'use-context-selector';

import { FeedContext } from '../../domains/feed/feed.context';
import { TFilePart } from '../entities';
import { useQueue } from '../hooks';
import { containerWidthSelector } from '../store';
import { getMediaContainerStyle } from '../tools';
import { DownloadIndicator } from './DownloadIndicator';
import { Icon } from './Icon';

export function Image() {
  const [media, thumbnail] = useContextSelector(FeedContext, c => [c.photo, c.thumbnail]);

  const cardWidth = useRecoilValue(containerWidthSelector);

  const fileId = useMemo(() => (media.isSome ? media.value.photo.id : 0), [media]);

  const [requestSent, setRequestSent] = useState(false);

  const { queueFileDownload } = useQueue();

  const [file, setFile] = useState<AnyValue>();

  const setFileToState = useCallback((file: Result<TFilePart, Error>) => {
    if (file.isOK) setFile(URL.createObjectURL(file.payload.data));
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  function callback(e: AnyValue) {
    // eslint-disable-next-line no-console
    // console.log(
    //   containerRef.current?.offsetTop,
    //   containerRef.current?.offsetHeight,
    //   containerRef.current?.offsetParent,
    // );
  }

  useEffect(() => {
    window.addEventListener('wheel', callback, { passive: false });
    return () => {
      window.removeEventListener('wheel', callback);
    };
  }, [fileId]);

  if (media.isNone) return null;

  const { height, width, photo } = media.value;

  if (!requestSent) {
    setRequestSent(state => !state);

    queueFileDownload(fileId, photo.expected_size, setFileToState);
  }

  const style = getMediaContainerStyle(height, width, { width: cardWidth });

  const renderIcon = () => <Icon icon='image' className='media-stub-icon' />;

  const renderThumbnail = () => <img src={`data:image/jpeg;base64,${thumbnail}`} alt='video' className='w-100 mini' />;

  if (!file)
    return (
      <div id={String(fileId)} ref={containerRef} className='center media-container' style={style}>
        {ifTrue(thumbnail, renderThumbnail, renderIcon)}
        <DownloadIndicator fileId={fileId} />
      </div>
    );

  return (
    <div
      id={String(fileId)}
      className='media-container'
      style={{ backgroundImage: `url(${file})`, backgroundSize: 'cover', ...style }}
    />
  );
}
