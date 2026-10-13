import { createContext } from 'react';
import type { RouteProps } from '../../routes';

export interface PageData {
  path: string;
  props: RouteProps;
}

export const RouterContext = createContext<PageData | undefined | null>(null);
