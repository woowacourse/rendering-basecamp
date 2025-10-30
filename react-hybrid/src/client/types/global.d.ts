import { MovieItem } from './Movie.types';
import { MovieDetailResponse } from './MovieDetail.types';

declare global {
  interface Window {
    __INITIAL_DATA__: {
      popularMovieList: MovieItem[] | null;
      movieDetail: MovieDetailResponse | null;
    };
  }
}

export {};
