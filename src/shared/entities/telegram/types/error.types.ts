export interface TError {
  '@client_id': 1;
  '@extra': { query_id: number };
  '@type': 'error';
  code: number;
  message: string;
}
