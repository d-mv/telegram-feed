import { Optional } from '@mv-d/toolbelt';
import { TChat, TMessage, TMessagePhoto, TPhotoSize, TUser } from '../entities';

interface GetSendFromMessageProps {
  isChat?: boolean;
  message: TMessage;
  getChat: (id: number) => TChat | undefined;
  getUser: (id: number) => TUser | undefined;
  myself: Optional<TUser>;
}

export function getSenderFromMessage({ isChat, message, getChat, getUser, myself }: GetSendFromMessageProps) {
  const s = message.sender_id;

  const chat = getChat(message.chat_id);

  if (s['@type'] === 'messageSenderUser') {
    const user = getUser(s.user_id);

    if (!user) return '';

    const itsMe = user.id === myself?.id;

    // eslint-disable-next-line no-console
    const senderName = `${user?.first_name} ${user?.last_name}`;

    if (senderName === chat?.title) return senderName;

    if (isChat) return senderName;

    if (itsMe) return chat?.title;

    return `${chat?.title} (${senderName})`;
  }

  return getChat(s.chat_id)?.title;
}

export function getPhotoSize(photo: TMessagePhoto, size = 'x') {
  const { sizes } = photo;

  return sizes.find(p => p.type === size);
}

interface GetPhotoContainerStyleOptions {
  width: number;
  maxHeight: number;
}

export function getPhotoContainerStyle(photo: Optional<TPhotoSize>, options?: Partial<GetPhotoContainerStyleOptions>) {
  if (!photo) return {};

  if (!options?.width)
    return {
      width: options?.width,
      height: options?.maxHeight && photo.height > options?.maxHeight ? options.maxHeight : '50vw',
    };

  const ratio = (photo.height || 1) / (photo.width || 1);

  const isVertical = ratio > 1;

  const r = photo.width / (options.width * 10);

  const widthArg = `${options.width}rem`;

  if (isVertical) return { width: widthArg, height: photo.height / r };

  return { width: widthArg, height: `${options.width * ratio}rem` };
}

export function processUrl(url: string): string {
  if (!url) return '';

  return url.slice(0, 4) === 'http' ? url : `https://${url}`;
}

export function shouldRenderLinkTooltip(tooltip: string) {
  return tooltip.length > 240;
}
