import { deepEqual, logger } from '@mv-d/toolbelt';

import { State, Action } from './types';
import { CONFIG } from '../config';
import { MAP } from './map';

function stateLogger(state: State, action: Action, nextState: State) {
  if (!CONFIG.isDev) return;

  logger.dir(['state updated', state, action, nextState]);
}

export function reducer(state: State, action: Action) {
  const fn = MAP.get(action.type);

  let nextState = state;

  if (fn) {
    const result = fn(state, action);

    if (!deepEqual(result, state)) {
      nextState = result;

      stateLogger(state, action, nextState);
    }
  }

  return nextState;
}
