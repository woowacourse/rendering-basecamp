import { useEffect, useState } from 'react';
import { dispatchNavigationEvent } from './useNavigationEvent';

export const useHistory = (path?: string) => {
  const [currentPath, setCurrentPath] = useState(
    path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
  );

  useEffect(() => {
    const handlePopState = () => {
      const newPath = window.location.pathname;
      setCurrentPath(newPath);

      dispatchNavigationEvent(newPath);
    };
    handlePopState();

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState(null, '', to);
    setCurrentPath(to);
  };

  return { currentPath, navigate };
};
