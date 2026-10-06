import { useSyncExternalStore } from 'react';
import { loadingEvents } from '@/lib/loadingEvents';

export const useDataLoading = () => {
  return useSyncExternalStore(
    loadingEvents.subscribe,
    loadingEvents.getSnapshot,
    loadingEvents.getServerSnapshot,
  );
};
