import { useEffect, useState } from 'react';
import styles from './RouteLoading.module.css';

interface RouteLoadingProps {
  isLoading: boolean;
}

export const RouteLoading = ({ isLoading }: RouteLoadingProps) => {
  const [progress, setProgress] = useState<'loading' | 'complete' | null>(null);

  useEffect(() => {
    if (isLoading) {
      setProgress('loading');
      return;
    }

    setProgress(current => (current === null ? null : 'complete'));
    const timer = setTimeout(() => setProgress(null), 200);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div role="status" aria-live="polite">
      {progress !== null && (
        <>
          <span className={styles.label}>
            {progress === 'complete' ? '요청 처리가 끝났습니다.' : '페이지를 불러오는 중입니다.'}
          </span>
          <div
            className={`${styles.progress} ${progress === 'complete' ? styles.complete : ''}`}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
};
