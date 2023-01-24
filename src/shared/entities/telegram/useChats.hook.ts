import { useCallback, useEffect } from 'react';
import { R } from '@mv-d/toolbelt';
import { addChat, getChatIds, StateActions, useDispatch, useSelector } from '../../store';
import { TChat } from './types';
import { TelegramService } from './telegram.service';

export function useChats() {
  const chatIds = useSelector(getChatIds);

  const dispatch = useDispatch();
}
