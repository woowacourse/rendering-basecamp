import { useEffect, useState } from 'react';

const EMPTY_PROPS = {};

type Loader<T, TArgs> = (args: TArgs) => T | Promise<T>;
type LoaderState<T> =
  | { status: 'ready'; content: T }
  | { status: 'loading' }
  | { status: 'error'; error: unknown };

export function useLoader<T extends object, TArgs>(
  load: Loader<T, TArgs>, args: TArgs, key: string, initialData?: T,
): LoaderState<T>;
export function useLoader<TArgs>(
  load: undefined, args: TArgs, key: string,
): LoaderState<typeof EMPTY_PROPS>;
export function useLoader<T extends object, TArgs>(
  load: Loader<T, TArgs> | undefined, args: TArgs, key: string, initialData?: T,
): LoaderState<T | typeof EMPTY_PROPS>;
export function useLoader<T extends object, TArgs>(
  load: Loader<T, TArgs> | undefined,
  args: TArgs,
  key: string,
  initialData?: T,
): LoaderState<T | typeof EMPTY_PROPS> {
  const [result, setResult] = useState<LoaderState<T | typeof EMPTY_PROPS> & { key: string }>(() => ({
    key,
    ...(initialData === undefined ? { status: 'loading' } : { status: 'ready', content: initialData }),
  }));
  const isCurrent = result.key === key;

  useEffect(() => {
    let active = true;

    async function resolve() {
      if (isCurrent && result.status === 'ready') return;
      if (!load) {
        setResult({ key, status: 'ready', content: EMPTY_PROPS });
        return;
      }

      setResult({ key, status: 'loading' });
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

  if (!load) return { status: 'ready', content: EMPTY_PROPS };
  return isCurrent ? result : { status: 'loading' };
}
