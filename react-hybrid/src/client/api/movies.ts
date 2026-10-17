import type { MovieDetailResponse } from "../types/MovieDetail.types";

/**
 * 브라우저에서 쓰는 API.
 * TMDB를 직접 부르지 않고 우리 서버의 /api 를 거친다. (토큰은 서버에만 있다)
 */
export const moviesApi = {
  getDetail: async (id: number): Promise<MovieDetailResponse> => {
    const response = await fetch(`/api/movies/${id}`);

    if (!response.ok) {
      throw new Error(`영화 상세 정보를 불러오지 못했습니다. (${response.status})`);
    }

    return response.json();
  },
} as const;
