import axios from "axios";
import type { MovieResponse } from "../../client/types/Movie.types";
import type { MovieDetailResponse } from "../../client/types/MovieDetail.types";

export const BASE_URL = "https://api.themoviedb.org/3";

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!TMDB_ACCESS_TOKEN) {
  console.warn("TMDB_ACCESS_TOKEN 환경변수가 설정되지 않았습니다.");
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
  },
});

export const moviesApi = {
  getPopular: async (page: number = 1) => {
    const response = await apiClient.get<MovieResponse>(
      `/movie/popular?page=${page}&language=ko-KR`
    );
    return response.data;
  },

  getDetail: async (id: number) => {
    const response = await apiClient.get<MovieDetailResponse>(
      `/movie/${id}?language=ko-KR`
    );
    return response.data;
  },
} as const;
