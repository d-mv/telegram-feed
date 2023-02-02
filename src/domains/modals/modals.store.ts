import { atom } from 'recoil';

export const modalState = atom<string>({ key: 'modals', default: 'filter' });
