import { AnyValue, logger, none, Option, Optional, some } from '@mv-d/toolbelt';
import TdClient, { TdOptions } from 'tdweb';
import { CONFIG } from '../../config';
import { isDebugLogging } from '../../tools';

const { id, hash } = CONFIG.api;

export interface TelegramSendParams {
  type: string;
  [key: string]: unknown;
}

export type JsLogVerbosityLevel = 'error' | 'warning' | 'info' | 'log' | 'debug' | undefined;

export interface TelegramServiceArgs extends TdOptions {
  onUpdate: (update: AnyValue) => void;
  logVerbosityLevel?: number | undefined;
  jsLogVerbosityLevel?: JsLogVerbosityLevel;
}

export class TelegramServiceClass {
  client: Optional<TdClient>;

  init({ onUpdate, logVerbosityLevel, jsLogVerbosityLevel }: TelegramServiceArgs) {
    this.client = new TdClient({
      // @ts-ignore -- temp
      useTestDC: false,
      readOnly: false,
      verbosity: 1000,
      jsVerbosity: 3,
      fastUpdating: true,
      useDatabase: false,
      mode: 'wasm',
      logVerbosityLevel,
      jsLogVerbosityLevel,
      // @ts-ignore -- use more detailed typings
      onUpdate,
    });

    this.#setParameters();
  }

  #setParameters() {
    const parameters = {
      '@type': 'tdParameters',
      use_test_dc: false,
      api_id: id,
      api_hash: hash,
      system_language_code: navigator.language || 'en',
      device_model: 'Telegram Feed',
      application_version: '0.1',
      use_secret_chats: false,
      use_message_database: true,
      use_file_database: true,
      files_directory: '/',
    };

    this.client?.send({ '@type': 'setTdlibParameters', parameters });
    this.client?.send({ '@type': 'getOption', name: 'my_id' });
  }

  async send<R>({ type, ...args }: TelegramSendParams): Promise<Option<R>> {
    if (!this.client) return none(new Error('Client is not initialized'));

    try {
      const r = (await this.client.send({ '@type': type, ...args })) as R;

      return some(r);
    } catch (err) {
      // if (isDebugLogging(CONFIG)) logger.error(err, 'Send error');
      // eslint-disable-next-line no-console
      console.log(err, type, args);

      return none(err as Error);
    }
  }
}

export const TelegramService = new TelegramServiceClass();
