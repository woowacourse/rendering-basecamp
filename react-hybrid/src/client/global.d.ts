import { MovieItem } from "./types/Movie.types";
import { MovieDetailResponse } from "./types/MovieDetail.types";

export {};

declare global {
  interface Window {
    __INITIAL_DATA__?: {
      movies?: MovieItem[];
      movieDetail?: MovieDetailResponse;
    };
  }
}
