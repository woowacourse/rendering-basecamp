import { useContext, useMemo, useSyncExternalStore } from 'react';
import { RouterContext } from './context';
import { FAKE_ORIGIN } from '../constants/url';
import { ROUTE_CHANGE_START_EVENT } from './navigation';

function getSnapshot() {
  return window.location.href;
}

function subscribe(listener: () => void) {
  window.addEventListener('popstate', listener);
  window.addEventListener('hashchange', listener);
  window.addEventListener(ROUTE_CHANGE_START_EVENT, listener);

  return () => {
    window.removeEventListener('popstate', listener);
    window.removeEventListener('hashchange', listener);
    window.removeEventListener(ROUTE_CHANGE_START_EVENT, listener);
  };
}

export function useLocation() {
  const initialPageData = useContext(RouterContext);

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => {
    const serverSnapshot = initialPageData?.path;

    if (serverSnapshot === undefined) {
      throw new Error('서버 렌더링과 하이드레이션에는 초기 경로가 필요합니다.');
    }

    if (!URL.canParse(serverSnapshot, FAKE_ORIGIN) || new URL(serverSnapshot, FAKE_ORIGIN).origin !== FAKE_ORIGIN) {
      throw new Error('초기 경로는 오리진을 포함하지 않는 유효한 경로여야 합니다.');
    }

    return serverSnapshot;
  });

  return useMemo(() => {
    const { pathname, search, hash } = new URL(snapshot, FAKE_ORIGIN);
    return { path: pathname + search + hash, pathname, search, hash };
  }, [snapshot]);
}
