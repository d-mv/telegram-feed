import { Optional } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { useMemo } from 'react';

import { TWebPage } from '../../entities';
import { getPhotoSize, processUrl, shouldRenderLinkTooltip } from '../../tools';
import { CardDivider } from '../CardDivider';
import { Image } from '../Image';
import { WithTooltip } from '../Tooltip';
import classes from './CardWebPage.module.scss';

interface CardProps {
  webPage: Optional<TWebPage>;
  className?: string;
  width: number;
}

export function CardWebPage({ className, webPage, width }: CardProps) {
  const description = useMemo(() => webPage?.description.text || '', [webPage]);

  const url = useMemo(() => (webPage?.display_url ?? webPage?.url) || '', [webPage]);

  if (!webPage) return null;

  function renderPhoto() {
    if (!webPage?.photo || !webPage?.photo.sizes?.length) return null;

    const photo = getPhotoSize(webPage.photo);

    if (!photo) return null;

    return <Image asBackground media={webPage.photo} className={classes.photo} alt='Web page photo' width={width} />;
  }

  function renderDescriptionContents() {
    return (
      <a
        id='web-page-link'
        href={processUrl(url)}
        target='_blank'
        rel='noopener noreferrer'
        className={classes.display_url}
        // no need to trigger additional events, like click on card
        onClick={e => e.stopPropagation()}
      >
        <p className={clsx('p4', classes.description)}>{description}</p>
      </a>
    );
  }

  function renderDescription() {
    if (shouldRenderLinkTooltip(description))
      return (
        <WithTooltip tooltip={description} containerClass={classes['tooltip-container']}>
          {renderDescriptionContents()}
        </WithTooltip>
      );

    return renderDescriptionContents();
  }

  // TODO: fix the render of instagram links
  return (
    <div id='card-web-page' className={clsx(classes.container, className)}>
      <CardDivider className={classes.divider} />
      <p className={clsx('p4', classes.title)}>{webPage.title}</p>
      {renderPhoto()}
      {renderDescription()}
      <p className={classes.site_name}>{`@${webPage.site_name}`}</p>
    </div>
  );
}
