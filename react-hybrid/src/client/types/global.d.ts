declare global {
  interface Window {
    __INITIAL_DATA__: {
      movies: any[];
      movieDetail?: any;
      url?: string;
    };
  }
}

export {};
