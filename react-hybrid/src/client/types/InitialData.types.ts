import type { MovieDetailResponse } from './MovieDetail.types';
import type { MovieItem } from './Movie.types';

export interface InitialData {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
}
