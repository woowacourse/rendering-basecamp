import { MovieItem } from "./Movie.types";
import { MovieDetailResponse } from "./MovieDetail.types";

export type InitialMovieData = {
  movies?: MovieItem[];
  movieDetail?: MovieDetailResponse;
};

export type WindowWithInitialData = {
  path: string;
} & InitialMovieData;

declare global {
  interface Window {
    __INITIAL_DATA__: WindowWithInitialData;
  }
}

export {};
