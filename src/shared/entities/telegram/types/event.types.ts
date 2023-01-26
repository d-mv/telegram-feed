export interface TUpdate {
  '@client_id': number;
}

export interface TExtra {
  query_id: number;
}

export interface TUpdateOk extends TUpdate {
  '@type': 'ok';
}
