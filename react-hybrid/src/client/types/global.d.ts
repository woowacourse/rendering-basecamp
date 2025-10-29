declare global {
  interface Window {
    __INITIAL_DATA__: {
      movies: any[];
      movie?: any;
    };
    __INITIAL_ROUTE__: string;
  }
}

export {};
