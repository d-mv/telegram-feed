import { AnyValue, RecordObject } from '@mv-d/toolbelt';
import { StateActions } from './action.types';
import { State } from './state.types';

export interface Action<T = AnyValue> {
  type: StateActions;
  payload?: T;
  meta?: RecordObject;
}

export type Dispatch<T = unknown> = (action: Action<T>) => void;

export type MappedReducerFns = Map<StateActions, (state: State, action: Action) => State>;
