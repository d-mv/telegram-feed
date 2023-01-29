export interface TUpdate {
  '@client_id': number;
}

export interface TExtra {
  query_id: number;
}

export interface TUpdateOk extends TUpdate {
  '@type': 'ok';
}

export interface TData {
  '@client_id': number;
  '@extra': TExtra;
}
