import { AnyValue, RecordObject } from '@mv-d/toolbelt';
import { Message } from '../../domains';

export enum StateActions {
  SET_IS_LOADING = 'setIsLoading',
  CLEAR_STATE = 'clearState',
  ADD_NOTIFICATION = 'addNotification',
  REMOVE_NOTIFICATION = 'removeNotification',
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

export type Notification = { id: string; type: 'info' | 'error'; text: string };

export interface State {
  isLoading: Record<LoadingItems, boolean>;
  app: { authorizationState: boolean; tdlibDatabaseExists: boolean };
  authorization: {
    step: number;
  };
  notifications: Message[];
}

export type MappedReducerFns = Map<StateActions, (state: State, action: Action) => State>;
