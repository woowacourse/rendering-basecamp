import { MovieResponse } from "../types/Movie.types";
import { MovieDetailResponse } from "../types/MovieDetail.types";
import { apiClient } from "./apiClient";

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
