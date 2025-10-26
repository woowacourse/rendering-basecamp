declare global {
  interface Window {
    __INITIAL_DATA__: {
      movies: MovieItem[];
      detail: MovieDetailResponse;
    };
  }
}

export {};
