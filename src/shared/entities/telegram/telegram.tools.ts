import { as, Optional } from '@mv-d/toolbelt';
import { nanoid } from 'nanoid';

import { TChat, TError, TUpdates } from '..';
import { Message, MessageTypes } from '../../../domains';

export function connectionState(event: Optional<TUpdates>) {
  if (!event || event['@type'] !== 'updateConnectionState') return undefined;

  const state = event.state['@type'];

  // connectionStateReady
  return state;
}

export function authorizationState(event: Optional<TUpdates>) {
  if (!event || event['@type'] !== 'updateAuthorizationState' || !('authorization_state' in event)) return '';

  return event.authorization_state['@type'];
}

export function makeTErrorNotification(error: unknown): Message {
  return {
    id: nanoid(),
    type: MessageTypes.ERROR,
    text: as<TError>(error).message,
  };
}

export const type = <T extends { '@type': string }>(item: T) => item['@type'];

export const isType = <T extends { '@type': string }>(item: T, type: T['@type']) => item['@type'] === type;

export const isPrivate = (chat: TChat) => isType(chat.type, 'chatTypePrivate');

export const isChannel = (chat: TChat) => chat.type['@type'] === 'chatTypeSupergroup' && chat.type.is_channel;
