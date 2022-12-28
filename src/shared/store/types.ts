import { AnyValue, RecordObject } from '@mv-d/toolbelt';

export enum StateActions {
  SET_IS_LOADING = 'setIsLoading',
  CLEAR_STATE = 'clearState',
}

export interface Action<T = AnyValue> {
  type: StateActions;
  payload?: T;
  meta?: RecordObject;
}

export type Dispatch<T = unknown> = (action: Action<T>) => void;

export enum LoadingItems {
  APP = 'app',
}

export interface State {
  isLoading: Record<LoadingItems, boolean>;
  app: { authorizationState: boolean; tdlibDatabaseExists: boolean };
  authorization: {
    step: number;
  };
}

export type MappedReducerFns = Map<StateActions, (state: State, action: Action) => State>;
