declare global {
  interface Window {
    __INITIAL_DATA__: {
      movies: any[];
      movie?: any;
    };
  }
}

export {};
