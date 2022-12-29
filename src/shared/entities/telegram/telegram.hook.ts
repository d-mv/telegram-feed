import { useContextSelector } from 'use-context-selector';
import QRCodeStyling from 'qr-code-styling';
import { logger, R } from '@mv-d/toolbelt';

import tg_logo from '../../assets/tg_logo.png';
import { MaybeNull } from '../../types';
import { addNotification, useDispatch } from '../../store';
import { TelegramContext } from './telegram.context';
import { makeTErrorNotification } from './telegram.tools';

export function useTelegram() {
  const [client, event] = useContextSelector(TelegramContext, c => [c.client, c.event]);

  const dispatch = useDispatch();

  function submitPassword(password: string) {
    client
      .send({
        '@type': 'checkAuthenticationPassword',
        password,
      })
      .catch(R.compose(dispatch, addNotification, makeTErrorNotification));
  }

  function handleAuthentication(container: MaybeNull<HTMLDivElement>) {
    return async function call() {
      if (!event || !('authorization_state' in event)) return;

      const type = event!.authorization_state['@type'];

      switch (type) {
        // case 'authorizationStateClosed':
        //   await client.send({ '@type': 'destroy' });
        //   window.location.reload(); // a kind of a 'hack' but it works...
        //   break;
        case 'authorizationStateWaitEncryptionKey':
          client
            .send({
              '@type': 'checkDatabaseEncryptionKey',
            })
            .catch(R.compose(dispatch, addNotification, makeTErrorNotification));

          break;
        case 'authorizationStateWaitPhoneNumber':
          await client.send({
            '@type': 'requestQrCodeAuthentication',
            other_user_ids: [],
          });
          break;
        case 'authorizationStateWaitOtherDeviceConfirmation':
          if (!container) {
            logger.error('Container is not defined');
            return;
          }

          // eslint-disable-next-line no-case-declarations
          const qrCode = new QRCodeStyling({
            width: 200,
            height: 200,
            data: event!.authorization_state.link,
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

          break;
        default:
          break;
      }
    };
  }

  const getChats = async (offset_order = '9223372036854775807', offset_chat_id = 0, limit = 20) => {
    // eslint-disable-next-line no-console
    console.log('getChats');
    return client.send({
      '@type': 'getChats',
      chat_list: { '@type': 'chatListMain' },
      offset_order,
      offset_chat_id,
      limit,
    });
  };

  return { handleAuthentication, getChats, submitPassword };
}
