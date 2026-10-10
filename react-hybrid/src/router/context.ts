import { createContext } from 'react';
import type { RouteProps } from '../routes';

export interface InitialData {
  url: string;
  props: RouteProps;
}

export const RouterContext = createContext<InitialData | undefined | null>(null);
