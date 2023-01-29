import { TData } from './event.types';

export interface TError extends TData {
  '@type': 'error';
  code: number;
  message: string;
}
