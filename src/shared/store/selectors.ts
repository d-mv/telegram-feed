import { State, LoadingItems } from './types';

export const getAppIsLoading = (state: State) => state.isLoading[LoadingItems.APP];

export const getIsAuthed = (state: State) => !!state.app.authorizationState;

export const getAuthStep = (state: State) => state.authorization.step;

export const getMessages = (state: State) => state.notifications;
