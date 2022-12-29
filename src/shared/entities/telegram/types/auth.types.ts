import { TUpdate } from './event.types';

export interface TUpdateAuthState extends TUpdate {
  '@type': 'updateAuthorizationState';
}

export interface TUpdateWaitOtherDeviceConfirmation extends TUpdateAuthState {
  authorization_state: {
    '@type': 'authorizationStateWaitOtherDeviceConfirmation';
    link: string;
  };
}

export interface TUpdateWaitPassword extends TUpdateAuthState {
  authorization_state: {
    '@type': 'authorizationStateWaitPassword';
    has_recovery_email_address: boolean;
    password_hint: string;
    recovery_email_address_pattern: string;
  };
}

export interface TUpdateWaitEncryptionKey extends TUpdateAuthState {
  authorization_state: {
    '@type': 'authorizationStateWaitEncryptionKey';
  };
}

export interface TUpdateWaitPhoneNumber extends TUpdateAuthState {
  authorization_state: {
    '@type': 'authorizationStateWaitPhoneNumber';
  };
}

export interface TUpdateAuthorizationState extends TUpdateAuthState {
  authorization_state: {
    '@type': 'updateAuthorizationState';
  };
}

export interface TAuthorizationStateClosed extends TUpdateAuthState {
  authorization_state: {
    '@type': 'authorizationStateClosed';
  };
}

export interface TAuthorizationStateReady extends TUpdateAuthState {
  authorization_state: {
    '@type': 'authorizationStateReady';
  };
}
