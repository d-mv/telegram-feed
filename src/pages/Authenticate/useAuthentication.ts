import { makeMatch, none, logger, Option, some, AnyValue, as } from '@mv-d/toolbelt';
import QRCodeStyling from 'qr-code-styling';
import { path } from 'ramda';
import { FormEvent, useCallback, useMemo } from 'react';
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
    // authorizationStateWaitPhoneNumber: async e => {
    //   // eslint-disable-next-line no-console
    //   console.log(e);
    //   return none();
    // },
    // authorizationStateWaitPhoneNumber: () =>
    //   TelegramService.send({ type: 'requestQrCodeAuthentication', other_user_ids: [] }),
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

const tester = new RegExp(/^\+[\d\s]{12}/);

export function useAuthentication() {
  const event = useRecoilValue(authEventSelector);

  async function handleAuthentication(container: Container): Promise<void> {
    if (!event) return;

    // eslint-disable-next-line no-console
    console.log(event);

    if (!('authorization_state' in event)) return;

    await MATCH_AUTH_STATE[type(event.authorization_state)](event, container);
  }

  const isPhoneNo = useCallback((phone: string) => tester.test(phone.replace(' ', '')), []);

  const sendAuthenticationPhoneNumber = (phone_number: string) => {
    TelegramService.send({ type: 'setAuthenticationPhoneNumber', phone_number });
  };

  const checkAuthenticationCode = useCallback(
    (code: string) => TelegramService.send({ type: 'checkAuthenticationCode', code }),
    [],
  );

  const loginCodeLength = useMemo(() => {
    if (!event || event.authorization_state['@type'] !== 'authorizationStateWaitCode') return 0;

    return event.authorization_state.code_info.type.length;
  }, [event]);

  const loginCodePlaceholder = useMemo(() => {
    if (!loginCodeLength) return '';

    const result: string[] = [];

    for (let i = 0; i < loginCodeLength; i++) {
      result.push('0');
    }

    return result.join('');
  }, [loginCodeLength]);

  const getFieldValueFromFromInput = useCallback((e: FormEvent<HTMLFormElement>, key: string) => {
    return path(
      [key],
      Object.entries<HTMLInputElement>(as<AnyValue>(e.target).elements)
        .filter(([el]) => Number.isNaN(parseInt(el)))
        .reduce((acc, [k, element]) => ({ ...acc, [k]: element.value }), {} as Record<string, string>),
    );
  }, []);

  return {
    checkAuthenticationCode,
    getFieldValueFromFromInput,
    handleAuthentication,
    isPhoneNo,
    loginCodeLength,
    loginCodePlaceholder,
    sendAuthenticationPhoneNumber,
  };
}
