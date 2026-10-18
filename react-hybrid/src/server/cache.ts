interface CacheEntry<T> {
  value: Promise<T>;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

/**
 * key에 해당하는 결과를 ttlMs 동안 서버 메모리에 보관한다.
 * - 유효한 값이 있으면 fetcher를 호출하지 않고 그대로 돌려준다.
 * - Promise를 저장하므로, 같은 key로 동시에 들어온 요청은 fetcher를 한 번만 호출한다.
 * - 요청이 실패하면 저장하지 않아, 다음 요청에서 다시 시도한다.
 */
export function cached<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expiresAt > Date.now()) {
    return entry.value;
  }

  const value = fetcher().catch((error) => {
    store.delete(key);
    throw error;
  });
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}
