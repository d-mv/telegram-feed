import { useReducer } from 'react';
import { Optional } from '@mv-d/toolbelt';
import { createContext, useContext } from 'use-context-selector';

import { Dispatch, State } from './types';
import { reducer } from './reducer';
import { INITIAL_STATE } from './initial';

const StateContext = createContext<Optional<State>>(undefined);

StateContext.displayName = 'StateContext';

const DispatchContext = createContext<Optional<Dispatch>>(undefined);

DispatchContext.displayName = 'DispatchContext';

interface Props {
  children: React.ReactNode;
}

export function StateProvider({ children }: Props) {
  // TODO: remove reducer hook
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useSelector<T>(fn: (state: State) => T) {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error('useSelector: no context');
  }

  return fn(context);
}

export function useDispatch() {
  const context = useContext(DispatchContext);

  if (!context) {
    throw new Error('useDispatch: no context');
  }

  return context;
}

export function useState() {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error('useState: no context');
  }

  return context;
}
