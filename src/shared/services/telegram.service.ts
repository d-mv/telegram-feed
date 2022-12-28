/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// import EventEmitter from '../Stores/EventEmitter';
import packageJson from '../../../package.json';
// import { strToBool, getBrowser, getOSName } from '../Utils/Common';
// import {
//   DATABASE_NAME,
//   DATABASE_TEST_NAME,
//   VERBOSITY_JS_MAX,
//   VERBOSITY_JS_MIN,
//   VERBOSITY_MAX,
//   VERBOSITY_MIN,
//   WASM_FILE_HASH,
//   WASM_FILE_NAME,
// } from '../Constants';
import { AnyValue, logger, makeMatch, Optional, RecordObject } from '@mv-d/toolbelt';
import TdClient, { TdObject, TdError } from 'tdweb';
import { CONFIG } from '../config';
import { databaseExists, getBrowser, getOSName, strToBool, wasmFileNameToHash } from '../tools';
import { EventEmitter } from './eventEmitter.service';
// import TdClient from '@arseny30/tdweb/dist/tdweb';
// import TdClient from '../../public/tdweb';

const { dbName, dbTestName, wasmFileName, disableLogging, verbosityJsMax, verbosityJsMin, verbosityMax, verbosityMin } =
  CONFIG.app;

type JsVerbosity = 'error' | 'warning' | 'info' | 'log' | 'debug' | undefined;

const MATCH_VERBOSITY = makeMatch<JsVerbosity>(
  {
    1: 'error',
    2: 'warning',
    3: 'info',
    4: 'log',
    5: 'debug',
  },
  'error',
);

interface OptTdObject extends RecordObject<boolean | number | string | JsVerbosity | string[]> {
  useTestDC: boolean;
  readOnly: boolean;
  verbosity: number;
  jsVerbosity: JsVerbosity;
  fastUpdating: boolean;
  useDatabase: boolean;
  tag?: string[];
  tagVerbosity?: string[];
  mode: 'wasm';
}

interface UpdateEvent {
  '@type': string;
  '@extra'?: string | undefined;
  [key: string]: TdObject | TdObject[] | number | number[] | string | string[] | boolean | boolean[] | undefined;
}

class TelegramService extends EventEmitter {
  parameters: OptTdObject = {
    useTestDC: false,
    readOnly: false,
    verbosity: 1,
    jsVerbosity: 'info',
    fastUpdating: true,
    useDatabase: false,
    mode: 'wasm',
  };

  disableLog = disableLogging;

  streaming = true;

  calls = false;

  client: Optional<TdClient>;

  constructor() {
    super();

    this.setParameters(window.location);
  }

  init = () => {
    const { verbosity, jsVerbosity, useTestDC, readOnly, fastUpdating, useDatabase, mode } = this.parameters;

    const instanceName = useTestDC ? dbTestName : dbName;

    databaseExists(instanceName, exists => {
      this.clientUpdate({ '@type': 'clientUpdateTdLibDatabaseExists', exists });

      const options = {
        logVerbosityLevel: verbosity,
        jsLogVerbosityLevel: jsVerbosity,
        mode, // 'wasm-streaming', 'wasm', 'asmjs'
        instanceName,
        readOnly,
        isBackground: false,
        useDatabase,
        wasmUrl: `${wasmFileName}?_sw-precache=${wasmFileNameToHash(wasmFileName)}`,
        onUpdate: this.onUpdate,
      };

      logger.info(
        `[TdLibController] (fast_updating=${fastUpdating}) Start client with params=${JSON.stringify(options)}`,
      );

      this.client = new TdClient(options);
    });
  };

  // UpdateEvent
  onUpdate = (update: AnyValue) => {
    if (!update) {
      logger.warn('Update is empty');
      return;
    }

    if (!disableLogging) {
      if (update['@type'] === 'updateFile') {
        logger.info(
          `receive updateFile file_id=${JSON.stringify((update.file as Optional<AnyValue>)?.id)} JSON=${JSON.stringify(
            update,
          )}`,
        );
      } else {
        logger.dir({ update });
      }
    }

    this.emit('update', update);
  };

  log = (message: string, event: UpdateEvent | TdObject | TdError) => {
    if (disableLogging) return;

    logger.info(`${message} JSON=${JSON.stringify(event)}`);
  };

  clientUpdate = (update: UpdateEvent) => {
    this.log('clientUpdate', update);

    this.emit('clientUpdate', update);
  };

  params = { test: 'useTestDC', readonly: 'readOnly', fastupdating: 'fastUpdating', db: 'useDatabase', mode: 'mode' };

  updateParams = (pms: URLSearchParams) => {
    Object.entries(this.params).forEach(([paramKey, thisKey]) => {
      if (pms.has(paramKey)) this.parameters[thisKey] = strToBool(pms.get(paramKey));
    });
  };

  updateSettings = (pms: URLSearchParams) => {
    if (pms.has('clientlog')) this.disableLog = !strToBool(pms.get('clientlog'));

    if (pms.has('streaming')) this.streaming = strToBool(pms.get('streaming'));

    if (pms.has('calls')) this.calls = strToBool(pms.get('calls'));
  };

  updateVerbosity = (pms: URLSearchParams) => {
    if (pms.has('verbosity')) {
      const verbosity = parseInt(pms.get('verbosity') ?? '0', 10);

      if (verbosity >= verbosityMin && verbosity <= verbosityMax) {
        this.parameters.verbosity = verbosity;
      }
    }
  };

  updateJsVerbosity = (pms: URLSearchParams) => {
    if (pms.has('jsverbosity')) {
      const jsVerbosity = parseInt(pms.get('jsverbosity') ?? '0', 10);

      if (jsVerbosity >= verbosityJsMin && jsVerbosity <= verbosityJsMax) {
        this.parameters.jsVerbosity = MATCH_VERBOSITY[jsVerbosity];
      }
    }
  };

  updateTag = (pms: URLSearchParams) => {
    if (pms.has('tag') && pms.has('tagverbosity')) {
      const tag = pms.get('tag')?.replace('[', '').replace(']', '').split(',');

      const tagVerbosity = pms.get('tagverbosity')?.replace('[', '').replace(']', '').split(',');

      if (tag && tagVerbosity && tag.length === tagVerbosity.length) {
        this.parameters.tag = tag;
        this.parameters.tagVerbosity = tagVerbosity;
      }
    }
  };

  setParameters = (location: { search: string }) => {
    if (!location || !location.search) return;

    const params = new URLSearchParams(location.search.toLowerCase());

    this.updateParams(params);
    this.updateSettings(params);
    this.updateVerbosity(params);
    this.updateJsVerbosity(params);
    this.updateTag(params);
  };

  send = (request: TdObject) => {
    if (!this.client) {
      this.log('send (none init)', request);
      return Promise.reject('tdweb client is not ready yet');
    }

    if (!this.disableLog) {
      this.log('send', request);

      return this.client
        .send(request)
        .then(result => {
          this.log('send result', result);
          return result;
        })
        .catch(error => {
          this.log('send error', error);

          throw error;
        });
    } else {
      return this.client.send(request);
    }
  };

  sendTdParameters = async () => {
    // eslint-disable-next-line no-console
    console.log(process.env);

    const apiId = process.env.REACT_APP_TELEGRAM_API_ID;

    const apiHash = process.env.REACT_APP_TELEGRAM_API_HASH;

    // console.log('[td] sendTdParameters', apiHash, apiId);
    if (!apiId || !apiHash) {
      if (
        window.confirm(
          'API id is missing!\n' +
            'In order to obtain an API id and develop your own application ' +
            'using the Telegram API please visit https://core.telegram.org/api/obtaining_api_id',
        )
      ) {
        window.location.href = 'https://core.telegram.org/api/obtaining_api_id';
      }
    }

    const { useTestDC } = this.parameters;

    const { version } = packageJson;

    this.send({
      '@type': 'setTdlibParameters',
      parameters: {
        '@type': 'tdParameters',
        use_test_dc: useTestDC,
        api_id: apiId,
        api_hash: apiHash,
        system_language_code: navigator.language || 'en',
        device_model: getBrowser(),
        system_version: getOSName(),
        application_version: version,
        use_secret_chats: false,
        use_message_database: true,
        use_file_database: false,
        database_directory: '/db',
        files_directory: '/',
      },
    });

    this.send({
      '@type': 'setOption',
      name: 'use_quick_ack',
      value: {
        '@type': 'optionValueBoolean',
        value: true,
      },
    });

    if (this.parameters.tag && this.parameters.tagVerbosity) {
      for (let i = 0; i < this.parameters.tag.length; i++) {
        const tag = this.parameters.tag[i];

        const tagVerbosity = this.parameters.tagVerbosity[i];

        this.send({
          '@type': 'setLogTagVerbosityLevel',
          tag: tag,
          new_verbosity_level: tagVerbosity,
        });
      }
    }
  };

  logOut() {
    this.send({ '@type': 'logOut' }).catch(error => {
      this.emit('tdlib_auth_error', error);
    });
  }

  // verify function argument types & defaults
  setChatId = (chatId: string, messageId = '', options = undefined) => {
    const update: TdObject = {
      '@type': 'clientUpdateChatId',
      chatId,
      messageId,
      options,
    };

    this.clientUpdate(update);
  };

  setMediaViewerContent(content: TdObject) {
    this.clientUpdate({
      '@type': 'clientUpdateMediaViewerContent',
      content: content,
    });
  }
}

export const controller = new TelegramService();

// TODO: do we need below?
// window.controller = controller;
