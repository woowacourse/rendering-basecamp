import { useEffect, useState } from 'react';
import { loadingEvents } from '@/lib/loadingEvents';
import type { QueryResult } from '@/types/Query.types';

export const useQuery = <T>(
  url: string | null,
  initialResult: QueryResult<T> | null = null,
) => {
  const [state, setState] = useState<{
    url: string | null;
    initialResult: QueryResult<T> | null;
    result: QueryResult<T> | null;
  }>({ url, initialResult, result: initialResult });

  if (state.url !== url || state.initialResult !== initialResult) {
    setState({
      url,
      initialResult,
      result: state.initialResult !== initialResult ? initialResult : null,
    });
  }

  useEffect(() => {
    if (!url || state.result) return;

    const controller = new AbortController();
    const endLoading = loadingEvents.start();

    const fetchData = async () => {
      try {
        let result: QueryResult<T>;

        try {
          const response = await fetch(url, { signal: controller.signal });
          result = await response.json();

          if (
            !result ||
            (result.error
              ? typeof result.error.message !== 'string' ||
                typeof result.error.status !== 'number'
              : !response.ok || result.data == null)
          ) {
            throw new Error('잘못된 API 응답입니다.');
          }
        } catch {
          result = {
            data: null,
            error: {
              status: 502,
              message: '정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
            },
          };
        }

        if (!controller.signal.aborted) {
          setState({ url, initialResult, result });
        }
      } finally {
        endLoading();
      }
    };

    void fetchData();

    return () => {
      controller.abort();
      endLoading();
    };
  }, [url, initialResult, state.result]);

  const result = state.url === url ? state.result : null;

  return {
    data: url ? result?.data ?? null : null,
    error: url && result?.error ? new Error(result.error.message) : null,
    isLoading: Boolean(url && !result),
  };
};
