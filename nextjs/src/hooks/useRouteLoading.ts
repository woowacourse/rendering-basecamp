import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const useRouteLoading = () => {
  const { events } = useRouter();
  const [loadingUrl, setLoadingUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleStart = (url: string) => setLoadingUrl(url);

    const handleComplete = (url: string) => {
      setLoadingUrl(current => (current === url ? null : current));
    };

    const handleError = (_error: unknown, url: string) => handleComplete(url);

    events.on('routeChangeStart', handleStart);
    events.on('routeChangeComplete', handleComplete);
    events.on('routeChangeError', handleError);

    return () => {
      events.off('routeChangeStart', handleStart);
      events.off('routeChangeComplete', handleComplete);
      events.off('routeChangeError', handleError);
    };
  }, [events]);

  return loadingUrl !== null;
};
