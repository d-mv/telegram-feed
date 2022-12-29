export enum MessageTypes {
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
}

export interface Message {
  id: string;
  text: string;
  type: MessageTypes;
}
