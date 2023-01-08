import { as, R } from '@mv-d/toolbelt';
import { MouseEvent } from 'react';
import { createContext } from 'use-context-selector';
import { TMessage } from '../../shared';

export interface FeedContextType {
  isLast?: boolean;
  isChat?: boolean;
  message: TMessage;
  onCardClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export const FeedContext = R.compose(createContext<FeedContextType>, as<FeedContextType>)({});

FeedContext.displayName = 'FeedContext';
