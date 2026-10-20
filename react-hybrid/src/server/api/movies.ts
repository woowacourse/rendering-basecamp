import { MovieResponse } from "../types/Movie.types";
import { MovieDetailResponse } from "../../client/types/MovieDetail.types";

import axios from "axios";

export const BASE_URL = "https://api.themoviedb.org/3";

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

if (!TMDB_ACCESS_TOKEN) {
  console.warn("TMDB_ACCESS_TOKEN 환경변수가 설정되지 않았습니다.");
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
  },
});

export const moviesApi = {
  /**
   * 인기 영화 목록 조회
   */
  getPopular: (page: number = 1) =>
    apiClient.get<MovieResponse>(`/movie/popular?page=${page}&language=ko-KR`),

  /**
   * 영화 상세 정보 조회
   */
  getDetail: (id: number) =>
    apiClient.get<MovieDetailResponse>(`/movie/${id}?language=ko-KR`),
} as const;
