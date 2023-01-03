import { Optional } from '@mv-d/toolbelt';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { TWebPage } from '../../entities';
import { getPhotoContainerStyle, getPhotoSize, processUrl, shouldRenderLinkTooltip } from '../../tools';
import { CardDivider } from '../CardDivider';
import { Image } from '../Image';
import { WithTooltip } from '../Tooltip';

import classes from './CardWebPage.module.scss';

interface CardProps {
  webPage: Optional<TWebPage>;
  className?: string;
}

export function CardWebPage({ className, webPage }: CardProps) {
  const description = useMemo(() => webPage?.description.text || '', [webPage]);

  const url = useMemo(() => (webPage?.display_url ?? webPage?.url) || '', [webPage]);

  if (!webPage) return null;

  function renderPhoto() {
    if (!webPage?.photo || !webPage?.photo.sizes?.length) return null;

    const photo = getPhotoSize(webPage.photo);

    if (!photo) return null;

    return (
      <Image
        asBackground
        photoId={photo.photo.id}
        className={classes.photo}
        alt='Web page photo'
        style={getPhotoContainerStyle(photo, 38)}
      />
    );
  }

  function renderDescriptionContents() {
    return (
      <a href={processUrl(url)} target='_blank' rel='noopener noreferrer' className={classes.display_url}>
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
