import { TData, TExtra } from './event.types';

export interface TFileLocal {
  '@type': 'localFile';
  can_be_deleted: boolean;
  can_be_downloaded: boolean;
  download_offset: number;
  downloaded_prefix_size: number;
  downloaded_size: number;
  is_downloading_active: boolean;
  is_downloading_completed: boolean;
  path: string;
}

export interface TFileRemote {
  '@type': 'remoteFile';
  id: string;
  is_uploading_active: boolean;
  is_uploading_completed: boolean;
  unique_id: string;
  uploaded_size: number;
}

export interface TFile {
  '@type': 'file';
  expected_size: number;
  id: number;
  local: TFileLocal;
  remote: TFileRemote;
  size: number;
}

export interface TFilePart extends TData {
  '@type': 'filePart';
  data: Blob;
  transaction_id: number;
}

// updates
export interface TUpdateFile {
  '@type': 'updateFile';
  file: TFile;
}
