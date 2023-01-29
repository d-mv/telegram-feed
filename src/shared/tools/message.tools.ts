import { Optional } from '@mv-d/toolbelt';

import { TChat, TMessage, TPhoto, TUser } from '../entities';
import { StateUser } from '../store';

interface GetSendFromMessageProps {
  message: TMessage;
  getChat: (id: number) => TChat | undefined;
  getUser: (id: number) => Optional<StateUser>;
  myself: Optional<TUser>;
}

export function getSenderFromMessage({ message, getChat, getUser, myself }: GetSendFromMessageProps) {
  const s = message.sender_id;

  const chat = getChat(message.chat_id);

  if (s['@type'] === 'messageSenderUser') {
    const user = getUser(s.user_id);

    if (!user) return '';

    const itsMe = user.id === myself?.id;

    // eslint-disable-next-line no-console
    const senderName = `${user?.first_name} ${user?.last_name}`;

    if (senderName === chat?.title) return senderName;

    if (itsMe) return chat?.title;

    return `${chat?.title} (${senderName})`;
  }

  return getChat(s.chat_id)?.title;
}

export function getPhotoSize(photo: TPhoto, size = 'x') {
  const { sizes } = photo;

  return sizes.find(p => p.type === size || p.type === 'm' || p.type === 's');
}

interface GetPhotoContainerStyleOptions {
  width: number;
  maxHeight: number;
}

export function getMediaContainerStyle(
  height: number,
  width: number,
  options?: Partial<GetPhotoContainerStyleOptions>,
) {
  if (!options?.width)
    return {
      width: options?.width,
      height: options?.maxHeight && height > options?.maxHeight ? options.maxHeight : '50vw',
    };

  const ratio = (height || 1) / (width || 1);

  const isVertical = ratio > 1;

  const r = width / (options.width * 10);

  const widthArg = `${options.width}rem`;

  if (isVertical) return { width: widthArg, height: height / r };

  return { width: widthArg, height: `${options.width * ratio}rem` };
}

export function processUrl(url: string): string {
  if (!url) return '';

  return url.slice(0, 4) === 'http' ? url : `https://${url}`;
}

export function shouldRenderLinkTooltip(tooltip: string) {
  return tooltip.length > 240;
}
