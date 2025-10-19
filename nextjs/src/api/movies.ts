import { apiClient } from '../lib/apiClient';
import type { MovieResponse } from '../types/Movie.types';
import type { MovieDetailResponse } from '../types/MovieDetail.types';

export const moviesApi = {
  getPopular: (page: number = 1) =>
    apiClient.get<MovieResponse>(`/movie/popular?page=${page}&language=ko-KR`),

  getDetail: (id: number) =>
    apiClient.get<MovieDetailResponse>(`/movie/${id}?language=ko-KR`),
} as const;
