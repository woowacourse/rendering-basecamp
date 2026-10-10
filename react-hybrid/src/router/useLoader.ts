import { useEffect, useState } from 'react';

type Loader<T, TArgs> = (args: TArgs) => T | Promise<T>;
type LoaderState<T> =
  | { status: 'ready'; content: T | undefined }
  | { status: 'loading' }
  | { status: 'error'; error: unknown };

export function useLoader<T, TArgs>(
  load: Loader<T, TArgs> | undefined,
  args: TArgs,
  key: string,
  initialData?: T,
): LoaderState<T> {
  const [result, setResult] = useState<LoaderState<T> & { key: string }>(() => ({
    key,
    ...(initialData === undefined ? { status: 'loading' } : { status: 'ready', content: initialData }),
  }));
  const isCurrent = result.key === key;

  useEffect(() => {
    if (isCurrent && result.status === 'ready') return;
    if (!load) {
      setResult({ key, status: 'ready', content: undefined });
      return;
    }

    setResult({ key, status: 'loading' });
    let active = true;

    async function resolve() {
      try {
        const content = await load(args);
        if (active) setResult({ key, status: 'ready', content });
      } catch (error) {
        if (active) setResult({ key, status: 'error', error });
      }
    }

    void resolve();

    return () => {
      active = false;
    };
  }, [key]);

  if (!load) return { status: 'ready', content: undefined };
  return isCurrent ? result : { status: 'loading' };
}
