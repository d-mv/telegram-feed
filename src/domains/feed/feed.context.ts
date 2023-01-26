import { as } from '@mv-d/toolbelt';
import { compose } from 'ramda';
import { MouseEvent } from 'react';
import { createContext } from 'use-context-selector';
import { TMessage } from '../../shared';

export interface FeedContextType {
  isLast?: boolean;
  isChat?: boolean;
  message: TMessage;
  onCardClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export const FeedContext = compose(createContext<FeedContextType>, as<FeedContextType>)({});

FeedContext.displayName = 'FeedContext';
