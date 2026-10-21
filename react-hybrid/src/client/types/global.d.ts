import type { InitialData } from './InitialData.types';

declare global {
  interface Window {
    __INITIAL_DATA__: InitialData;
  }
}

export {};
