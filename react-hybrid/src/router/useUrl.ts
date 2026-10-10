import { useContext, useMemo, useSyncExternalStore } from 'react';
import { RouterContext } from './context';
import { ORIGIN } from '../constants/url';
import { URL_CHANGE_EVENT } from './navigation';

function getSnapshot() {
  return window.location.href;
}

function subscribe(listener: () => void) {
  window.addEventListener('popstate', listener);
  window.addEventListener('hashchange', listener);
  window.addEventListener(URL_CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener('popstate', listener);
    window.removeEventListener('hashchange', listener);
    window.removeEventListener(URL_CHANGE_EVENT, listener);
  };
}

export function useUrl() {
  const initialData = useContext(RouterContext);
  if (initialData === null) throw new Error('useUrl은 Router 내부에서 사용해야 합니다.');

  const serverSnapshot = initialData?.url;

  const href = useSyncExternalStore(subscribe, getSnapshot, () => {
    if (serverSnapshot === undefined) throw new Error('서버 렌더링에는 초기 URL이 필요합니다.');
    return serverSnapshot;
  });

  return useMemo(() => new URL(href, ORIGIN), [href]);
}
