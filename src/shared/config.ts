import { buildConfig, env } from '@mv-d/toolbelt';

export const CONFIG = {
  ...buildConfig({
    noVersion: true,
  }),
  api: {
    id: env('REACT_APP_TELEGRAM_API_ID').value,
    hash: env('REACT_APP_TELEGRAM_API_HASH').value,
  },
  app: {
    optimizationsFirstStart: true,
    dbName: 'tdlib',
    dbTestName: 'tdlib_test',
    wasmFileName: '2a79a539dfbe607fd685d6ccdd16b5df.wasm',
    disableLogging: false,
    verbosityJsMax: 20,
    verbosityJsMin: 0,
    verbosityMax: 20,
    verbosityMin: 0,
  },
  storage: {
    registerKey: 'register',
    registerTestKey: 'test_register',
  },
};
