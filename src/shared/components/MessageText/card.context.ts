import { createContext } from 'use-context-selector';

export interface CardContextType {
  width: number;
  id: string;
}

export const CardContext = createContext<CardContextType>({} as CardContextType);

CardContext.displayName = 'CardContext';
