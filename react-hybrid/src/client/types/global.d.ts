import { MovieItem } from "./Movie.types";
import { MovieDetailResponse } from "./MovieDetail.types";

export interface InitialData {
  movies: MovieItem[];
  selectedMovieDetail?: MovieDetailResponse;
}

declare global {
  interface Window {
    __INITIAL_DATA__: {
      routeType: "home" | "detail";
      initialData: InitialData;
    };
  }
}

export {};
