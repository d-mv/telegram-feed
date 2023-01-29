import { as } from '@mv-d/toolbelt';
import { compose } from 'ramda';
import { createContext } from 'use-context-selector';

import { TMessage } from '../../shared';

export interface FeedContextType {
  message: TMessage;
}

export const FeedContext = compose(createContext<FeedContextType>, as<FeedContextType>)({});

FeedContext.displayName = 'FeedContext';
