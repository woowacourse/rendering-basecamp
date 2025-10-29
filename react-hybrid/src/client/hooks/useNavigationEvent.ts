import { useEffect } from 'react';

export const dispatchNavigationEvent = (path: string) => {
  window.dispatchEvent(new CustomEvent('navigation', { detail: { path } }));
};

export const useNavigationEvent = (callback: (path: string) => void) => {
  useEffect(() => {
    const handleNavigation = (event: Event) => {
      const customEvent = event as CustomEvent<{ path: string }>;
      callback(customEvent.detail.path);
    };

    window.addEventListener('navigation', handleNavigation);
    return () => window.removeEventListener('navigation', handleNavigation);
  }, [callback]);
};
