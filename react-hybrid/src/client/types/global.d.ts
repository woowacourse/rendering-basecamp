export interface InitialData {
  movies: MovieItem[];
  movie?: MovieDetailResponse;
}

declare global {
  interface Window {
    __INITIAL_DATA__: InitialData;
  }
}

export {};
