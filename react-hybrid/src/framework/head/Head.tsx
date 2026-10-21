import { useEffect, useId, type ReactNode } from 'react';
import { useHeadStore } from './context';
import { collect } from './tags';
import { isBrowser } from '../isBrowser';

export default function Head({ children }: { children?: ReactNode }) {
  const store = useHeadStore();
  const id = useId();
  if (!isBrowser()) store.set(id, collect(children), true);
  useEffect(() => { store.set(id, collect(children)); }, [store, id, children]);
  useEffect(() => () => store.remove(id), [store, id]);
  return null;
}

