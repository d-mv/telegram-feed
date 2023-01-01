import { as, R } from '@mv-d/toolbelt';
import { createContext } from 'use-context-selector';
import { TMessage } from '../../shared';

export interface FeedContextType {
  message: TMessage;
}

export const FeedContext = R.compose(createContext<FeedContextType>, as<FeedContextType>)({});

FeedContext.displayName = 'FeedContext';
