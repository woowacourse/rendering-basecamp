import type { MovieItem } from './Movie.types';
import type { MovieDetailResponse } from './MovieDetail.types';

export type InitialData =
  | { page: 'home'; movies: MovieItem[] }
  | { page: 'detail'; movies: MovieItem[]; movieDetail: MovieDetailResponse };
