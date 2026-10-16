import { useEffect, useState } from 'react';
import { ROUTE_CHANGE_START_EVENT, ROUTE_CHANGE_COMPLETE_EVENT, ROUTE_CHANGE_ERROR_EVENT } from '../framework/router/navigation';

export function RouteLoading() {
  const [progress, setProgress] = useState<'loading' | 'complete' | null>(null);

  useEffect(() => {
    let previousUrl = new URL(window.location.href);
    let timer: ReturnType<typeof setTimeout>;

    const handleStart = () => {
      const url = new URL(window.location.href);
      const changed = url.pathname !== previousUrl.pathname || url.search !== previousUrl.search;
      previousUrl = url;
      if (!changed) return;
      clearTimeout(timer);
      setProgress('loading');
    };
    const handleComplete = () => {
      clearTimeout(timer);
      setProgress(current => (current === null ? null : 'complete'));
      timer = setTimeout(() => setProgress(null), 200);
    };

    window.addEventListener(ROUTE_CHANGE_START_EVENT, handleStart);
    window.addEventListener('popstate', handleStart);
    window.addEventListener(ROUTE_CHANGE_COMPLETE_EVENT, handleComplete);
    window.addEventListener(ROUTE_CHANGE_ERROR_EVENT, handleComplete);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(ROUTE_CHANGE_START_EVENT, handleStart);
      window.removeEventListener('popstate', handleStart);
      window.removeEventListener(ROUTE_CHANGE_COMPLETE_EVENT, handleComplete);
      window.removeEventListener(ROUTE_CHANGE_ERROR_EVENT, handleComplete);
    };
  }, []);

  return (
    <div role="status" aria-live="polite">
      {progress !== null && (
        <>
          <span className="route-progress-label">
            {progress === 'complete' ? '요청 처리가 끝났습니다.' : '페이지를 불러오는 중입니다.'}
          </span>
          <div className={`route-progress ${progress === 'complete' ? 'complete' : ''}`} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
