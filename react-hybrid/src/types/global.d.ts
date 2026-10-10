import type { InitialData } from '../router/context';

declare global {
  interface Window {
    __INITIAL_DATA__?: InitialData;
  }
}

export {};
