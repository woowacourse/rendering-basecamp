import type { InitialData } from './InitialData';

declare global {
  interface Window {
    __INITIAL_DATA__: InitialData;
  }
}

export {};
