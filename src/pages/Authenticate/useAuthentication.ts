import { makeMatch, none, logger, Option, some } from '@mv-d/toolbelt';
import QRCodeStyling from 'qr-code-styling';
import { useRecoilValue } from 'recoil';

import {
  authEventSelector,
  CONFIG,
  isDebugLogging,
  MaybeNull,
  TELEGRAM_AUTH_TYPES,
  TUpdates,
  type,
} from '../../shared';
import tg_logo from '../../shared/assets/tg_logo.png';
import { TelegramService } from '../../shared/entities/telegram/telegram.service';

type Container = MaybeNull<HTMLDivElement>;

const MATCH_AUTH_STATE = makeMatch<(event: TUpdates, container?: Container) => Promise<Option>>(
  {
    authorizationStateWaitEncryptionKey: () => TelegramService.send({ type: 'checkDatabaseEncryptionKey' }),
    authorizationStateWaitPhoneNumber: () =>
      TelegramService.send({ type: 'requestQrCodeAuthentication', other_user_ids: [] }),
    authorizationStateWaitOtherDeviceConfirmation: async (event: TUpdates, container?: Container) => {
      if (!event) return none();

      if (
        !TELEGRAM_AUTH_TYPES.includes(type(event)) ||
        !('authorization_state' in event) ||
        event.authorization_state['@type'] !== 'authorizationStateWaitOtherDeviceConfirmation'
      )
        return none();

      if (!container) {
        if (isDebugLogging(CONFIG)) logger.error('Container is not defined');

        return none();
      }

      // eslint-disable-next-line no-case-declarations
      const qrCode = new QRCodeStyling({
        width: 200,
        height: 200,
        data: event.authorization_state.link,
        dotsOptions: {
          color: '#1132b6',
          type: 'square',
        },
        backgroundOptions: {
          color: 'transparent',
        },
        image: tg_logo,
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 6,
        },
      });

      container.innerHTML = '';
      qrCode.append(container);
      return some('ok');
    },
  },
  // eslint-disable-next-line promise/avoid-new
  () => new Promise(resolve => resolve(none())),
);

export function useAuthentication() {
  const event = useRecoilValue(authEventSelector);

  async function handleAuthentication(container: Container): Promise<void> {
    if (!event) return;

    if (!('authorization_state' in event)) return;

    await MATCH_AUTH_STATE[type(event.authorization_state)](event, container);
  }

  return { handleAuthentication };
}
