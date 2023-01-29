import { TUser, TUserFullInfo } from '../entities';

export interface SelectedChatId {
  id: number;
  title: string;
}

export type StateUser = TUser & Partial<Omit<TUserFullInfo, '@type'>>;

export interface DownloadProgress {
  expectedSize: number;
  downloadedSize: number;
}

export interface FileDownloadProgress {
  [key: number]: DownloadProgress;
}
