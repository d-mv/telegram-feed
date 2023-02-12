import { buildConfig, env } from '@mv-d/toolbelt';

export const CONFIG = {
  ...buildConfig({
    noVersion: true,
  }),
  api: {
    id: env('REACT_APP_TELEGRAM_API_ID').expect(),
    hash: env('REACT_APP_TELEGRAM_API_HASH').expect(),
  },
  logging: 3, // 0: silent, 1: error_only, 2: error_warn, 3: info, 4: debug
  ui: {
    elementsPerPage: 20,
  },
};
