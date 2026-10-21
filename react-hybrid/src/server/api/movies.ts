import axios from "axios";
import type { MovieResponse } from "../../client/types/Movie.types";
import type { MovieDetailResponse } from "../../client/types/MovieDetail.types";

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
});

export const moviesApi = {
  getPopular: (page = 1) =>
    tmdbClient.get<MovieResponse>(`/movie/popular?page=${page}&language=ko-KR`),
  getDetail: (id: number) =>
    tmdbClient.get<MovieDetailResponse>(`/movie/${id}?language=ko-KR`),
};
