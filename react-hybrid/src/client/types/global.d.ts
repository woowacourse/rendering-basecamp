import type { MovieDetailResponse } from './MovieDetail.types';
import type { MovieItem } from './Movie.types';

declare global {
  type InitialData = {
    page: 'home' | 'detail';
    movies: MovieItem[] | null;
    movieId?: number;
    movieDetail?: MovieDetailResponse | null;
  };

  interface Window {
    __INITIAL_DATA__: InitialData;
  }
}

export {};
