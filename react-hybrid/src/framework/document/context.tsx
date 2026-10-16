import { createContext, useContext } from 'react';
import type { HeadTag } from '../head/store';
import type { PageData } from '../router/context';

export interface AppData {
  origin: string;
  head?: HeadTag[];
  assets?: Assets;
  initialPage?: PageData;
}

export interface Assets {
  scripts: string[];
  styles: string[];
}

export const AppDataContext = createContext<AppData | null>(null);

export function useAppData() {
  const data = useContext(AppDataContext);
  if (!data) throw new Error('앱 데이터가 필요합니다.');
  return data;
}

export const APP_DATA_ID = '__APP_DATA__';
