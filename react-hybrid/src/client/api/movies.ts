import axios from "axios";
import type { MovieResponse } from "../types/Movie.types";
import type { MovieDetailResponse } from "../types/MovieDetail.types";

export const moviesApi = {
  getPopular: (page: number = 1) =>
    axios.get<MovieResponse>("/api/movies/popular", {
      params: { page },
    }),

  getDetail: (id: number) =>
    axios.get<MovieDetailResponse>(`/api/movies/${id}`),
} as const;
