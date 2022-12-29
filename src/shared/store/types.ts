import { AnyValue, RecordObject } from '@mv-d/toolbelt';

import { Message } from '../../domains';

export enum StateActions {
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

export interface State {
  notifications: Message[];
}

export type MappedReducerFns = Map<StateActions, (state: State, action: Action) => State>;
