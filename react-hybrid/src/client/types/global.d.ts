import { MovieItem } from "./Movie.types";
import { MovieDetailResponse } from "./MovieDetail.types";

declare global {
  interface Window {
    __INITIAL_DATA__: {
      routeType: "home" | "detail";
      initialData: {
        movies: MovieItem[];
        selectedMovieDetail?: MovieDetailResponse;
      };
    };
  }
}

export {};
