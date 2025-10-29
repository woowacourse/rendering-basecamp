declare global {
  interface Window {
    __INITIAL_DATA__: {
      initialData: {
        movies: MovieItem[];
        movieDetail?: MovieDetailResponse;
      };
    };
  }
}
export {};
