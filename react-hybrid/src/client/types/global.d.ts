declare global {
  interface Window {
    __INITIAL_DATA__: {
      movies: MovieItem[];
      movieId?: string;
    };
  }
}

export {};
