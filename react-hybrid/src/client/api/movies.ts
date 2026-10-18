import type { MovieDetailResponse } from '../types/MovieDetail.types';

export const moviesApi = {
  /**
   * 영화 상세 정보 조회
   * TMDB 토큰을 브라우저에 노출하지 않도록 서버의 /api/movies/:id를 거친다.
   */
  getDetail: async (id: number): Promise<MovieDetailResponse> => {
    const response = await fetch(`/api/movies/${id}`);
    if (!response.ok) {
      throw new Error('영화 상세 정보를 불러오는데 실패했습니다.');
    }
    return response.json();
  },
} as const;
