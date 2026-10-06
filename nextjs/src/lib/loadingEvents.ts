type LoadingEvent = {
  type: 'start' | 'end';
  id: symbol;
};

const pending = new Set<symbol>();
const listeners = new Set<(event: LoadingEvent) => void>();

const emit = (event: LoadingEvent) => {
  listeners.forEach(listener => listener(event));
};

export const loadingEvents = {
  start() {
    const id = Symbol('loading');

    pending.add(id);
    emit({ type: 'start', id });

    return () => {
      if (!pending.delete(id)) return;

      emit({ type: 'end', id });
    };
  },

  subscribe(listener: (event: LoadingEvent) => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot: () => pending.size > 0,
  getServerSnapshot: () => false,
};
