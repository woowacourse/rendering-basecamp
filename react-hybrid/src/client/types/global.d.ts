declare global {
  interface Window {
    __INITIAL_DATA__: {
      movies: any[];
      movieId?: number;
      movieDetail?: any;
    };
  }
}

export {};
