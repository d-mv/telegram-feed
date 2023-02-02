import { createContext } from 'use-context-selector';

import { TChatRender } from '../../shared';

export interface FilterContextType {
  item: TChatRender;
  selected: number[];
  onClick: () => void;
}

export const FilterContext = createContext<FilterContextType>({} as FilterContextType);

FilterContext.displayName = 'FilterContext';
