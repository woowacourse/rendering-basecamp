declare global {
  interface Window {
    __INITIAL_DATA__: {
      movies: MovieItem[];
      detailMovie: MovieDetailResponse;
    };
  }
}

export {};
