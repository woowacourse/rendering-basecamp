import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './RouteLoading.module.css';

export const RouteLoading = () => {
  const { events } = useRouter();
  const [progress, setProgress] = useState<{ url: string; complete: boolean } | null>(null);

  useEffect(() => {
    let activeUrl: string | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const handleStart = (url: string) => {
      clearTimeout(hideTimer);
      activeUrl = url;
      setProgress({ url, complete: false });
    };
    const handleComplete = (url: string) => {
      if (activeUrl !== url) return;
      activeUrl = null;
      setProgress({ url, complete: true });
      hideTimer = setTimeout(() => setProgress(null), 200);
    };
    const handleError = (_error: unknown, url: string) => {
      if (activeUrl !== url) return;
      activeUrl = null;
      clearTimeout(hideTimer);
      setProgress(null);
    };

    events.on('routeChangeStart', handleStart);
    events.on('routeChangeComplete', handleComplete);
    events.on('routeChangeError', handleError);

    return () => {
      clearTimeout(hideTimer);
      events.off('routeChangeStart', handleStart);
      events.off('routeChangeComplete', handleComplete);
      events.off('routeChangeError', handleError);
    };
  }, [events]);

  return (
    <div role="status" aria-live="polite">
      {progress !== null && (
        <>
          <span className={styles.label}>
            {progress.complete ? '페이지를 불러왔습니다.' : '페이지를 불러오는 중입니다.'}
          </span>
          <div
            key={progress.url}
            className={`${styles.progress} ${progress.complete ? styles.complete : ''}`}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
};
