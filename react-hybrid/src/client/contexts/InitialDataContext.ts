import { createContext, useContext } from "react";
import type { MovieItem } from "../types/Movie.types";
import type { MovieDetailResponse } from "../types/MovieDetail.types";

export type InitialData = {
  movies: MovieItem[];
  movieDetail?: MovieDetailResponse;
};

export const InitialDataContext = createContext<InitialData>({ movies: [] });

export const useInitialData = () => useContext(InitialDataContext);
