import type { MovieItem } from './Movie.types';
import type { MovieDetailResponse } from './MovieDetail.types';

export interface InitialData {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse | null;
}

declare global {
  interface Window {
    __INITIAL_DATA__: InitialData;
  }
}
