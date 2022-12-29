import { buildConfig, env } from '@mv-d/toolbelt';

export const CONFIG = {
  ...buildConfig({
    noVersion: true,
  }),
  api: {
    id: env('REACT_APP_TELEGRAM_API_ID').expect(),
    hash: env('REACT_APP_TELEGRAM_API_HASH').expect(),
  },
};
