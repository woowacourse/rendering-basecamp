import type { MovieDetailResponse } from '../types/MovieDetail.types';

export const moviesApi = {
  /**
   * 영화 상세 정보 조회 (TMDB 토큰을 숨기기 위해 SSR 서버의 API 를 거친다)
   */
  getDetail: async (id: number): Promise<MovieDetailResponse> => {
    const response = await fetch(`/api/movies/${id}`);

    if (!response.ok) {
      throw new Error('영화 상세 정보를 불러오는데 실패했습니다.');
    }

    return response.json();
  },
} as const;
