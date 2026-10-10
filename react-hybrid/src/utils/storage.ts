export const SessionStorage = {
  getItems<T>(key: string): T[] {
    try {
      const storedData = sessionStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('Failed to get items from sessionStorage:', error);
      return [];
    }
  },

  saveItems<T>(items: T[], key: string): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save items to sessionStorage:', error);
    }
  },
};
