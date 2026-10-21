import { apiClient } from '../lib/apiClient';
import type { MovieDetail } from '../types/MovieDetail.types';

export const moviesApi = {
  /**
   * 영화 상세 정보 조회 (서버의 TMDB 프록시를 거친다)
   */
  getDetail: (id: number) =>
    apiClient.get<MovieDetail>(`/movies/${id}`),
} as const;
