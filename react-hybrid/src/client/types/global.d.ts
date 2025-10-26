declare global {
  interface Window {
    __INITIAL_DATA__: {
      page: 'home' | 'detail';
      initialData: {
        movies: MovieItem[];
        movieDetail?: MovieDetailResponse;
      };
    };
  }
}
export {};
