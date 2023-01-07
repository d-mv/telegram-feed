import { useContextSelector } from 'use-context-selector';
import QRCodeStyling from 'qr-code-styling';
import { failure, logger, PromisedResult, R, success } from '@mv-d/toolbelt';

import tg_logo from '../../assets/tg_logo.png';
import { MaybeNull } from '../../types';
import { addNotification, useDispatch } from '../../store';
import { TelegramContext } from './telegram.context';
import { makeTErrorNotification } from './telegram.tools';
import { TFilePart } from './types';
import { isDebugLogging } from '../../tools';
import { CONFIG } from '../../config';

export function useTelegram() {
  const [client, event, send] = useContextSelector(TelegramContext, c => [c.client, c.event, c.send]);

  const dispatch = useDispatch();

  function submitPassword(password: string) {
    client
      .send({
        '@type': 'checkAuthenticationPassword',
        password,
      })
      .catch((err: unknown) => {
        if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(err);
      });
  }

  function handleAuthentication(container: MaybeNull<HTMLDivElement>) {
    return async function call() {
      if (!event) return;

      if (!('authorization_state' in event)) return;

      const type = event.authorization_state['@type'];

      switch (type) {
        // case 'authorizationStateClosed':

        //   break;
        case 'authorizationStateWaitEncryptionKey':
          client
            .send({
              '@type': 'checkDatabaseEncryptionKey',
            })
            .catch((err: unknown) => {
              if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(err);
            });

          break;
        case 'authorizationStateWaitPhoneNumber':
          await client.send({
            '@type': 'requestQrCodeAuthentication',
            other_user_ids: [],
          });
          break;
        case 'authorizationStateWaitOtherDeviceConfirmation':
          if (!container) {
            if (isDebugLogging(CONFIG)) logger.error('Container is not defined');

            return;
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

          break;
        default:
          break;
      }
    };
  }

  const getChats = async (offset_order = '9223372036854775807', offset_chat_id = 0, limit = 20) => {
    return client.send({
      '@type': 'getChats',
      chat_list: { '@type': 'chatListMain' },
      offset_order,
      offset_chat_id,
      limit,
    });
  };

  async function downloadFile(fileId: number): PromisedResult<TFilePart> {
    // downloading the file
    await client
      .send({
        '@type': 'downloadFile',
        file_id: fileId,
        priority: 1,
        synchronous: true,
      })
      .catch((err: unknown) => {
        if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(err);
      });

    // Read the data from local tdlib to blob
    const maybeFile = await send<TFilePart>({
      type: 'readFile',
      file_id: fileId,
    });

    if (maybeFile.isSome) return success(maybeFile.payload);
    else {
      if (isDebugLogging(CONFIG)) R.compose(dispatch, addNotification, makeTErrorNotification)(maybeFile.error);

      return failure(maybeFile.error);
    }
  }

  return { handleAuthentication, getChats, submitPassword, downloadFile };
}
