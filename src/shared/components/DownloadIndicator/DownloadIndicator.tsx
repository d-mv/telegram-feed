import { ifTrue } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { path } from 'ramda';
import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { fileDownloadProgressSelector } from '../../store';
import { Icon } from '../Icon';
import { ProgressIndicator } from '../ProgressIndicator';
import classes from './DownloadIndicator.module.scss';

const formatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
}).format;

interface DownloadIndicatorProps {
  fileId: number;
}

export function DownloadIndicator({ fileId }: DownloadIndicatorProps) {
  const downloadProgress = useRecoilValue(fileDownloadProgressSelector);

  const progress = useMemo(() => path([fileId], downloadProgress), [downloadProgress, fileId]);

  const [renderAsValues, setRenderAsValues] = useState(true);

  if (!progress) return null;

  const renderValue = (number: number) => `${formatter(number / 1024 / 1024)}MB`;

  const renderValues = () => `${renderValue(progress.downloadedSize)} of ${renderValue(progress.expectedSize)}`;

  const renderPercentage = () => `${formatter((progress.downloadedSize / progress.expectedSize) * 100)}%`;

  function toggleView() {
    setRenderAsValues(state => !state);
  }

  function renderProgressData() {
    return (
      <button id='outside-link' className={classes.button} onClick={toggleView}>
        <Icon id='outside-link' icon='download' className={classes.icon} />
        <p id='outside-link' className={clsx('p4', classes.text)}>
          {renderAsValues ? renderValues() : renderPercentage()}
        </p>
      </button>
    );
  }

  return (
    <>
      {ifTrue(progress.expectedSize / 1024 > 150, renderProgressData)}
      <ProgressIndicator progress={(progress.downloadedSize / progress.expectedSize) * 100} />
    </>
  );
}
