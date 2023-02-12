import { as, Option } from '@mv-d/toolbelt';
import { compose } from 'ramda';
import { createContext } from 'use-context-selector';

import { TMessage, TPhotoSize, TVideo } from '../../shared';

export interface FeedContextType {
  message: TMessage;
  photo: Option<TPhotoSize>;
  video: Option<TVideo>;
  thumbnail: string;
}

export const FeedContext = compose(createContext<FeedContextType>, as<FeedContextType>)({});

FeedContext.displayName = 'FeedContext';
