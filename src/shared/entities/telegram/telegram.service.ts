import { AnyValue } from '@mv-d/toolbelt';
import TdClient, { TdOptions } from 'tdweb';

export type JsLogVerbosityLevel = 'error' | 'warning' | 'info' | 'log' | 'debug' | undefined;

export interface TelegramServiceArgs extends TdOptions {
  apiId: string;
  apiHash: string;
  onUpdate: (update: AnyValue) => void;
  logVerbosityLevel?: number | undefined;
  jsLogVerbosityLevel?: JsLogVerbosityLevel;
}

export class TelegramService {
  client: TdClient;

  constructor(args: TelegramServiceArgs) {
    this.client = this.#init(args);
    this.#setParameters(args.apiId, args.apiHash);
  }

  #init({ onUpdate, logVerbosityLevel, jsLogVerbosityLevel }: TelegramServiceArgs) {
    const client = new TdClient({
      // @ts-ignore -- temp
      useTestDC: false,
      readOnly: false,
      verbosity: 3,
      jsVerbosity: 3,
      fastUpdating: true,
      useDatabase: false,
      mode: 'wasm',
      logVerbosityLevel,
      jsLogVerbosityLevel,
      // @ts-ignore -- use more detailed typings
      onUpdate,
    });

    return client;
  }

  #setParameters(apiId: string, apiHash: string) {
    const parameters = {
      '@type': 'tdParameters',
      use_test_dc: false,
      api_id: apiId,
      api_hash: apiHash,
      system_language_code: navigator.language || 'en',
      device_model: 'Telegram Feed',
      application_version: '0.1',
      use_secret_chats: false,
      use_message_database: true,
      use_file_database: true,
      files_directory: '/',
    };

    this.client.send({ '@type': 'setTdlibParameters', parameters });
  }
}
