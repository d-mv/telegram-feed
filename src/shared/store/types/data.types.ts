import { TUser, TUserFullInfo } from '../../entities';

export interface SelectedChatId {
  id: number;
  title: string;
}

export type StateUser = TUser & Partial<Omit<TUserFullInfo, '@type'>>;
