import { MovieItem } from "./Movie.types";
import { MovieDetailResponse } from "./MovieDetail.types";

export type InitialMovieData = {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
};

declare global {
  interface Window {
    __INITIAL_DATA__: InitialMovieData;
  }
}

export {};
