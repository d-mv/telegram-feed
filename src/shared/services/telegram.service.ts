import TdClient, { TdObject } from 'tdweb';

export class TelegramService {
  client: TdClient;

  constructor(apiId: string, apiHash: string, onUpdate: (update: TdObject) => void) {
    this.client = this.#init(onUpdate);
    this.#setParameters(apiId, apiHash);
  }

  #init(onUpdate: (update: TdObject) => void) {
    const client = new TdClient({
      // @ts-ignore -- temp
      useTestDC: false,
      readOnly: false,
      verbosity: 3,
      jsVerbosity: 3,
      fastUpdating: true,
      useDatabase: false,
      mode: 'wasm',
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
