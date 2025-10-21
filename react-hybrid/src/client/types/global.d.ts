export interface InitialData {
  movies: MovieItem[];
  movie?: MovieDetailResponse;
}
declare global {
  interface Window {
    __INITIAL_DATA__: InitialData;
    __INITIAL_PATH__: string;
  }
}

export {};
