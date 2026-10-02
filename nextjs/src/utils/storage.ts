export const SessionStorage = {
  getItems<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const storedData = sessionStorage.getItem(key);
      const items: unknown = storedData ? JSON.parse(storedData) : [];
      return Array.isArray(items) ? items : [];
    } catch (error) {
      console.error('Failed to get items from sessionStorage:', error);
      return [];
    }
  },

  saveItems<T>(items: T[], key: string): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save items to sessionStorage:', error);
    }
  },
};
