import { buildConfig, env } from '@mv-d/toolbelt';

export const CONFIG = {
  ...buildConfig({
    noVersion: true,
  }),
  api: {
    id: env('REACT_APP_API_ID').value,
    hash: env('REACT_APP_API_HASH').value,
  },
};
