import { useContext } from 'use-context-selector';

import { TelegramContext } from '../context';

export function useTelegram() {
  const context = useContext(TelegramContext);

  if (!context) throw new Error('useTelegram must be used within a TelegramProvider');

  return context;
}
