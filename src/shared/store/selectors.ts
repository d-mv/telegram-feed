import { State, LoadingItems } from './types';

export const getAppIsLoading = (state: State) => state.isLoading[LoadingItems.APP];
