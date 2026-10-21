import { createContext, useContext } from 'react';
import type { createHeadStore } from './store';

export const HeadContext = createContext<ReturnType<typeof createHeadStore> | null>(null);

export function useHeadStore() {
  const store = useContext(HeadContext);
  if (!store) throw new Error('Head는 HeadContext 내부에서 사용해야 합니다.');
  return store;
}

