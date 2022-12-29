import { as, generateId, Optional } from '@mv-d/toolbelt';
import { TError, TUpdates } from '..';
import { Message, MessageTypes } from '../../../domains';
import { Notification } from '../../store';

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
    id: generateId(),
    type: MessageTypes.ERROR,
    text: as<TError>(error).message,
  };
}
