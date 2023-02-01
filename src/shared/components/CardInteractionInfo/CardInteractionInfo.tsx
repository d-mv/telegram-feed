import { clsx } from 'clsx';

import { TMessageInteractionInfo } from '../../entities';
import classes from './CardInteractionInfo.module.scss';
import { Icon } from '../Icon';
import { nFormatter } from '../../tools';
import { WithTooltip } from '../Tooltip';

interface CardInteractionInfo {
  className?: string;
  interactionInfo?: TMessageInteractionInfo;
}

export function CardInteractionInfo({ className, interactionInfo }: CardInteractionInfo) {
  if (!interactionInfo) return null;

  const { view_count, forward_count, reply_info } = interactionInfo;

  function renderViews() {
    if (view_count === undefined) return null;

    return (
      <span className={classes.set}>
        <Icon icon='eye' />
        {nFormatter(view_count)}
      </span>
    );
  }

  function renderForwardCount() {
    if (forward_count === undefined) return null;

    return (
      <span className={classes.set}>
        <Icon icon='forward' />
        {nFormatter(forward_count)}
      </span>
    );
  }

  function renderCommentsCount() {
    if (reply_info === undefined) return null;

    return (
      <span className={classes.set}>
        <Icon icon='comment' />
        {nFormatter(reply_info.reply_count)}
      </span>
    );
  }

  return (
    <WithTooltip tooltip='Views and forwards'>
      <div id='card-interaction-info' className={clsx(classes.container, className, classes['align-right'])}>
        {renderViews()}
        {renderForwardCount()}
        {renderCommentsCount()}
      </div>
    </WithTooltip>
  );
}
